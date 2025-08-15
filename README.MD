# Turnium ROI Calculator

A sophisticated, multi-industry ROI calculator for demonstrating cybersecurity investment returns for Accounting Firms and Property Management companies.

## 🚀 Features

- **Multi-Industry Support**: Tailored calculations for Accounting Firms and Property Management
- **Dynamic Risk Assessment**: Calculates savings based on current security posture
- **Real-Time Updates**: Instant calculation updates as users adjust inputs
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Data-Driven**: All calculations based on industry research and documented metrics

## 📊 Data Sources

All metrics and calculations are derived from comprehensive industry research:
- **Accounting Firms**: Based on 2024-2025 market analysis including IBM Cost of Data Breach reports
- **Property Management**: Based on NIST SP 1800-27 and 2025 industry threat analysis

## 🛠️ Technical Stack

- **Pure HTML/CSS/JavaScript**: No external dependencies required
- **Vanilla JavaScript**: No frameworks needed, ensuring maximum compatibility
- **Responsive CSS Grid**: Modern layout system for all screen sizes
- **Local Storage Ready**: Can be extended to save user inputs

## 📁 File Structure

For production deployment, split into separate files:

```
turnium-calculator/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── calculator.js   # Main calculation logic
│   ├── data.js        # Industry configurations
│   └── ui.js          # UI update functions
├── assets/
│   └── logo.svg       # Turnium logo (if needed)
└── README.md          # This file
```

## 🚦 Quick Start

### Local Testing
1. Save the complete HTML file as `index.html`
2. Open in any modern web browser
3. No server required for basic functionality

### Production Deployment
1. Split the monolithic file into components (see structure above)
2. Host on any static web server (Apache, Nginx, S3, Netlify, etc.)
3. Add analytics tracking code if needed
4. Implement form submission to CRM

## 💡 Usage Guide

### For End Users

1. **Select Industry**: Choose between Accounting Firms or Property Management
2. **Enter Company Metrics**: 
   - Accounting: Employees, Revenue, Current Insurance
   - Property: Buildings, Revenue, Insurance, Tenants
3. **Assess Current Security**: Check existing security measures
4. **View Results**: See potential savings, ROI, and payback period
5. **Schedule Demo**: Click CTA to request personalized consultation

### For Administrators

**Adjusting Pricing**:
```javascript
// In industryData object
turniumPricing: (employees) => employees <= 20 ? 150 : 135  // $/user/month
```

**Modifying Risk Percentages**:
```javascript
baseBreachProb: 0.30,  // 30% annual probability
```

**Adding New Industries**:
```javascript
industryData.newIndustry = {
    title: 'Industry Name',
    metrics: { /* input fields */ },
    risks: { /* risk calculations */ },
    // ... other configurations
}
```

## 📈 Calculation Methodology

### Security Score (0-6 points)
- Each implemented security measure = 1 point
- Score reduces risk probability by 10-15% per point
- Full Turnium solution reduces risk by 85-90%

### ROI Formula
```
Annual Savings = Sum of:
  + Insurance Premium Reduction (10-25%)
  + Downtime Prevention Value
  + Risk Mitigation Value (probability × cost)
  + Compliance Efficiency Savings
  + IT Management Optimization
  - Turnium Annual Investment

ROI % = (Net Savings / Investment) × 100
```

### Payback Period
- If ROI positive: `Investment / Monthly Gross Savings`
- If ROI negative: "No payback period"

## 🔧 Customization Options

### Styling
- Primary colors: Defined in CSS variables
- Gradient: `--primary-gradient`
- Success/Warning/Danger states predefined

### Calculations
- All formulas in `calculateAccountingSavings()` and `calculatePropertySavings()`
- Risk probabilities from actual research data
- Costs based on industry reports

### Form Submission
Currently shows alert; implement actual submission:
```javascript
function scheduleDemo() {
    // Add your CRM integration here
    fetch('/api/demo-request', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
}
```

## 🌐 Hosting Options

### Static Hosting (Recommended)
- **GitHub Pages**: Free, reliable, with custom domain support
- **Netlify**: Free tier, automatic HTTPS, form handling
- **Vercel**: Fast, global CDN, analytics included
- **AWS S3 + CloudFront**: Scalable, enterprise-grade

### Embed in Existing Site
```html
<iframe src="https://your-domain.com/calculator" 
        width="100%" 
        height="800px" 
        frameborder="0">
</iframe>
```

### WordPress Plugin
Can be wrapped as a shortcode:
```php
[turnium_calculator industry="accounting"]
```

## 📊 Analytics Integration

Add tracking for:
- Industry selection
- Input ranges used
- Security measures selected
- CTA clicks
- Time on calculator

Example Google Analytics 4:
```javascript
gtag('event', 'calculate_roi', {
    'industry': currentIndustry,
    'roi_percentage': roi,
    'company_size': employees
});
```

## 🔒 Security Considerations

- No sensitive data stored client-side
- All calculations performed locally
- Form submissions should use HTTPS
- Consider adding CAPTCHA for demo requests
- Implement rate limiting on backend

## 📝 Testing Checklist

- [ ] All sliders update values correctly
- [ ] Industry switching preserves appropriate state
- [ ] Calculations match documented formulas
- [ ] Negative ROI shows appropriate messaging
- [ ] Mobile responsive design works
- [ ] Form submission captures all data
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

## 🆘 Troubleshooting

**Calculator not updating**: Check browser console for JavaScript errors

**Incorrect calculations**: Verify security score is calculating correctly (0-6)

**Mobile layout issues**: Ensure viewport meta tag is present

**Form submission failing**: Check network tab for API endpoint issues

## 📞 Support

For technical questions about the calculator implementation, refer to the calculation methodology documents provided.

## 📄 License

Proprietary - Turnium Technologies. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Author**: Turnium Technologies