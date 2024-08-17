document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('estimate-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Zabrání standardnímu odeslání formuláře
        
        // Získání hodnot z formuláře
        const name = form.elements['name'].value;
        const email = form.elements['email'].value;
        const phone = form.elements['phone'].value;
        const propertyType = form.elements['property-type'].value;
        const location = form.elements['location'].value;
        
        // Zde by normálně byla logika pro odeslání dat na server
        // Pro demonstraci použijeme console.log a alert
        console.log('Odeslaná data:', { name, email, phone, propertyType, location });
        
        alert(`Děkujeme za váš zájem, ${name}! Budeme vás kontaktovat na ${email} nebo ${phone} ohledně vašeho ${propertyType} v lokalitě ${location}.`);
        
        // Vyčištění formuláře
        form.reset();
    });
});
