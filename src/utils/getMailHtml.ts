export default function getMailHtml({
  userName,
  token,
  type = "VERIFY",
}: {
  userName: string;
  token: string;
  type?: "VERIFY" | "RESET";
}) {
  return `
   <table style="width:100%;border-collapse:collapse;border-spacing:0;table-layout:fixed;padding:0;border:0"
    height="100%">
    <tbody>
      <tr style="padding:0">
        <td
          style="border-collapse:collapse!important;word-break:break-word;min-width:100%;width:100%!important;margin:0;padding:0"
          align="center" valign="top">
          <h1
            style="word-break:normal;font-size:36px;font-weight:900; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; line-height:21px;padding-bottom:5px; padding-top: 10px; margin:0">
            Podstar</h1>
          <table
            style="width:580px;border-collapse:separate;border-spacing:0;table-layout:auto;border-radius:8px;margin-top:24px;padding:0;border:1px solid #eee"
            bgcolor="#fff">
            <tbody>
              <tr style="padding:0">
                <td style="border-collapse:collapse!important;word-break:break-word;padding:24px 32px 30px" align="left"
                  valign="top">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="border-collapse:collapse;border-spacing:0;table-layout:auto;padding:0;border:0">
                    <tbody>
                      <tr style="padding:0">
                        <td align="left" valign="middle"
                          style="border-collapse:collapse!important;word-break:break-word;padding:0">
                          <h1
                            style="word-break:normal;font-size:18px;font-weight:700;line-height:21px;padding-bottom:10px;margin:0">
                            Welcome <span style="color:#4c83ee!important">${userName}</span>!</h1>
                          <p style="font-size:14px;padding-bottom:10px;margin:0">Thank you for signing up for Podstar.
                          </p>
                          <p style="font-size:14px;padding-bottom:10px;margin:0">${
                            type === "VERIFY"
                              ? "To complete your registration, please verify your email address by clicking the button below:"
                              : "Your reset password token is in below:"
                          }</p>
                        </td>
                      </tr>
                      <tr style="padding:0">
                        <td align="center" valign="middle"
                          style="border-collapse:collapse!important;word-break:break-word;padding:25px 0 35px">
                          <table border="0" cellpadding="0" cellspacing="0" width="335"
                            style="border-collapse:separate;border-spacing:0;table-layout:auto;width:auto;padding:0;border:0">
                            <tbody>
                              <tr style="padding:0">
                                <td align="center" valign="middle"
                                  style="border-collapse:collapse!important;word-break:break-word;border-radius:6px;padding:8px 14px"
                                  bgcolor="#4c83ee">
                                  ${
                                    type === "VERIFY"
                                      ? `<a href="${process.env
                                          .CLIENT_BASE_URL!}/verify-email?token=${token}"
                                    style="color:#fff!important;display:block;font-size:14px;font-weight:500;text-decoration:none"
                                    target="_blank">Confirm my account</a>`
                                      : `<p style="color:#fff!important;display:block;font-size:24px;font-weight:500;text-decoration:none>${token}</p>`
                                  }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr style="padding:0">
                        <td align="left" valign="middle"
                          style="border-collapse:collapse!important;word-break:break-word;padding:0">
                          <p style="font-size:14px;padding-bottom:10px;margin:0">If you didn't request this, you can
                            safely ignore this email.</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr style="padding:0">
                <td style="border-collapse:collapse!important;word-break:break-word;padding:0 32px 24px" align="left"
                  valign="middle">
                  <table
                    style="width:50%;border-collapse:collapse;border-spacing:0;table-layout:auto;padding:0;border:0">
                    <tbody>
                      <tr style="padding:0">
                        <td
                          style="border-collapse:collapse!important;word-break:break-word;border-top-width:1px;border-top-color:#e4e4e9;border-top-style:solid;font-size:12px;line-height:1.5;padding:15px 0 0"
                          align="left" valign="middle">
                          <table style="border-collapse:collapse;border-spacing:0;table-layout:auto;padding:0;border:0">
                            <tbody>
                              <tr style="padding:0">
                                <td style="border-collapse:collapse!important;word-break:break-word;padding:0">
                                  <span>Sincerely,</span><br>
                                  <br>
                                  <strong>The Podstar Team</strong><br>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  `;
}
