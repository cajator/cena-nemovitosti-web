const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, phone, propertyType, location } = JSON.parse(event.body);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'vas@email.cz', // Změňte na váš e-mail
    from: 'noreply@vasedomena.cz', // Změňte na vaši doménu
    subject: 'Nový odhad nemovitosti',
    text: `Jméno: ${name}\nEmail: ${email}\nTelefon: ${phone}\nTyp nemovitosti: ${propertyType}\nLokalita: ${location}`,
  };

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "E-mail odeslán úspěšně" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Chyba při odesílání e-mailu" }),
    };
  }
};
