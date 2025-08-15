// js/calculator.js - Main Calculator Logic

// Global variable for current industry
let currentIndustry = 'accounting';

// Select industry from dropdown
function selectIndustry(industry) {
    currentIndustry = industry;
    renderIndustryInputs();
    updateCalculator();
}

// Calculate security score (0-6)
function calculateSecurityScore() {
    const measures = ['mfa', 'edr', 'monitoring', 'backup', 'training', 'compliance'];
    return measures.reduce((score, measure) => {
        return score + (document.getElementById(measure).checked ? 1 : 0);
    }, 0);
}

// Main update function
function updateCalculator() {
    const config = industryData[currentIndustry];
    const securityScore = calculateSecurityScore();
    
    // Get input values
    const inputs = {};
    Object.keys(config.metrics).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            inputs[key] = parseInt(element.value);
            const displayElement = document.getElementById(key + 'Value');
            if (displayElement) {
                displayElement.textContent = formatValue(key, inputs[key], config.metrics[key].unit);
            }
        }
    });
    
    // Calculate based on industry
    let calculations = {};
    
    if (currentIndustry === 'accounting') {
        calculations = calculateAccountingSavings(inputs, config, securityScore);
    } else if (currentIndustry === 'property') {
        calculations = calculatePropertySavings(inputs, config, securityScore);
    }
    // Add more industries here as needed
    
    // Update display
    updateDisplay(calculations);
}

// Calculate savings for accounting firms
function calculateAccountingSavings(inputs, config, securityScore) {
    const { employees, revenue, insurance } = inputs;
    const risks = config.risks;
    
    // Calculate Turnium cost
    const costPerUser = config.turniumPricing(employees);
    const turniumAnnualCost = employees * costPerUser * 12;
    
    // Insurance savings (10-25% based on improvement potential)
    const insuranceReduction = Math.max(0.10, Math.min(0.25, (6 - securityScore) * 0.04));
    const insuranceSavings = insurance * insuranceReduction;
    
    // Downtime prevention
    const hourlyDowntimeCost = risks.downtimePerHour(revenue);
    const downtimeHoursPrevented = config.downtimeHoursPrevented(employees) * (1 - securityScore/12);
    const downtimeSavings = hourlyDowntimeCost * downtimeHoursPrevented;
    
    // Risk mitigation
    const currentBreachProb = risks.baseBreachProb * (1 - securityScore * 0.1);
    const turniumBreachProb = 0.05;
    const avgIncidentCost = Math.min(revenue * 0.25, 500000);
    const riskSavings = (currentBreachProb - turniumBreachProb) * avgIncidentCost;
    
    // BEC prevention
    const currentBecProb = risks.baseBecProb * (1 - securityScore * 0.12);
    const turniumBecProb = 0.08;
    const becSavings = (currentBecProb - turniumBecProb) * risks.becCost;
    
    // Compliance efficiency
    const complianceHours = config.complianceHours(employees);
    const complianceEfficiency = securityScore < 4 ? 0.7 : 0.3;
    const complianceSavings = complianceHours * 75 * complianceEfficiency;
    
    // IT optimization
    const currentITSpend = revenue * 0.038;
    const itOptimization = 0.15 * (1 - securityScore/10);
    const itSavings = currentITSpend * itOptimization;
    
    return {
        turniumCost: turniumAnnualCost,
        breakdown: [
            { label: '🛡️ Insurance Premium Reduction', value: insuranceSavings },
            { label: '⏱️ Downtime Prevention', value: downtimeSavings },
            { label: '🚨 Data Breach Risk Mitigation', value: riskSavings },
            { label: '📧 BEC/Fraud Prevention', value: becSavings },
            { label: '✅ Compliance Efficiency', value: complianceSavings },
            { label: '💻 IT Management Optimization', value: itSavings }
        ]
    };
}

