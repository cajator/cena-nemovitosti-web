document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('estimate-form');
    const formContainer = document.getElementById('form-section');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // Získání tokenu reCAPTCHA
            const recaptchaToken = await grecaptcha.execute('6LdhbykqAAAAAKlALERO-kQnOASg0U7AOKJCHnX3', {action: 'submit'});

            // Získání dat z formuláře
            const formData = new FormData(form);
            formData.append('recaptchaToken', recaptchaToken);

            const response = await fetch('/.netlify/functions/sendEmail', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                form.style.display = 'none';
                successMessage.style.display = 'block';
            } else {
                throw new Error(data.error || 'Neznámá chyba');
            }
        } catch (error) {
            console.error('Chyba:', error);
            alert('Došlo k chybě při odesílání formuláře: ' + error.message);
        }
    });
});
fetch('/.netlify/functions/sendEmail', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    if (data.success) {
        form.style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
    } else {
        throw new Error(data.error || data.details || 'Neznámá chyba');
    }
})
.catch(error => {
    console.error('Detailní chyba:', error);
    alert('Došlo k chybě při odesílání formuláře: ' + error.message);
});
