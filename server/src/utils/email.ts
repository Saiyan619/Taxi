import { BrevoClient } from '@getbrevo/brevo';

// Initialize the Brevo Client using the modern constructor syntax
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || 'YOUR_BREVO_API_KEY_HERE',
});

/**
 * Sends a verification email without needing a custom domain.
 */
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationLink = `http://localhost:5173/verify-email?token=${token}`;
  console.log(token)
  try {
    // Directly invoke the transactionalEmails namespace on the client instance
    await brevo.transactionalEmails.sendTransacEmail({
      subject: "Verify your Taxi App Account",
      
      // Use your personal email address that you registered with Brevo here
      sender: { 
        name: "Taxi App Admin", 
        email: "arokoyueb11@gmail.com" 
      },
      
      // Who the email is going to
      to: [{ email: email }],
      
      // The email content
      htmlContent: `
        <h1>Welcome to Taxi App!</h1>
        <p>Please click the link below to verify your account</p>
        <p><a href="${verificationLink}">Verify Email Address</a></p>
      `,
    });

    console.log(`Verification email sent successfully via Brevo to ${email}`);
  } catch (error) {
    console.error('Brevo Email failed:', error);
    // throw new Error('Email delivery failed');
  }
};


/**
 * Sends a reuqest rest password email without needing a custom domain.
 */
export const sendRequestPassResetEmail = async (email: string, token: string): Promise<void> => {
  const verificationLink = `http://localhost:5173/reset-password/${token}`;
  console.log(token)
  try {
    // Directly invoke the transactionalEmails namespace on the client instance
    await brevo.transactionalEmails.sendTransacEmail({
      subject: "Reset your Taxi App Account Password",
      
      // Use your personal email address that you registered with Brevo here
      sender: { 
        name: "Taxi App Admin", 
        email: "arokoyueb11@gmail.com" 
      },
      
      // Who the email is going to
      to: [{ email: email }],
      
      // The email content
      htmlContent: `
        <h1>Welcome to Taxi App!</h1>
        <p>Please click the link below to verify and reset your password</p>
        <p><a href="${verificationLink}">Reset Account Password</a></p>
      `,
    });

    console.log(`Reset Password email sent successfully via Brevo to ${email}`);
  } catch (error) {
    console.error('Brevo Email failed:', error);
    // throw new Error('Email delivery failed');
  }
};
