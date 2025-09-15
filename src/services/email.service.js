import { replacePlaceholder } from "../utils/index.js";
import { NotFound } from "../core/error.response.js";
import { transport } from "../dbs/init.nodemailer.js";
import { newOtp } from "./otp.service.js";
import { getTemplate } from "./template.service.js";

const sendEmailLinkVerify = ({ html, toEmail, subject = "Xác minh email", text = "Xác minh email" }) => {
    try {
        const mailOptions = {
            from: ' "Shop-ecommerce" <letrongdai010203@gmail.com> ',
            to: toEmail,
            subject,
            text,
            html,
        };
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Message sent::", info.messageId);
        });
    } catch (error) {
        console.error("Error send email::", error);
        return error;
    }
};

export const sendEmailToken = async ({ email = null }) => {
    //get token
    const token = await newOtp({ email });
    //get template
    const template = await getTemplate({
        tem_name: "HTML EMAIL TOKEN",
    });
    // replace placeholder with params
    if (!template) throw new NotFound("Not found Template!");
    const content = replacePlaceholder(
        template.tem_html, 
        {
            verify_url: `http://localhost:3052/v1/api/user/welcome-back?token=${token.otp_token}`,
            username: email,
        }
    );
    //send email
    sendEmailLinkVerify({ html: content, toEmail: email });
    return 1
};
