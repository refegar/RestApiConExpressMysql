const { mailer, mailercontact } = require("./mailer-controller");

const register = async (req, res, next) => {
    const { Correo, Nombre, url } = req.body;
    await mailer(
        Correo,
        "Recuperar Contraseña",
        `<div style="font-family: 'Mulish', sans-serif; font-size: 16px; color:black;">
        <div style="padding-left:10px;">
          <p><span>Su cuenta fue verificada por nosotros y sus datos son:</span></p>
          <p><span><strong>E-mail:</strong> ${Correo}</span>
        <br>
        <span><strong>Nombre:</strong> ${Nombre}</span></p>
        </div>
          <div style="background-color: #f7f7f7; padding:10px; border-radius: 20px; color:black;">
            <h4>Un cordial saludo</h4>
            <p>Nuestro equipo le ha generado un enlace para que pueda recuperar su contraseña.
            Por favor, haga clic en el siguiente link y completar los datos: <a href="${url}">¡Click Aquí!</a></p>
            <h3>Estaremos atentos mucha gracias</h3>
          </div>
        </div>`,
        Correo,
        "user_creation"
    );

    return res.status(200).json("ok");
};

const contacto = async (req, res, next) => {
    const { Correo, Nombre, comentarios, asunto } = req.body;
    await mailercontact(
        Correo, // Correo del usuario
        `${asunto}`,
        `<div style="font-family: 'Mulish', sans-serif; font-size: 16px; color:black;">
        <div style="padding-left:10px;">
        <p><span><strong>Datos de solicitante</strong></span>
        <br>
        <span><strong>Asunto:</strong> ${asunto}</span>
        <br>
        <span><strong>E-mail:</strong> ${Correo}</span>
        <br>
        <span><strong>Nombre:</strong> ${Nombre}</span></p>
        </div>
          <div style="background-color: #f7f7f7; padding:10px; border-radius: 20px; color:black;">
            <h4>Mensaje: </h4>
            <p>${comentarios}</p>    
          </div>
        </div>`,
        Correo, // Se usa como reply-to
        "user_creation"
    );

    return res.status(200).json("ok");
};

module.exports = {
    register,
    contacto
};
