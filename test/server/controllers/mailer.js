import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js";

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: ENV.EMAIL,
      pass: ENV.PASSWORD,
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js"
    }
});

export const registerMail = async (req, res) => {
    const { username, email, text, subject } = req.body;
    var Email = {
        body: {
            name: username,
            intro: text || "Welcome to my new project.",
            outro: "Need help, or have questions? just replay to this email."
        }
    }
    let emailBody = MailGenerator.generate(Email);
    let message = {
        from: ENV.EMAIL,
        to: email,
        subject: subject || "Signup successfull",
        html: emailBody
    }
    transporter.sendMail(message)
    .then(() => {
        return { msg: "Mail sent successfully"};//res.status(200).send({ msg: "You should resive this email from us."});
    })
    .catch(error => error);//res.status(500).send({ error }));
}