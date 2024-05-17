import nodemailer from "nodemailer";
import getMailHtml from "./getMailHtml";
import getMailText from "./getMailText";

export default async function sendMail({
  userName,
  email,
  token,
  type = "VERIFY",
}: {
  userName: string;
  email: string;
  token: string;
  type?: "VERIFY" | "RESET";
}) {
  const transporter = nodemailer.createTransport({
    host: String(process.env.MAIL_SERVER_HOST!),
    port: Number(process.env.MAIL_SERVER_PORT!),
    secure: Number(process.env.MAIL_SERVER_PORT!) === 465 ? true : false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: String(process.env.MAIL_SENDER_USERID!),
      pass: String(process.env.MAIL_SENDER_PASSWORD!),
    },
  });

  const mailOptions = {
    from: `"Podstar" ${process.env.SENDER_EMAIL_ID}`, // sender address
    to: email, // list of receivers
    subject: type === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
    text: getMailText({ userName, token, type }), // plain text body
    html: getMailHtml({ userName, token, type }), // html body
  };

  const mailRes = await transporter.sendMail(mailOptions);
  return mailRes;
}
