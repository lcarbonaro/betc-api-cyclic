var http = require('http');
http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`)


    const nodemailer = require('nodemailer');

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
        subject: 'Subject',
        text: 'Email content'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });


    res.write('YoGee!');
    res.end();

}).listen(process.env.PORT || 3000);