const nodemailer = require('nodemailer');
const axios = require('axios');

exports.handler = async (event, context) => {
  console.log('Funkce sendEmail byla vyvolána');

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { name, email, phone, propertyType, location, recaptchaToken } = JSON.parse(event.body);

    console.log('Data přijata:', { name, email, phone, propertyType, location });

    // Ověření reCAPTCHA
    const recaptchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    );

    if (!recaptchaVerify.data.success) {
      console.error('reCAPTCHA verification failed');
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "reCAPTCHA verification failed" })
      };
    }

    console.log('reCAPTCHA ověřena');

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    console.log('Transporter vytvořen');

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Nový odhad nemovitosti',
      text: `Jméno: ${name}\nEmail: ${email}\nTelefon: ${phone}\nTyp nemovitosti: ${propertyType}\nLokalita: ${location}`
    });

    console.log('E-mail odeslán');

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "E-mail odeslán úspěšně" })
    };
  } catch (error) {
    console.error('Detailní chyba:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: "Chyba při odesílání e-mailu", 
        details: error.message
      })
    };
  }
};
