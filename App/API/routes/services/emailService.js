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
    <html>
    <head>
        <style>
            .email-container { /* Styles unchanged, omitted for brevity */ }
            .email-header { /* Styles unchanged, omitted for brevity */ }
            .email-body { /* Styles unchanged, omitted for brevity */ }
            .verify-button {
                display: inline-block; /* Allows the width and height to be set */
                width: auto; /* Adjust width as needed or set to auto for content width */
                padding: 10px 20px; /* Padding inside the button */
                background-color: #7732a6; /* Green background */
                color: white; /* White text color */
                text-align: center; /* Center the text inside the button */
                text-decoration: none; /* Remove underline from links */
                font-weight: bold; /* Make the font bold */
                border-radius: 5px; /* Rounded corners */
                border: none; /* No border */
                cursor: pointer; /* Change mouse cursor to pointer when over the button */
                transition: background-color 0.3s; /* Smooth transition for hover effect */
              }
              
              .verify-button:hover {
                background-color: #7732a8; /* Darker shade of green on hover */
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
