import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReceiptEmail = async (to, planDetails, transactionDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Invoice and Plan Details - Twitter Subscription",
    html: `
      <h1> Thank you for your subscription!</h1>
      <p>Plan: ${planDetails.name}</p>
      <p>Amount: ${planDetails.amount}</p>
      
      <p>Transaction ID: ${transactionDetails.razorpay_payment_id}</p>
      <p>Date: ${new Date().toLocaleString()}</p>
      <p>for support visit twitter@support.com</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Receipt email sent successfully");
  } catch (error) {
    console.error("Error sending receipt email:", error);
  }
};

export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Your OTP for Language Change",
    html: `
      <h1>Your One-Time Password (OTP)</h1>
      <p>Your OTP for changing language preference is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

export default sendOTPEmail;

