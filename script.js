document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('estimateForm');
    const result = document.getElementById('result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Získání tokenu reCAPTCHA
        const recaptchaToken = await grecaptcha.execute('6LdhbykqAAAAAKlALERO-kQnOASg0U7AOKJCHnX3', {action: 'submit'});

        // Získání dat z formuláře
        const formData = new FormData(form);
        formData.append('recaptchaToken', recaptchaToken);

        try {
            const response = await fetch('/.netlify/functions/sendEmail', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                form.style.display = 'none';
                result.style.display = 'block';
            } else {
                throw new Error('Chyba při odesílání formuláře');
            }
        } catch (error) {
            console.error('Chyba:', error);
            alert('Došlo k chybě při odesílání formuláře. Zkuste to prosím znovu.');
        }
    });
});
