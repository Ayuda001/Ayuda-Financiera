// Objet principal du simulateur de prêt
const LoanSimulator = {
    // Taux des différents types de prêts
    rates: {
        personal: 2.98,
        professional: 2.99,
        mortgage: 3.00
    },

    // Éléments du DOM
    elements: {
        calculateBtn: null,
        results: null,
        loanType: null,
        amount: null,
        duration: null,
        monthlyPayment: null,
        totalAmount: null,
        totalInterest: null
    },

    // Initialisation du simulateur
    init: function() {
        // Récupération des éléments du DOM
        this.elements = {
            calculateBtn: document.getElementById('ls-calculate-btn'),
            results: document.getElementById('ls-results'),
            loanType: document.getElementById('ls-loan-type'),
            amount: document.getElementById('ls-amount'),
            duration: document.getElementById('ls-duration'),
            monthlyPayment: document.getElementById('ls-monthly-payment'),
            totalAmount: document.getElementById('ls-total-amount'),
            totalInterest: document.getElementById('ls-total-interest')
        };

        this.bindEvents();
    },

    // Attachement des événements
    bindEvents: function() {
        this.elements.calculateBtn.addEventListener('click', () => this.calculateLoan());

        // Validation des entrées en temps réel
        this.elements.amount.addEventListener('input', () => this.validateInput(this.elements.amount));
        this.elements.duration.addEventListener('input', () => this.validateInput(this.elements.duration));
    },

    // Validation des entrées numériques
    validateInput: function(input) {
        const value = parseFloat(input.value);
        if (value < 0) {
            input.value = Math.abs(value);
        }
    },

    // Formatage des nombres en format français
    formatNumber: function(number) {
        return new Intl.NumberFormat('fr-FR').format(number);
    },

    // Calcul du prêt
    calculateLoan: function() {
        const loanType = this.elements.loanType.value;
        const amount = parseFloat(this.elements.amount.value);
        const duration = parseInt(this.elements.duration.value);

        // Validation des entrées
        if (!this.validateInputs(loanType, amount, duration)) {
            return;
        }

        // Calcul du prêt
        const rate = this.rates[loanType] / 100 / 12; // Taux mensuel
        const months = duration * 12; // Nombre total de mois

        const monthlyPayment = (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
        const totalAmount = monthlyPayment * months;
        const totalInterest = totalAmount - amount;

        // Affichage des résultats
        this.displayResults(monthlyPayment, totalAmount, totalInterest);
    },

    // Validation de toutes les entrées
    validateInputs: function(loanType, amount, duration) {
        if (!loanType || isNaN(amount) || isNaN(duration)) {
            alert('Veuillez remplir tous les champs correctement');
            return false;
        }

        if (amount <= 0 || duration <= 0) {
            alert('Veuillez entrer des valeurs positives');
            return false;
        }

        return true;
    },

    // Affichage des résultats
    displayResults: function(monthlyPayment, totalAmount, totalInterest) {
        this.elements.monthlyPayment.textContent = this.formatNumber(monthlyPayment.toFixed(2));
        this.elements.totalAmount.textContent = this.formatNumber(totalAmount.toFixed(2));
        this.elements.totalInterest.textContent = this.formatNumber(totalInterest.toFixed(2));

        // Affichage de la section résultats
        this.elements.results.style.display = 'block';

        // Animation smooth scroll vers les résultats
        this.elements.results.scrollIntoView({ behavior: 'smooth' });
    }
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => LoanSimulator.init());

