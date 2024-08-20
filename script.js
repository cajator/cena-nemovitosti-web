document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const formData = new FormData(form);
    
    if (form) {
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
                    body: formData
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

window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    
    for(var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var revealTop = reveals[i].getBoundingClientRect().top;
        var revealPoint = 150;
        
        if(revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        }
    }
}
