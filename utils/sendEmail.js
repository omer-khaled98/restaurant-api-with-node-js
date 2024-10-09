import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "ititestapps@gmail.com",
    pass: "brku abbm sugn yqvl",
  },
});

const sendVerfication = async (email, userName) => {
  const info = await transporter.sendMail({
    from: '"verify your account" <Apo Alam>', // sender address
    to: email, // list of receivers
    subject: "verify ✔", // Subject line
    text: "please verify your email", // plain text body
    html: `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;background-color:#f9f9f9"
    id="bodyTable">
    <tbody>
        <tr>
            <td style="padding-right:10px;padding-left:10px;" align="center" valign="top" id="bodyCell">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapperBody"
                    style="max-width:600px">
                    <tbody>
                        <tr>
                            <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableCard"
                                    style="background-color:#fff;border-color:#e5e5e5;border-style:solid;border-width:0 1px 1px 1px;">
                                    <tbody>
                                        <tr>
                                            <td style="background-color:#39db4a;font-size:1px;line-height:3px"
                                                class="topBorder" height="3">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px;" align="center" valign="top" class="imgHero">
                                                <a href="#" style="text-decoration:none" target="_blank">
                                                    <img alt="" border="0" src="../../../FrontEnd//public/logo3.png"
                                                        style="width:100%;max-width:400px;height:auto;display:block;color: #f9f9f9;"
                                                        width="600">
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom: 5px; padding-left: 20px; padding-right: 20px;"
                                                align="center" valign="top" class="mainTitle">
                                                <h2 class="text"
                                                    style="color:#000;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:28px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:36px;text-transform:none;text-align:center;padding:0;margin:0">
                                                    Hi "${userName}"</h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom: 30px; padding-left: 20px; padding-right: 20px;"
                                                align="center" valign="top" class="subTitle">
                                                <h4 class="text"
                                                    style="color:#999;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:16px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:24px;text-transform:none;text-align:center;padding:0;margin:0">
                                                    Verify Your Email Account</h4>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-left:20px;padding-right:20px" align="center" valign="top"
                                                class="containtTable ui-sortable">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                                    class="tableDescription">
                                                    <tbody>
                                                        <tr>
                                                            <td style="padding-bottom: 20px;" align="center"
                                                                valign="top" class="description">
                                                                <p class="text"
                                                                    style="color:#666;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:center;padding:0;margin:0">
                                                                    Thank you for registering with Apo Alam! Please verify your email to complete your account setup and enjoy a seamless experience with our restaurant.</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                                    class="tableButton">
                                                    <tbody>
                                                        <tr>
                                                            <td style="padding-top:20px;padding-bottom:20px"
                                                                align="center" valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                    align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="background-color:#39db4a; padding: 12px 35px; border-radius: 50px;"
                                                                                align="center" class="ctaButton"> <a
                                                                                    href="http://localhost:5173/verifyEmail/${email}"
                                                                                    style="color:#fff;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;font-style:normal;letter-spacing:1px;line-height:20px;text-transform:uppercase;text-decoration:none;display:block"
                                                                                    target="_blank" class="text">Confirm
                                                                                    Email</a>
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
                                        <tr>
                                            <td style="font-size:1px;line-height:1px" height="20">&nbsp;</td>
                                        </tr>

                                    </tbody>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="space">
                                    <tbody>
                                        <tr>
                                            <td style="font-size:1px;line-height:1px" height="30">&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapperFooter"
                    style="max-width:600px">
                    <tbody>
                        <tr>
                            <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="footer">
                                    <tbody>
                                        <tr>
                                            <td style="padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px"
                                                align="center" valign="top" class="socialLinks">
                                                <a href="#facebook-link" style="display:inline-block" target="_blank"
                                                    class="facebook">
                                                    <img alt="" border="0"
                                                        src="http://email.aumfusion.com/vespro/img/social/light/facebook.png"
                                                        style="height:auto;width:100%;max-width:40px;margin-left:2px;margin-right:2px"
                                                        width="40">
                                                </a>
                                                <a href="#twitter-link" style="display: inline-block;" target="_blank"
                                                    class="twitter">
                                                    <img alt="" border="0"
                                                        src="http://email.aumfusion.com/vespro/img/social/light/twitter.png"
                                                        style="height:auto;width:100%;max-width:40px;margin-left:2px;margin-right:2px"
                                                        width="40">
                                                </a>

                                                <a href="#instagram-link" style="display: inline-block;" target="_blank"
                                                    class="instagram">
                                                    <img alt="" border="0"
                                                        src="http://email.aumfusion.com/vespro/img/social/light/instagram.png"
                                                        style="height:auto;width:100%;max-width:40px;margin-left:2px;margin-right:2px"
                                                        width="40">
                                                </a>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 10px 5px;" align="center" valign="top"
                                                class="brandInfo">
                                                <p class="text"
                                                    style="color:#bbb;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:center;padding:0;margin:0">
                                                    ©&nbsp;Apo Alam. | 800 Assuit, St 15 | EG.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0px 10px 10px;" align="center" valign="top"
                                                class="footerEmailInfo">
                                              <p class="text"
                                                    style="color:#bbb;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:center;padding:0;margin:0">
                                                    If you have any quetions please contact us <a
                                                        href="mailto:ititestapps@gmail.com"
                                                        style="color:#bbb;text-decoration:underline"
                                                        target="_blank">ititestapps@gmail.com</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:1px;line-height:1px" height="30">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
    `
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendVerfication;
