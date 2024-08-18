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
