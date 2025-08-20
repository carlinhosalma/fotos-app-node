const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia email de convite
 * @param {string} to - Email do convidado
 * @param {string} inviterId - UUID do usuário que convidou
 */
async function sendInviteEmail(to, inviterId) {
  const inviteLink = `${process.env.FRONTEND_URL}/register?invited_by=${inviterId}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Convite para se cadastrar no Álbum de Fotos 📸",
    html: `
      <h2>Você recebeu um convite!</h2>
      <p>Um amigo convidou você para participar do nosso Álbum de Fotos.</p>
      <p><a href="${inviteLink}" target="_blank">Clique aqui para se cadastrar</a></p>
      <p>Ou copie e cole este link no navegador:</p>
      <p>${inviteLink}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendInviteEmail };
