// js/data.js - Industry Data Configuration

const industryData = {
    accounting: {
        name: 'Accounting Firms',
        title: 'Your Firm Details',
        metrics: {
            employees: { 
                min: 1, 
                max: 100, 
                default: 10, 
                label: 'Number of Employees',
                unit: 'employees'
            },
            revenue: { 
                min: 500000, 
                max: 20000000, 
                step: 100000, 
                default: 2000000, 
                label: 'Annual Revenue',
                unit: 'currency'
            },
            insurance: { 
                min: 1000, 
                max: 50000, 
                step: 500, 
                default: 5000, 
                label: 'Current Cyber Insurance (Annual)',
                unit: 'currency'
            }
        },
        risks: {
            breachCost: 4880000,  // $4.88M from document
            ransomwareCost: 5130000,  // $5.13M from document
            becCost: 129000,  // $129K from document
            downtimePerHour: (revenue) => Math.min(10000, Math.max(3000, revenue * 0.005 / 2080)),
            baseBreachProb: 0.30,
            baseRansomwareProb: 0.25,
            baseBecProb: 0.35
        },
        turniumPricing: (employees) => employees <= 20 ? 150 : 135,
        insuranceReduction: 0.15,  // 15% average
        complianceHours: (employees) => employees * 5,
        downtimeHoursPrevented: (employees) => 20 + (employees * 0.5)
    },
    
    property: {
        name: 'Property Management',
        title: 'Your Property Details',
        metrics: {
            buildings: { 
                min: 1, 
                max: 100, 
                default: 10, 
                label: 'Number of Buildings',
                unit: 'buildings'
            },
            revenue: { 
                min: 200000, 
                max: 15000000, 
                step: 100000, 
                default: 2000000, 
                label: 'Annual Revenue',
                unit: 'currency'
            },
            insurance: { 
                min: 1000, 
                max: 30000, 
                step: 500, 
                default: 3000, 
                label: 'Current Cyber Insurance (Annual)',
                unit: 'currency'
            },
            tenants: { 
                min: 10, 
                max: 2000, 
                default: 200, 
                label: 'Number of Tenants',
                unit: 'tenants'
            }
        },
        risks: {
            breachCost: 680000,  // Average of $120K-$1.24M from document
            smartBuildingCost: 500000,  // Smart building hack estimate
            vendorIncidentCost: 250000,  // Vendor-related breach
            downtimePerMinute: 427,  // $427/minute from document
            baseBreachProb: 0.43,  // 43% from document
            baseSmartBuildingProb: 0.20,
            baseVendorProb: 0.30
        },
        turniumPricing: (buildings) => {
            if (buildings <= 10) return 200;
            if (buildings <= 30) return 275;
            return 375;
        },
        insuranceReduction: 0.18,  // Slightly higher for property due to IoT risks
        complianceHours: (buildings) => buildings * 10,
        downtimeHoursPrevented: (buildings) => 15 + (buildings * 2)
    }
    
    // Easy to add more industries:
    /*
    healthcare: {
        name: 'Healthcare Providers',
        title: 'Your Practice Details',
        metrics: {
            providers: { min: 1, max: 50, default: 5, label: 'Number of Providers' },
            patients: { min: 100, max: 10000, default: 1000, label: 'Number of Patients' },
            revenue: { min: 500000, max: 50000000, step: 100000, default: 3000000, label: 'Annual Revenue' },
            insurance: { min: 2000, max: 100000, step: 1000, default: 10000, label: 'Current Cyber Insurance' }
        },
        risks: {
            breachCost: 10930000,  // Healthcare has highest breach costs
            ransomwareCost: 2000000,
            hipaaPenalty: 2000000,
            downtimePerHour: (revenue) => revenue * 0.01 / 2080,
            baseBreachProb: 0.35,
            baseRansomwareProb: 0.45  // Healthcare heavily targeted
        },
        // ... additional configuration
    },
    
    legal: {
        name: 'Legal Services',
        title: 'Your Law Firm Details',
        // ... configuration
    },
    
    retail: {
        name: 'Retail',
        title: 'Your Store Details',
        // ... configuration
    }
    */
};