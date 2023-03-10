const http = require('http');
const nodemailer = require('nodemailer');

http.createServer(async function (req, res) {
    //console.log(`Just got a request at ${req.url}!`)
    let {rows:data} = await getData();

    //console.log(`got ${data.length} rows`);

    let today = new Date();
    let numberOfDaysToAdd = 2;
    let futureDate = today.setDate(today.getDate() + numberOfDaysToAdd);    
    futureDate = new Date(futureDate);
    futureDate.setHours(23);
    futureDate.setMinutes(59);
    futureDate.setSeconds(59);
    //futureDate = new Date(futureDate);

    //console.log(`future date cut-off is ${ new Date(futureDate) }`);

    let occDate;

    let msgData = data.filter(r => {
        occDate = new Date();
        occDate.setMonth( parseInt(r.MthNum,10) - 1);
        occDate.setDate(  parseInt(r.Day,10) );
        occDate.setHours(0);
        occDate.setMinutes(0);
        occDate.setSeconds(0);
        //console.log(`occ date is ${ new Date(occDate) }`);
        return (occDate > new Date()) && (occDate <= futureDate);
    });

    console.log(`have ${msgData.length} upcoming bdays etc between now and ${new Date(futureDate)}`);

    if( msgData.length ) {        

        let emailData = msgData.map(r => {
            return `<li>${r.Month} ${r.Day} - ${r.Occasion} of ${r.Name} (${r.Relation})</li>`;
        });

        let emailHtml = `<p>Upcoming:</p><ul>${emailData.join(' ')}</ul>`;
        emailHtml += `<br/><p>For more upcoming occasions, check out <a href="https://birthdaysetc.vercel.app/">Birthdays Etc.</a>.</p>`;

        //console.log(emailHtml);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.NODEMAILER_GMAIL_APP_PWD
            }
        });
    
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: [process.env.TO_EMAIL_1,process.env.TO_EMAIL_2],
            subject: 'Upcoming Birthdays Etc.',
            html: emailHtml
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('**** ERROR SENDING E-MAIL ****');
                res.write(error);
                res.end();
            } else {
                console.log('E-mail sent: ' + info.response);
                res.write('E-mail sent: ' + info.response);
                res.end();
            }
        });        

    }  // if( msgData.length )

}).listen(process.env.PORT || 3000);

async function getData() {
    let resp = await fetch("https://birthdaysetc.vercel.app/api/getNext?id=1yTj5mU3EnR4AesESbDNOEU3B0GV8Nox_z0PnkSgHxpw&integers=false&columns=false&sheet=1&q=", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://birthdaysetc.vercel.app/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });
    let respJson = await resp.json();
    return respJson;    
}