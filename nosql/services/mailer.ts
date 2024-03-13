import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
  
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const mailer = async (email:string, token:number) => {
  const info = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "OTP Verification",
    html: `<div> Hi ! Your OTP Code is <b>${token}</b></div>`,
  });
  return info.messageId;
};


