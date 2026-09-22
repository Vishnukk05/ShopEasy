import nodemailer from 'nodemailer';
import { Vonage } from '@vonage/server-sdk';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

let vonageClient: any = null;
if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET) {
  vonageClient = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
  });
}

export const sendEmailOTP = async (email: string, otp: string) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`[EMAIL SIMULATION] Sent to: ${email} - OTP: ${otp}`);
      return true;
    }

    const info = await transporter.sendMail({
      from: `"ShopEasy" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `ShopEasy - Your OTP is ${otp}`,
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
            <p>Welcome to ShopEasy! Your OTP is <strong>${otp}</strong>, valid for 5 minutes. Please do not share it with anyone. Thank you for choosing ShopEasy!</p>
          </div>
        `
    });
    console.log(`Real email sent to ${email}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendOrderStatusEmail = async (email: string, orderId: string, status: string) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`[EMAIL SIMULATION] To: ${email} - Order ${orderId} is now ${status}`);
      return true;
    }

    await transporter.sendMail({
      from: `"ShopEasy" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `ShopEasy Order Update: ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2874f0;">Order Update</h2>
          <p>Your order <strong>#${orderId}</strong> status has been updated to:</p>
          <h2 style="color: #333;">${status.replace(/_/g, ' ')}</h2>
          <p style="color: #666; font-size: 14px;">Thank you for shopping with ShopEasy!</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending order email:', error);
    return false;
  }
};

export const sendSmsOTP = async (phone: string, otp: string) => {
  if (!vonageClient) {
    console.log('=============================================');
    console.log(`[SMS SIMULATION] Sent to: ${phone}`);
    console.log(`[SMS SIMULATION] Message: Your ShopEasy verification code is: ${otp}. It expires in 10 minutes.`);
    console.log('=============================================');
    return true;
  }

  try {
    const formattedPhone = phone.startsWith('+') ? phone.replace('+', '') : `91${phone}`;
    await vonageClient.sms.send({
      to: formattedPhone,
      from: 'ShopEasy',
      text: `Welcome to ShopEasy! Your OTP is ${otp}, valid for 5 minutes. Please do not share it with anyone. Thank you for choosing ShopEasy!`
    });
    console.log(`Real SMS sent to ${phone}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS via Vonage (Trial limits or Unverified number):', error);
    console.log('=============================================');
    console.log(`[FALLBACK SMS SIMULATION] Sent to: ${phone}`);
    console.log(`[FALLBACK SMS SIMULATION] OTP is: ${otp}`);
    console.log('=============================================');
    return true;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
