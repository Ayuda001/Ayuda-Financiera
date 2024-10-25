const LoanSimulator = {
    rates: {
        personal: 2.98,
        professional: 2.99,
        mortgage: 3.00
    },
  
    init: function() {
        this.calculateBtn = document.getElementById('ls-calculate-btn');
        this.results = document.getElementById('ls-results');
        this.bindEvents();
    },
  
    bindEvents: function() {
        this.calculateBtn.addEventListener('click', () => this.calculateLoan());
    },
  
    formatNumber: function(number) {
        return new Intl.NumberFormat('fr-FR').format(number);
    },
  
    calculateLoan: function() {
        const loanType = document.getElementById('ls-loan-type').value;
        const amount = parseFloat(document.getElementById('ls-amount').value);
        const duration = parseInt(document.getElementById('ls-duration').value);
  
        if (!loanType || isNaN(amount) || isNaN(duration)) {
            alert('Veuillez remplir tous les champs correctement');
            return;
        }
  
        if (amount <= 0 || duration <= 0) {
            alert('Veuillez entrer des valeurs positives');
            return;
        }
  
        const rate = this.rates[loanType] / 100 / 12; // Taux mensuel
        const months = duration * 12; // Nombre total de mois
  
        const monthlyPayment = (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
        const totalAmount = monthlyPayment * months;
        const totalInterest = totalAmount - amount;
  
        document.getElementById('ls-monthly-payment').textContent = this.formatNumber(monthlyPayment.toFixed(2));
        document.getElementById('ls-total-amount').textContent = this.formatNumber(totalAmount.toFixed(2));
        document.getElementById('ls-total-interest').textContent = this.formatNumber(totalInterest.toFixed(2));
  
        this.results.style.display = 'block';
    }
  };
  
  // Initialisation au chargement de la page
  document.addEventListener('DOMContentLoaded', () => LoanSimulator.init());