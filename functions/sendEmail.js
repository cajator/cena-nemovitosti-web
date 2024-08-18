const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('Funkce sendEmail byla vyvolána');
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_PASS length:', process.env.GMAIL_PASS ? process.env.GMAIL_PASS.length : 'undefined');

  if (event.httpMethod !== 'POST') {
    console.log('Neplatná HTTP metoda');
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    console.log('Parsování těla požadavku');
    const { name, email, phone, propertyType, location } = JSON.parse(event.body);

    console.log('Vytváření transportéru');
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    console.log('Pokus o odeslání e-mailu');
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // můžete změnit na jiný e-mail, pokud chcete
      subject: 'Nový odhad nemovitosti',
      text: `Jméno: ${name}\nEmail: ${email}\nTelefon: ${phone}\nTyp nemovitosti: ${propertyType}\nLokalita: ${location}`
    });
    console.log('E-mail úspěšně odeslán');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "E-mail odeslán úspěšně" })
    };
  } catch (error) {
    console.error('Detailní chyba:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Chyba při odesílání e-mailu", 
        details: error.message, 
        stack: error.stack 
      })
    };
  }
};
