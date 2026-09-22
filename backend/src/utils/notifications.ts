import nodemailer from 'nodemailer';
import { Vonage } from '@vonage/server-sdk';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
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

export const sendResetPasswordWithOTP = async (email: string, otp: string, userId: string) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${otp}&userId=${userId}`;
  
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`[EMAIL SIMULATION] Reset to: ${email} - OTP: ${otp} - Link: ${resetLink}`);
      return true;
    }

    const info = await transporter.sendMail({
      from: `"ShopEasy" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `ShopEasy - Reset Your Password`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.7; padding: 32px; background: #f8fafc; border-radius: 12px;">
          <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
            <h2 style="color: #2874f0; font-size: 22px; margin-bottom: 4px;">Password Reset Request</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">ShopEasy Security Team</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            
            <p>Hi there,</p>
            <p>We received a request to reset your ShopEasy account password. Use either option below:</p>
            
            <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Your OTP Code</p>
              <p style="margin: 0; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e293b;">${otp}</p>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">Valid for 15 minutes</p>
            </div>
            
            <p style="text-align: center; color: #64748b; font-size: 13px; margin-bottom: 16px;">— or click the button below —</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetLink}" style="background-color: #2874f0; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">If you did not request a password reset, please ignore this email. Your account is safe.</p>
          </div>
        </div>
      `
    });
    console.log(`Reset email sent to ${email}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending reset email:', error);
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
