export default function getMailText({
  userName,
  token,
  type = "VERIFY",
}: {
  userName: string;
  token: string;
  type?: "VERIFY" | "RESET";
}) {
  return `
  Welcome ${userName},\n
  ${
    type === "VERIFY"
      ? "Thank you for signing up with our service. To complete your registration, please verify your email address by copy and paste the link below in your browser.:"
      : "To complete reset your password by copy and paste the link below in your browser.:"
  }\n
  ${process.env.CLIENT_BASE_URL!}/${
    type === "VERIFY" ? `verify-email` : `reset-password`
  }?token=${token}\n
  If you didn't request this, you can safely ignore this email.\nRegards, The Podstar Team
  `;
}
