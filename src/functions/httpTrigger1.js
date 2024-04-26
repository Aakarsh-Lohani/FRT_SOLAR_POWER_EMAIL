const { app } = require('@azure/functions');
const nodemailer = require('nodemailer');

app.http('httpTrigger1', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const email =  decodeURIComponent(await request.text()).replace('email=','');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Access the EMAIL environment variable
                pass: process.env.PASSWORD // Access the PASSWORD environment variable
            }
        });

        let mailOptions1 = {
            from: process.env.EMAIL, // sender address
            to: process.env.EMAIL, // receiver address
            subject: 'New Contact Request',
            text: `Email: ${email}`,
        };

        let mailOptions2 = {
            from: process.env.EMAIL, // sender address
            to: email, // receiver address
            subject: 'Welcome to Solar Power Website',
            text: 'Contact sales was successful. Welcome to Solar Power Website!',
        };

        try {
            await transporter.sendMail(mailOptions1);
            await transporter.sendMail(mailOptions2);
            context.log('Emails sent.');
            return { body: `Emails sent to ${email}` };
        } catch (error) {
            context.log('Error sending emails: ', error);
            return { status: 500, body: 'Error sending emails.' };
        }
    }
});
