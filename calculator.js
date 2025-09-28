class ROICalculator {
    constructor() {
        this.inputs = {
            employees: 50,
            revenue: 5000000,
            clients: 1000,
            insurance: 10000,
            itSpend: 5,
            securityMeasures: {
                mfa: false,
                monitoring: false,
                training: false,
                backup: false,
                endpoint: false,
                compliance: false
            }
        };

        // Log scale constants
        this.revenueMin = 100000;  // $100K
        this.revenueMax = 500000000;  // $500M
        this.employeesMin = 1;
        this.employeesMax = 1000;
        this.insuranceMin = 100;  // $100
        this.insuranceMax = 500000;  // $500K
        this.clientsMin = 10;
        this.clientsMax = 100000;  // 100K

        this.initializeSliderValues();
        this.initializeEventListeners();
        this.updateCalculations();
    }

    // Convert revenue value to slider position (0-1000)
    revenueToSlider(revenue) {
        const minLog = Math.log10(this.revenueMin);
        const maxLog = Math.log10(this.revenueMax);
        const revenueLog = Math.log10(revenue);
        return Math.round(((revenueLog - minLog) / (maxLog - minLog)) * 1000);
    }

    // Convert slider position (0-1000) to revenue value
    sliderToRevenue(sliderValue) {
        const minLog = Math.log10(this.revenueMin);
        const maxLog = Math.log10(this.revenueMax);
        const revenueLog = minLog + (sliderValue / 1000) * (maxLog - minLog);
        return Math.round(Math.pow(10, revenueLog));
    }

    // Convert employees value to slider position (0-1000)
    employeesToSlider(employees) {
        const minLog = Math.log10(this.employeesMin);
        const maxLog = Math.log10(this.employeesMax);
        const employeesLog = Math.log10(employees);
        return Math.round(((employeesLog - minLog) / (maxLog - minLog)) * 1000);
    }

    // Convert slider position (0-1000) to employees value
    sliderToEmployees(sliderValue) {
        const minLog = Math.log10(this.employeesMin);
        const maxLog = Math.log10(this.employeesMax);
        const employeesLog = minLog + (sliderValue / 1000) * (maxLog - minLog);
        return Math.round(Math.pow(10, employeesLog));
    }

    // Convert insurance value to slider position (0-1000)
    insuranceToSlider(insurance) {
        const minLog = Math.log10(this.insuranceMin);
        const maxLog = Math.log10(this.insuranceMax);
        const insuranceLog = Math.log10(insurance);
        return Math.round(((insuranceLog - minLog) / (maxLog - minLog)) * 1000);
    }

    // Convert slider position (0-1000) to insurance value
    sliderToInsurance(sliderValue) {
        const minLog = Math.log10(this.insuranceMin);
        const maxLog = Math.log10(this.insuranceMax);
        const insuranceLog = minLog + (sliderValue / 1000) * (maxLog - minLog);
        return Math.round(Math.pow(10, insuranceLog));
    }

    // Convert clients value to slider position (0-1000)
    clientsToSlider(clients) {
        const minLog = Math.log10(this.clientsMin);
        const maxLog = Math.log10(this.clientsMax);
        const clientsLog = Math.log10(clients);
        return Math.round(((clientsLog - minLog) / (maxLog - minLog)) * 1000);
    }

    // Convert slider position (0-1000) to clients value
    sliderToClients(sliderValue) {
        const minLog = Math.log10(this.clientsMin);
        const maxLog = Math.log10(this.clientsMax);
        const clientsLog = minLog + (sliderValue / 1000) * (maxLog - minLog);
        return Math.round(Math.pow(10, clientsLog));
    }

    initializeSliderValues() {
        // Set initial employees slider position based on log scale
        const employeesSlider = document.getElementById('employees');
        employeesSlider.value = this.employeesToSlider(this.inputs.employees);
        document.getElementById('employees-value').textContent = this.formatNumber(this.inputs.employees);

        // Set initial revenue slider position based on log scale
        const revenueSlider = document.getElementById('revenue');
        revenueSlider.value = this.revenueToSlider(this.inputs.revenue);
        document.getElementById('revenue-value').textContent = this.formatCurrency(this.inputs.revenue, true);

        // Set initial clients slider position based on log scale
        const clientsSlider = document.getElementById('clients');
        clientsSlider.value = this.clientsToSlider(this.inputs.clients);
        document.getElementById('clients-value').textContent = this.formatNumber(this.inputs.clients);

        // Set initial insurance slider position based on log scale
        const insuranceSlider = document.getElementById('insurance');
        insuranceSlider.value = this.insuranceToSlider(this.inputs.insurance);
        document.getElementById('insurance-value').textContent = this.formatCurrency(this.inputs.insurance);
    }

    initializeEventListeners() {
        // Slider inputs
        document.getElementById('employees').addEventListener('input', (e) => {
            // Convert slider position (0-100) to log scale employees value
            const sliderValue = parseInt(e.target.value);
            this.inputs.employees = this.sliderToEmployees(sliderValue);
            document.getElementById('employees-value').textContent = this.formatNumber(this.inputs.employees);
            this.updateCalculations();
        });

        document.getElementById('revenue').addEventListener('input', (e) => {
            // Convert slider position (0-100) to log scale revenue value
            const sliderValue = parseInt(e.target.value);
            this.inputs.revenue = this.sliderToRevenue(sliderValue);
            document.getElementById('revenue-value').textContent = this.formatCurrency(this.inputs.revenue, true);
            this.updateCalculations();
        });

        document.getElementById('clients').addEventListener('input', (e) => {
            // Convert slider position (0-100) to log scale clients value
            const sliderValue = parseInt(e.target.value);
            this.inputs.clients = this.sliderToClients(sliderValue);
            document.getElementById('clients-value').textContent = this.formatNumber(this.inputs.clients);
            this.updateCalculations();
        });

        document.getElementById('insurance').addEventListener('input', (e) => {
            // Convert slider position (0-100) to log scale insurance value
            const sliderValue = parseInt(e.target.value);
            this.inputs.insurance = this.sliderToInsurance(sliderValue);
            document.getElementById('insurance-value').textContent = this.formatCurrency(this.inputs.insurance);
            this.updateCalculations();
        });

        document.getElementById('itspend').addEventListener('input', (e) => {
            this.inputs.itSpend = parseFloat(e.target.value);
            document.getElementById('itspend-value').textContent = this.inputs.itSpend + '%';
            this.updateCalculations();
        });

        // Checkboxes
        const checkboxes = ['mfa', 'monitoring', 'training', 'backup', 'endpoint', 'compliance'];
        checkboxes.forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.inputs.securityMeasures[id] = e.target.checked;
                this.updateCalculations();
            });
        });

        // Contact form
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    // Turnium investment
    calculateTurniumCost() {
        return this.inputs.employees * 250 * 12;
    }

    calculateSecurityScore() {
        let score = 0;
        Object.values(this.inputs.securityMeasures).forEach(measure => {
            if (measure) score++;
        });
        return score;
    }

    // Assume each security layer reduces risk by 10%
    calculateRiskReduction() {
        const securityScore = this.calculateSecurityScore();
        return securityScore * 0.10;
    }

    calculateCurrentBreachProb() {
        const baseBreachProb = 0.15;
        const riskReductionFactor = this.calculateRiskReduction();
        const currentBreachProb = baseBreachProb * (1 - riskReductionFactor);
        return currentBreachProb;
    }

    calculateRansomwareInvolvement() {
        // 88% for small companies, 39% for large companies
        const smallCompanyRate = 0.88;
        const largeCompanyRate = 0.39;
        
        // Define company size thresholds
        const smallCompanyThreshold = 100;
        const largeCompanyThreshold = 500;
        
        if (this.inputs.employees <= smallCompanyThreshold) {
            return smallCompanyRate;
        } else if (this.inputs.employees >= largeCompanyThreshold) {
            return largeCompanyRate;
        } else {
            // Linear interpolation between small and large company rates
            const sizeRatio = (this.inputs.employees - smallCompanyThreshold) / 
                             (largeCompanyThreshold - smallCompanyThreshold);
            return smallCompanyRate - (sizeRatio * (smallCompanyRate - largeCompanyRate));
        }
    }

    // Assume 15% baseline insurance reduction, up to 30% if high risk
    calculateInsuranceSavings() {
        const securityScore = this.calculateSecurityScore();
        const reductionRate = 0.30 - (securityScore * 0.025);
        return this.inputs.insurance * reductionRate;
    }

    calculateBreachSavings() {
        const currentBreachProb = this.calculateCurrentBreachProb();
        const turniumProb = 0.02;

        // Extrapolate breach costs based on company size
        // Small business -> $46k
        // Medium business -> 97.2k
        // Large business -> 150k
        let averageBreachCost;
        if (this.inputs.employees <= 100) {
            averageBreachCost = 46000;
        } else if (this.inputs.employees <= 400) { // Interpolate between 100 to 400 employees
            const ratio = (this.inputs.employees - 100) / (400 - 100);
            averageBreachCost = 46000 + (ratio * (97200 - 46000));
        } else if (this.inputs.employees <= 700) { // Interpolate between 400 to 700 employees
            const ratio = (this.inputs.employees - 400) / (700 - 400);
            averageBreachCost = 97200 + (ratio * (150000 - 97200));
        } else {
            averageBreachCost = 150000;
        }

        return (currentBreachProb - turniumProb) * averageBreachCost;
    }

    // TODO: extrapolate costs
    calculateRansomwareSavings() {
        const currentBreachProb = this.calculateCurrentBreachProb();
        const ransomwareInvolvement = this.calculateRansomwareInvolvement();
        const currentRansomwareProb = currentBreachProb * ransomwareInvolvement;
        const turniumProb = 0.02;

        // Stats
        // $10M-$50M - $106,310
        // $50M-$250M - $169,364
        // $250M-$500M - $1,000,000

        // Extrapolate payment by company revenue
        // $5M or less -> $53,155 (106310 / 2)
        // $5M to $20M -> interpolate to $106,310
        // $20M to $100M -> interpolate to $169,364
        // $100M to $500M -> interpolate to $1,000,000
        let ransomPayment;
        if (this.inputs.revenue <= 5000000) {
            ransomPayment = 106310 / 2;
        } else if (this.inputs.revenue <= 20000000) {
            const ratio = (this.inputs.revenue - 5000000) / (20000000 - 5000000);
            ransomPayment = (106310 / 2) + (ratio * (106310 / 2));
        } else if (this.inputs.revenue <= 100000000) {
            const ratio = (this.inputs.revenue - 20000000) / (100000000 - 20000000);
            ransomPayment = 106310 + (ratio * (169364 - 106310));
        } else if (this.inputs.revenue <= 500000000) {
            const ratio = (this.inputs.revenue - 100000000) / (500000000 - 100000000);
            ransomPayment = 169364 + (ratio * (1000000 - 169364));
        } else {
            ransomPayment = 1000000;
        }

        // Stats
        // 100-250 employees - $638,536
        // 251-500 employees - $1,078,763
        // 501-1,000 employees - $1,570,927

        // Extrapolate recovery cost by company size
        // 50 employees or less -> $319,268 (638,536 / 2)
        // 50 to 150 employees -> interpolate to $638,536
        // 150 to 350 employees -> interpolate to $1,078,763
        // 350 to 750 employees -> interpolate to $1,570,927
        let recoveryCost;
        if (this.inputs.employees <= 50) {
            recoveryCost = 638536 / 2;
        } else if (this.inputs.employees <= 150) {
            const ratio = (this.inputs.employees - 50) / (150 - 50);
            recoveryCost = (638536 / 2) + (ratio * (638536 / 2));
        } else if (this.inputs.employees <= 350) {
            const ratio = (this.inputs.employees - 150) / (350 - 150);
            recoveryCost = 638536 + (ratio * (1078763 - 638536));
        } else if (this.inputs.employees <= 750) {
            const ratio = (this.inputs.employees - 350) / (750 - 350);
            recoveryCost = 1078763 + (ratio * (1570927 - 1078763));
        } else {
            recoveryCost = 1570927;
        }

        const totalCost = ransomPayment + recoveryCost;
        return (currentRansomwareProb - turniumProb) * totalCost;
    }

    calculateBECSavings() {
        const hasMFA = this.inputs.securityMeasures.mfa;
        const currentProb = hasMFA ? 0.01 : 0.23;
        const turniumProb = 0.01;
        const becLoss = 129000;

        return (currentProb - turniumProb) * becLoss;
    }

    // Assume 30% baseline efficiency gain, up to 60% if insecure
    calculateComplianceSavings() {
        const securityScore = this.calculateSecurityScore();
        const complianceHours = (this.inputs.employees * 40) + (this.inputs.clients / 20);
        const hourlyRate = 250;
        const efficiencyGain = 0.60 - (securityScore * 0.05);

        return complianceHours * hourlyRate * efficiencyGain;
    }

    calculateITSavings() {
        const currentITSpend = this.inputs.revenue * (this.inputs.itSpend / 100);
        const vendorManagementOverhead = currentITSpend * 0.25;
        const consolidationEfficiency = 0.50;

        return vendorManagementOverhead * consolidationEfficiency;
    }

    calculateDowntimeSavings() {
        const currentBreachProb = this.calculateCurrentBreachProb();
        const ransomwareInvolvement = this.calculateRansomwareInvolvement();
        const currentRansomwareProb = currentBreachProb * ransomwareInvolvement;
        const turniumProb = 0.02;

        const averageDowntimeDays = 18;
        const currentDowntimeDays = currentRansomwareProb * averageDowntimeDays;
        const turniumDowntimeDays = turniumProb * averageDowntimeDays;

        const dailyCost = this.inputs.revenue / 260;

        return (currentDowntimeDays - turniumDowntimeDays) * dailyCost;
    }

    calculateRetentionSavings() {
        const currentBreachProb = this.calculateCurrentBreachProb();
        const turniumProb = 0.02;

        const clientChurnRate = 0.35;
        const probDifference = currentBreachProb - turniumProb;

        return clientChurnRate * this.inputs.revenue * probDifference;
    }

    calculatePenaltySavings() {
        const currentBreachProb = this.calculateCurrentBreachProb();

        return currentBreachProb * 60000;
    }

    updateCalculations() {
        const turniumCost = this.calculateTurniumCost();
        const insuranceSavings = this.calculateInsuranceSavings();
        const breachSavings = this.calculateBreachSavings();
        const ransomwareSavings = this.calculateRansomwareSavings();
        const becSavings = this.calculateBECSavings();
        const complianceSavings = this.calculateComplianceSavings();
        const itSavings = this.calculateITSavings();
        const downtimeSavings = this.calculateDowntimeSavings();
        const retentionSavings = this.calculateRetentionSavings();
        const penaltySavings = this.calculatePenaltySavings();

        const totalSavings = insuranceSavings + breachSavings + ransomwareSavings +
                            becSavings + complianceSavings + itSavings +
                            downtimeSavings + retentionSavings + penaltySavings;

        const netSavings = totalSavings - turniumCost;
        const roi = turniumCost > 0 ? (netSavings / turniumCost) * 100 : 0;
        const paybackPeriod = netSavings > 0 ? Math.round((turniumCost / netSavings) * 12) : 0;

        // Update display
        document.getElementById('total-savings').textContent = this.formatCurrency(netSavings);
        document.getElementById('roi-percentage').textContent = Math.round(roi) + '%';
        document.getElementById('payback-period').textContent = paybackPeriod + ' months';
        document.getElementById('turnium-cost').textContent = this.formatCurrency(turniumCost) + '/year';

        // Update breakdown
        document.getElementById('insurance-savings').textContent = this.formatCurrency(insuranceSavings);
        document.getElementById('breach-savings').textContent = this.formatCurrency(breachSavings);
        document.getElementById('ransomware-savings').textContent = this.formatCurrency(ransomwareSavings);
        document.getElementById('bec-savings').textContent = this.formatCurrency(becSavings);
        document.getElementById('compliance-savings').textContent = this.formatCurrency(complianceSavings);
        document.getElementById('it-savings').textContent = this.formatCurrency(itSavings);
        document.getElementById('downtime-savings').textContent = this.formatCurrency(downtimeSavings);
        document.getElementById('retention-savings').textContent = this.formatCurrency(retentionSavings);
        document.getElementById('penalty-savings').textContent = this.formatCurrency(penaltySavings);
    }

    formatCurrency(value, compact = false) {
        if (compact && value >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value);
    }

    handleFormSubmission() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            calculatorInputs: this.inputs,
            results: {
                turniumCost: this.calculateTurniumCost(),
                totalSavings: this.calculateTotalSavings(),
                roi: this.calculateROI()
            }
        };

        // For now, just log the data
        console.log('Form submission:', formData);
        alert('Thank you for your interest! Our team will contact you shortly.');

        // Reset form
        document.getElementById('contact-form').reset();
    }

    calculateTotalSavings() {
        const turniumCost = this.calculateTurniumCost();
        const allSavings = this.calculateInsuranceSavings() + this.calculateBreachSavings() +
                          this.calculateRansomwareSavings() + this.calculateBECSavings() +
                          this.calculateComplianceSavings() + this.calculateITSavings() +
                          this.calculateDowntimeSavings() + this.calculateRetentionSavings() +
                          this.calculatePenaltySavings();
        return allSavings - turniumCost;
    }

    calculateROI() {
        const turniumCost = this.calculateTurniumCost();
        const netSavings = this.calculateTotalSavings();
        return turniumCost > 0 ? (netSavings / turniumCost) * 100 : 0;
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ROICalculator();
});