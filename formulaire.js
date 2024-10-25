// Gestion de la barre de progression
let currentStep = 1;
const totalSteps = 4;
const progressBar = document.querySelector('.progress');
const statusSteps = document.querySelectorAll('.status-step');

function updateProgress() {
    const progress = (currentStep - 1) / (totalSteps - 1) * 100;
    progressBar.style.width = `${progress}%`;
    
    statusSteps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Validation des fichiers
function validateFiles(files, maxSize = 5 * 1024 * 1024) { // 5MB max
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    for (let file of files) {
        if (!allowedTypes.includes(file.type)) {
            alert('Error: Solo se permiten archivos PDF, JPG y PNG.');
            return false;
        }
        if (file.size > maxSize) {
            alert('Error: El tamaño máximo por archivo es de 5MB.');
            return false;
        }
    }
    return true;
}

// Gestión de las zonas de carga
const uploadZones = document.querySelectorAll('.upload-zone');
uploadZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const input = zone.querySelector('input[type="file"]');
        const files = e.dataTransfer.files;
        
        if (validateFiles(files)) {
            input.files = files;
            updateFileLabel(zone, files);
        }
    });
});

// Actualización de etiquetas de archivo
function updateFileLabel(zone, files) {
    const p = zone.querySelector('p');
    if (files.length > 0) {
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        p.textContent = `Archivos seleccionados: ${fileNames}`;
    } else {
        p.textContent = 'Haga clic o arrastre su documento aquí';
    }
}

// Validación de campos
function validateForm() {
    const requiredFields = {
        'nom': 'Nombre completo',
        'email': 'Correo electrónico',
        'telephone': 'Teléfono',
        'montant': 'Monto deseado',
        'duree': 'Duración del préstamo'
    };

    for (let [id, label] of Object.entries(requiredFields)) {
        const field = document.getElementById(id);
        if (!field.value) {
            alert(`Por favor, complete el campo: ${label}`);
            field.focus();
            return false;
        }
    }

    // Validación del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(document.getElementById('email').value)) {
        alert('Por favor, ingrese un correo electrónico válido');
        return false;
    }

    // Validación del teléfono
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(document.getElementById('telephone').value)) {
        alert('Por favor, ingrese un número de teléfono válido');
        return false;
    }

    return true;
}

// Gestión del envío del formulario
const form = document.getElementById('loanForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {
        const formData = new FormData(form);
        
        // Envío del formulario a Formspree
        const response = await fetch('https://formspree.io/f/VOTRE_CODE_FORMSPREE', {  // Remplacez par votre code Formspree
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert('¡Solicitud enviada con éxito! Nos pondremos en contacto con usted pronto.');
            form.reset();
            currentStep = 1;
            updateProgress();
            window.location.href = '/waiting.html';  // Si vous avez une page d'attente
        } else {
            throw new Error('Error en el envío');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el formulario. Por favor, inténtelo de nuevo más tarde.');
    }
});

// Inicialización de tooltips
tippy('[data-tippy-content]', {
    placement: 'top',
    arrow: true,
    theme: 'light'
});

// Escucha de cambios en los campos de archivo
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', (e) => {
        if (validateFiles(e.target.files)) {
            updateFileLabel(e.target.closest('.upload-zone'), e.target.files);
        } else {
            e.target.value = '';
        }
    });
});

// Cálculo del préstamo en tiempo real
const montantInput = document.getElementById('montant');
const dureeSelect = document.getElementById('duree');

function calculateLoan() {
    const montant = parseFloat(montantInput.value);
    const duree = parseInt(dureeSelect.value);
    
    if (montant && duree) {
        const tauxAnnuel = 0.05; // 5% de tasa anual (ajustable)
        const tauxMensuel = tauxAnnuel / 12;
        const nombrePaiements = duree;
        
        const mensualite = montant * (tauxMensuel * Math.pow(1 + tauxMensuel, nombrePaiements)) / 
                          (Math.pow(1 + tauxMensuel, nombrePaiements) - 1);
                          
        // Actualizar el DOM con la información del préstamo
        const infoElement = document.getElementById('loan-info') || createLoanInfoElement();
        infoElement.innerHTML = `
            <h3>Resumen del préstamo:</h3>
            <p>Pago mensual estimado: $${mensualite.toFixed(2)}</p>
            <p>Monto total a pagar: $${(mensualite * nombrePaiements).toFixed(2)}</p>
            <p>Intereses totales: $${(mensualite * nombrePaiements - montant).toFixed(2)}</p>
        `;
    }
}

function createLoanInfoElement() {
    const infoElement = document.createElement('div');
    infoElement.id = 'loan-info';
    form.querySelector('.form-section:nth-child(2)').appendChild(infoElement);
    return infoElement;
}

montantInput.addEventListener('input', calculateLoan);
dureeSelect.addEventListener('change', calculateLoan);
// ... (tout le code précédent reste identique jusqu'à la partie du fetch)

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {
        const formData = new FormData(form);
        
        // Envío del formulario
        const response = await fetch('/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('¡Solicitud enviada con éxito! Serás redirigido a la página de espera.');
            
            // Réinitialisation du formulaire
            form.reset();
            currentStep = 1;
            updateProgress();
            
            // Redirection vers waiting.html
            window.location.href = '/waiting.html';
        } else {
            throw new Error('Error en el envío');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el formulario. Por favor, inténtelo de nuevo más tarde.');
    }
});

// ... (le reste du code reste identique)