// Calculate savings for property management
function calculatePropertySavings(inputs, config, securityScore) {
    const { buildings, insurance, tenants } = inputs;
    const risks = config.risks;
    
    // Calculate Turnium cost (per building/user basis)
    const avgUsersPerBuilding = Math.max(1, Math.ceil(buildings / 10));
    const totalUsers = buildings * avgUsersPerBuilding;
    const costPerUser = config.turniumPricing(buildings);
    const turniumAnnualCost = totalUsers * costPerUser * 12;
    
    // Insurance savings
    const insuranceReduction = Math.max(0.10, Math.min(0.25, (6 - securityScore) * 0.045));
    const insuranceSavings = insurance * insuranceReduction;
    
    // Downtime prevention ($427/minute from document)
    const downtimeMinutesPrevented = config.downtimeHoursPrevented(buildings) * 60 * (1 - securityScore/10);
    const downtimeSavings = downtimeMinutesPrevented * risks.downtimePerMinute;
    
    // Data breach risk mitigation
    const currentBreachProb = risks.baseBreachProb * (1 - securityScore * 0.08);
    const turniumBreachProb = 0.06;
    const breachSavings = (currentBreachProb - turniumBreachProb) * risks.breachCost;
    
    // Smart building/IoT risk
    const currentSmartProb = risks.baseSmartBuildingProb * (1 - securityScore * 0.1);
    const turniumSmartProb = 0.03;
    const smartBuildingSavings = (currentSmartProb - turniumSmartProb) * risks.smartBuildingCost;
    
    // Vendor risk management (3000 vendors per 100 buildings)
    const vendorCount = (buildings / 100) * 3000;
    const currentVendorProb = risks.baseVendorProb * (1 - securityScore * 0.08);
    const turniumVendorProb = 0.05;
    const vendorSavings = (currentVendorProb - turniumVendorProb) * risks.vendorIncidentCost * (buildings / 50);
    
    // Compliance efficiency
    const complianceHours = config.complianceHours(buildings);
    const complianceEfficiency = securityScore < 3 ? 0.65 : 0.25;
    const complianceSavings = complianceHours * 85 * complianceEfficiency;
    
    // Tenant trust & retention (estimated value)
    const tenantTrustValue = tenants * 50 * (1 - securityScore/8);
    
    return {
        turniumCost: turniumAnnualCost,
        breakdown: [
            { label: '🛡️ Insurance Premium Reduction', value: insuranceSavings },
            { label: '⏱️ Downtime Prevention', value: downtimeSavings },
            { label: '🚨 Data Breach Risk Mitigation', value: breachSavings },
            { label: '🏢 Smart Building Security', value: smartBuildingSavings },
            { label: '👥 Vendor Risk Management', value: vendorSavings },
            { label: '✅ Compliance & Reporting', value: complianceSavings },
            { label: '🤝 Tenant Trust & Retention', value: tenantTrustValue }
        ]
    };
}

// Schedule demo function
function scheduleDemo() {
    const config = industryData[currentIndustry];
    const inputs = {};
    
    Object.keys(config.metrics).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            inputs[key] = element.value;
        }
    });
    
    const netSavings = document.getElementById('totalSavings').textContent;
    const roi = document.getElementById('roiPercentage').textContent;
    
    // Prepare form data
    const formData = {
        industry: currentIndustry,
        industryName: config.name,
        inputs: inputs,
        netSavings: netSavings,
        roi: roi,
        timestamp: new Date().toISOString()
    };
    
    // In production, send to your CRM/backend
    // fetch('/api/demo-request', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
    
    // For now, show alert
    let message = `Demo Request - ${config.name}\n\n`;
    
    if (currentIndustry === 'accounting') {
        message += `Firm Size: ${inputs.employees} employees\n`;
        message += `Revenue: ${formatValue('revenue', parseInt(inputs.revenue), 'currency')}\n`;
    } else if (currentIndustry === 'property') {
        message += `Portfolio: ${inputs.buildings} buildings, ${inputs.tenants} tenants\n`;
    }
    message += `Potential Savings: ${netSavings}\n`;
    message += `ROI: ${roi}\n\n`;
    message += `A Turnium specialist will contact you within 24 hours.`;
    
    alert(message);
    
    // Optional: Track with analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'demo_request', {
    //         'industry': currentIndustry,
    //         'roi_percentage': parseInt(roi),
    //         'savings_amount': netSavings
    //     });
    // }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize checkboxes
    initializeCheckboxes();
    
    // Render initial industry inputs
    renderIndustryInputs();
    
    // Calculate initial values
    updateCalculator();
});