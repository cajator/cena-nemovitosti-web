const nodemailer = require('nodemailer');
const https = require('https');

exports.handler = async (event, context) => {
  console.log('Funkce sendEmail byla vyvolána');
  if (event.httpMethod !== 'POST') {
    console.log('Neplatná HTTP metoda');
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Data přijata:', data);

    // Ověření reCAPTCHA
    console.log('Začíná ověření reCAPTCHA');
    const recaptchaVerify = await verifyRecaptcha(data.recaptchaToken);
    console.log('Výsledek ověření reCAPTCHA:', recaptchaVerify);
    if (!recaptchaVerify.success) {
      console.error('reCAPTCHA verification failed');
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "reCAPTCHA verification failed" })
      };
    }

    console.log('reCAPTCHA ověřena, vytváření transporteru');
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    console.log('Transporter vytvořen, odesílání e-mailu');
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Nový odhad nemovitosti',
      text: `
        Typ nemovitosti: ${data['property-type'] || 'Neuvedeno'}
        Velikost: ${data['property-size'] || 'Neuvedeno'} m²
        Lokalita: ${data['property-location'] || 'Neuvedeno'}
        E-mail: ${data['user-email'] || 'Neuvedeno'}
      `
    });

    console.log('E-mail odeslán úspěšně');
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
        details: error.message,
        stack: error.stack
      })
    };
  }
};

function verifyRecaptcha(token) {
  return new Promise((resolve, reject) => {
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    
    https.get(recaptchaVerifyUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}
