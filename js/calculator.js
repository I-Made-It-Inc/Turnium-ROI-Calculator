// js/calculator.js - Main Calculator Logic

// Global variables
let currentIndustry = 'accounting';
let webhookURL = 'https://a707011368cce5a4b13bb6e2001702.f5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b9d3a2ccbcf44ed8a9eb3e6be275a19e/triggers/manual/paths/invoke/?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mdScpeVv9kVLmBMfZpRON-XXWgPXKkqQF5j0HuIf3eQ'; // TODO: Replace with your actual webhook URL

// Parse URL parameters to pre-populate form
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Pre-populate contact fields if provided
    const fields = {
        'name': 'contactName',
        'company': 'contactCompany',
        'email': 'contactEmail',
        'phone': 'contactPhone'
    };
    
    Object.entries(fields).forEach(([param, fieldId]) => {
        const value = urlParams.get(param);
        if (value) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = decodeURIComponent(value);
                field.classList.add('prefilled');
            }
        }
    });
    
    // Pre-select industry if provided
    const industry = urlParams.get('industry');
    if (industry && industryData[industry]) {
        document.getElementById('industrySelect').value = industry;
        selectIndustry(industry);
    }
}

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
    const { buildings, revenue, insurance, tenants } = inputs;
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

// Schedule demo function with form validation and webhook submission
async function scheduleDemo() {
    // Get form values
    const name = document.getElementById('contactName').value.trim();
    const company = document.getElementById('contactCompany').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    
    // Get form message element
    const messageEl = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitButton');
    
    // Validate email (required field)
    if (!email) {
        showMessage('Please enter your email address', 'error');
        document.getElementById('contactEmail').focus();
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        document.getElementById('contactEmail').focus();
        return;
    }
    
    // Get calculator data
    const config = industryData[currentIndustry];
    const inputs = {};
    const calculatorData = {};
    
    Object.keys(config.metrics).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            inputs[key] = parseInt(element.value);
            calculatorData[key] = inputs[key];
        }
    });
    
    // Add calculated values
    calculatorData.securityScore = calculateSecurityScore();
    calculatorData.estimatedSavings = document.getElementById('totalSavings').textContent;
    calculatorData.roi = document.getElementById('roiPercentage').textContent;
    calculatorData.paybackPeriod = document.getElementById('paybackInfo').textContent;
    
    // Prepare payload for webhook
    const payload = {
        name: name || 'Not provided',
        company: company || 'Not provided',
        email: email,
        phone: phone || '',
        industry: currentIndustry,
        industryName: config.name,
        calculatorData: calculatorData,
        timestamp: new Date().toISOString(),
        sourceURL: window.location.href
    };
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    showMessage('Sending your request...', 'loading');
    
    try {
        // Check if webhook URL is configured
        if (webhookURL === 'YOUR_POWER_AUTOMATE_WEBHOOK_URL') {
            // For testing without webhook - just show success
            console.log('Demo Request Data:', payload);
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Schedule Demo';
                showMessage('Demo request received! A specialist will contact you within 24 hours.', 'success');
                
                // Optional: Clear form after success
                setTimeout(() => {
                    document.getElementById('contactName').value = '';
                    document.getElementById('contactCompany').value = '';
                    document.getElementById('contactEmail').value = '';
                    document.getElementById('contactPhone').value = '';
                    document.querySelectorAll('.contact-input').forEach(input => {
                        input.classList.remove('prefilled');
                    });
                }, 3000);
            }, 1000);
            return;
        }
        
        // Send to Power Automate webhook
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            // Success
            submitBtn.disabled = false;
            submitBtn.textContent = 'Schedule Demo';
            showMessage('Demo request submitted successfully! We\'ll contact you within 24 hours.', 'success');
            
            // Track with analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'demo_request', {
                    'industry': currentIndustry,
                    'roi_percentage': parseInt(calculatorData.roi),
                    'savings_amount': calculatorData.estimatedSavings,
                    'company_size': calculatorData.employees || calculatorData.buildings
                });
            }
            
            // Clear form after success
            setTimeout(() => {
                document.getElementById('contactName').value = '';
                document.getElementById('contactCompany').value = '';
                document.getElementById('contactEmail').value = '';
                document.getElementById('contactPhone').value = '';
                document.querySelectorAll('.contact-input').forEach(input => {
                    input.classList.remove('prefilled');
                });
                messageEl.style.display = 'none';
            }, 5000);
            
        } else {
            throw new Error('Failed to submit request');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Schedule Demo';
        showMessage('There was an error submitting your request. Please try again or contact us directly.', 'error');
    }
}

// Show form message helper
function showMessage(message, type) {
    const messageEl = document.getElementById('formMessage');
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Parse URL parameters and pre-populate fields
    parseURLParameters();
    
    // Initialize checkboxes
    initializeCheckboxes();
    
    // Render initial industry inputs
    renderIndustryInputs();
    
    // Calculate initial values
    updateCalculator();
    
    // Add enter key support for form submission
    document.querySelectorAll('.contact-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                scheduleDemo();
            }
        });
    });
});