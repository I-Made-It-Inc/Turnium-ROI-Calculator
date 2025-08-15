// js/ui.js - UI Update Functions

// Format value based on type
function formatValue(key, value, unit) {
    if (unit === 'currency' || key === 'revenue' || key === 'insurance') {
        return formatCurrency(value);
    }
    return value.toLocaleString();
}

// Format currency values
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + Math.round(amount).toLocaleString();
    }
    return '$' + Math.round(amount);
}

// Render industry-specific input fields
function renderIndustryInputs() {
    const config = industryData[currentIndustry];
    let html = '';
    
    Object.entries(config.metrics).forEach(([key, metric]) => {
        const step = metric.step || 1;
        const value = metric.default;
        
        html += `
            <div class="form-group">
                <label for="${key}">${metric.label}</label>
                <div class="slider-container">
                    <input type="range" id="${key}" 
                        min="${metric.min}" 
                        max="${metric.max}" 
                        step="${step}"
                        value="${value}" 
                        oninput="updateCalculator()">
                    <span class="range-value" id="${key}Value">${formatValue(key, value, metric.unit)}</span>
                </div>
            </div>
        `;
    });
    
    document.getElementById('industryInputs').innerHTML = html;
    document.getElementById('inputTitle').textContent = config.title;
}

// Toggle checkbox state
function toggleCheckbox(id) {
    const checkbox = document.getElementById(id);
    if (event.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
    }
    
    // Update visual state
    const item = checkbox.closest('.checkbox-item');
    if (checkbox.checked) {
        item.classList.add('checked');
    } else {
        item.classList.remove('checked');
    }
    
    updateCalculator();
}

// Update the display with calculation results
function updateDisplay(calculations) {
    const { turniumCost, breakdown } = calculations;
    
    // Calculate totals
    const totalGrossSavings = breakdown.reduce((sum, item) => sum + item.value, 0);
    const netSavings = totalGrossSavings - turniumCost;
    const roi = turniumCost > 0 ? (netSavings / turniumCost) * 100 : 0;
    
    // Update savings display
    document.getElementById('totalSavings').textContent = formatCurrency(netSavings);
    
    // Update ROI with color coding
    const roiElement = document.getElementById('roiPercentage');
    roiElement.textContent = Math.round(roi) + '% ROI';
    roiElement.className = 'roi-percentage ' + (roi >= 100 ? 'roi-positive' : roi >= 0 ? 'roi-neutral' : 'roi-negative');
    
    // Update payback period
    updatePaybackPeriod(netSavings, turniumCost, totalGrossSavings);
    
    // Update breakdown
    updateBreakdownDisplay(breakdown, turniumCost);
}

// Update payback period display
function updatePaybackPeriod(netSavings, turniumCost, totalGrossSavings) {
    const paybackElement = document.getElementById('paybackInfo');
    
    if (netSavings <= 0) {
        paybackElement.textContent = 'No payback period (negative ROI)';
        paybackElement.className = 'payback-info danger';
    } else {
        const paybackMonths = turniumCost / (totalGrossSavings / 12);
        
        if (paybackMonths <= 12) {
            paybackElement.textContent = `Payback Period: ${Math.round(paybackMonths)} months`;
            paybackElement.className = 'payback-info';
        } else if (paybackMonths <= 24) {
            paybackElement.textContent = `Payback Period: ${Math.round(paybackMonths)} months`;
            paybackElement.className = 'payback-info warning';
        } else if (paybackMonths <= 120) {
            const years = Math.floor(paybackMonths / 12);
            const months = Math.round(paybackMonths % 12);
            paybackElement.textContent = `Payback Period: ${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
            paybackElement.className = 'payback-info warning';
        } else {
            paybackElement.textContent = 'Payback Period: 10+ years';
            paybackElement.className = 'payback-info danger';
        }
    }
}

// Update breakdown display
function updateBreakdownDisplay(breakdown, turniumCost) {
    let breakdownHTML = '';
    
    breakdown.forEach(item => {
        const valueClass = item.value > 0 ? 'positive' : '';
        breakdownHTML += `
            <div class="breakdown-item">
                <span class="breakdown-label">${item.label}</span>
                <span class="breakdown-value ${valueClass}">${formatCurrency(item.value)}</span>
            </div>
        `;
    });
    
    // Add investment row
    breakdownHTML += `
        <div class="breakdown-item investment-row">
            <span class="breakdown-label">💳 Turnium Annual Investment</span>
            <span class="breakdown-value">-${formatCurrency(turniumCost)}</span>
        </div>
    `;
    
    document.getElementById('breakdownItems').innerHTML = breakdownHTML;
}

// Initialize checkbox visual states
function initializeCheckboxes() {
    document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('.checkbox-item');
            if (this.checked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
        });
    });
}