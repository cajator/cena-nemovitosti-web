const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('Function invoked');
  
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  console.log('Parsing request body');
  const { name, email, phone, propertyType, location } = JSON.parse(event.body);
  
  console.log('Creating transporter');
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  console.log('Transporter created');

  try {
    console.log('Attempting to send email');
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Nový odhad nemovitosti',
      text: `Jméno: ${name}\nEmail: ${email}\nTelefon: ${phone}\nTyp nemovitosti: ${propertyType}\nLokalita: ${location}`
    });
    console.log('Email sent successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "E-mail odeslán úspěšně" })
    };
  } catch (error) {
    console.error('Detailed error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Chyba při odesílání e-mailu", details: error.message })
    };
  }
};
