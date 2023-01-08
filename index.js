var http = require('http');
http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`)


    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: process.env.TO_EMAIL,
        from: process.env.FROM_EMAIL, // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    //ES8
    (async () => {
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }
    })();


    res.write('Yo!');
    res.end();
    
}).listen(process.env.PORT || 3000);