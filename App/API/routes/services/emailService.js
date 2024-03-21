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
    // Ensure your FRONTEND_URL points to the Vue.js application URL
    // e.g., https://your-vue-app.com or http://localhost:8080
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #4A90E2;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            line-height: 1.6;
        }
        .verify-button {
            display: inline-block;
            background-color: #32a852; /* More vibrant green */
            color: #ffffff;
            padding: 12px 25px;
            font-size: 18px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px 0; /* Add some margin for spacing */
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .verify-button:hover {
            background-color: #286442; /* Darker green on hover */
        }
        a {
            color: #4A90E2;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 20px;
            }
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
                <a href="${verificationLink}" class="verify-button">Verify Email</a>
                <p>If the button above does not work, copy and paste the following link in your browser:</p>
                <p><a href="${verificationLink}">${verificationLink}</a></p>
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
