document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('property-form');
    const successMessage = document.getElementById('success-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // Získání tokenu reCAPTCHA
                const recaptchaToken = await grecaptcha.execute('6LdhbykqAAAAAKlALERO-kQnOASg0U7AOKJCHnX3', {action: 'submit'});
                
                // Získání dat z formuláře
                const formData = new FormData(form);
                formData.append('recaptchaToken', recaptchaToken);
                
                const formObject = Object.fromEntries(formData);
                
                console.log('Odesílaná data:', formObject); // Pro debugování

                const response = await fetch('/.netlify/functions/sendEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                }

                const data = await response.json();

                if (data.success) {
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                } else {
                    throw new Error(data.error || data.details || 'Neznámá chyba');
                }
            } catch (error) {
                console.error('Detailní chyba:', error);
                alert('Došlo k chybě při odesílání formuláře: ' + error.message);
            }
        });
    } else {
        console.error('Form element not found');
    }
});
