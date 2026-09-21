export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`[EMAIL SIMULATION] Reset Link to: ${email} - Link: ${resetLink}`);
      return true;
    }

    const info = await transporter.sendMail({
      from: `"ShopEasy" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `ShopEasy - Reset Your Password`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <p>Hi Customer,</p>
          <p>You recently requested to reset your password for your ShopEasy account.</p>
          <p>Click the link below to reset it:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2874f0; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </p>
          <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          <p>Best regards,<br>The ShopEasy Security Team</p>
        </div>
      `
    });
    console.log(`Real reset email sent to ${email}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending reset email:', error);
    return false;
  }
};

