const http = require('http');
const nodemailer = require('nodemailer');

http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`)    

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
        subject: 'WHATEVER Subject',
        text: 'SOME whatever Email content'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });

    res.write('YoGee2!');
    res.end();

}).listen(process.env.PORT || 3000);