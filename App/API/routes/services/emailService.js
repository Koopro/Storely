const nodemailer = require('nodemailer');

// Setup nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendVerificationEmail(userEmail, verificationToken) {
    const emailTemplate = `
    <html>
    <head>
        <style>
            .email-container {
                padding: 20px;
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                color: #333;
                border-radius: 5px;
            }
            .email-header {
                background-color: #007bff;
                color: #ffffff;
                padding: 10px;
                text-align: center;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
            }
            .email-body {
                padding: 20px;
            }
            .verify-button {
                display: block;
                width: 100%;
                max-width: 200px;
                background-color: #28a745;
                color: #ffffff;
                padding: 10px;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px auto 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>Email Verification</h1>
            </div>
            <div class="email-body">
                <p>Hello,</p>
                <p>Thank you for registering. Please click the button below to verify your email address and complete the registration process.</p>
                <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}" class="verify-button">Verify Email</a>
                <p>If the button above does not work, copy and paste the following link in your browser:</p>
                <p><a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}">${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}</a></p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: userEmail,
        subject: 'Verify your email',
        html: emailTemplate,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.response);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

module.exports = { sendVerificationEmail };
