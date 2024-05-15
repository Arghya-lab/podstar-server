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
      ? "Thank you for signing up with our service. To complete your registration, please verify your email address by copy and paste the link below in your browser:"
      : "Your reset password token is in below:"
  }
  ${
    type === "VERIFY"
      ? `${process.env.CLIENT_BASE_URL!}/verify-email?token=${token}`
      : token
  }
    
  
  If you didn't request this, you can safely ignore this email.\nRegards, The Podstar Team
  `;
}
