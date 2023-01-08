const http = require('http');
const nodemailer = require('nodemailer');

http.createServer(async function (req, res) {
    //console.log(`Just got a request at ${req.url}!`)
    let data = await getData();

    let today = new Date();
    let numberOfDaysToAdd = 3;
    let futureDate = today.setDate(today.getDate() + numberOfDaysToAdd);
    let occDate;

    let msgData = data.filter(r => {
        occDate = new Date();
        occDate.setMonth( parseInt(r.MthNum,10) );
        occDate.setDate(  parseInt(r.Day,10) );
        return occDate <= futureDate;
    });

    if( msgData.length ) {

        let emailData = msgData.map(r => {
            return `<li>${r.Month}&nbsp;${r.Day} - ${r.Occasion} of ${r.Name} (${r.Relation})</li>`;
        });

        let emailHtml = `<ul>${emailData.join(' ')}</ul>`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.NODEMAILER_GMAIL_APP_PWD
            }
        });
    
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: process.env.TO_EMAIL,
            subject: 'WHATEVER Subject test2',
            html: 'SOME whatever Email content test2'
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                // do something useful
            }
        });
    
        res.write('Email sent');
        res.end();

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