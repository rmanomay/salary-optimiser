export interface SalaryInputs {
    basic: number;
    hra: number;
    specialAllowance: number;
    lta: number;
    variablePay: number; // yearly
    otherAllowances: number;
    pfDeduction: number; // Employee PF (Yearly)
    professionalTax: number; // Yearly (~2400 usually)
}

export interface Investments {
    section80C: number; // Cap 1.5L
    section80D: number; // Health Ins
    hraRentPaid: number; // Yearly Rent
    npsSelf: number; // 80CCD(1B) - Old only usually
    npsEmployer: number; // 80CCD(2) - Both
    homeLoanInterest: number; // Sec 24
}

export interface TaxResult {
    regime: 'Old' | 'New';
    grossSalary: number;
    taxableIncome: number;
    taxAmount: number;
    cess: number;
    totalTax: number;
    inHandMonthly: number;
    deductionsBreakdown: { [key: string]: number };
}

const NEW_REGIME_SLABS = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.10 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.20 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
];

const OLD_REGIME_SLABS = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];

export function calculateTax(inputs: SalaryInputs, investments: Investments): { oldRegime: TaxResult, newRegime: TaxResult } {
    const grossSalary = inputs.basic + inputs.hra + inputs.specialAllowance + inputs.lta + inputs.variablePay + inputs.otherAllowances;

    // --- NEW REGIME CALCULATION ---
    const stdDedNew = 75000;
    // New Regime Deductions: Only NPS Employer (80CCD(2)) is common major one. Agnipath also but rare.
    // Standard Deduction applies.
    // No HRA, No 80C, No 80D, No HLI (mostly, except rented out property, but assuming simple here).

    const deductionsNew: { [key: string]: number } = {
        'Standard Deduction': stdDedNew,
        'NPS Employer (80CCD(2))': investments.npsEmployer,
    };

    const totalDedNew = Object.values(deductionsNew).reduce((a, b) => a + b, 0);
    const taxableIncomeNew = Math.max(0, grossSalary - totalDedNew);

    let taxNew = 0;
    // Basic Calculation
    if (taxableIncomeNew > 1200000) {
        // If > 12L, calculate slab wise. 
        // Note: Rebate 87A makes tax ZERO if TI <= 12L.
        // Slabs: 0-4L: 0
        // 4-8L: 5% of (8L-4L) = 20k
        // 8-12L: 10% of (12L-8L) = 40k
        // Cumulative tax at 12L = 60k.
        // Rebate amount is up to 60k. So if TI <= 12L, tax is 0.

        let remainingIncome = taxableIncomeNew;
        let previousLimit = 0;

        for (const slab of NEW_REGIME_SLABS) {
            if (remainingIncome > previousLimit) {
                const taxableInSlab = Math.min(remainingIncome, slab.limit) - previousLimit;
                taxNew += taxableInSlab * slab.rate;
                previousLimit = slab.limit;
            }
        }

        // Marginal Relief Check for New Regime
        // If Income is slightly > 12L, verify if (Tax > (Income - 12L)).
        // Tax on 12L is 60k.
        // If Income is 12,10,000.  (Income - 12L = 10k).
        // Tax normal calc: 0-4:0, 4-8:20k, 8-12:40k, 12-12.1: 15% of 10k = 1500. Total = 61,500.
        // 61,500 > 10,000.
        // So pay (Income-12L) ? 
        // Rule: Tax payable shall not exceed the amount by which income exceeds 12L.
        // So Tax = 10,000.

        if (taxableIncomeNew > 1200000) {
            const excessIncome = taxableIncomeNew - 1200000;
            // Normal tax computed above.
            // Tax on 12L is exactly 60,000 (pre-cess).
            // Actually, let's recompute precise.
            // 4L * 0 = 0
            // 4L * 5% = 20,000
            // 4L * 10% = 40,000
            // Sum = 60,000.
            if (taxNew > excessIncome) {
                // Wait, the comparison is: (Tax on Income) - (Tax on 12L which is 60k is wrong, it is 0 due to rebate)
                // No. Marginal Relief is: Tax Payable should not exceed (Income - Threshold).
                // But Threshold is 12L. Tax on 12L is nil? No, tax on 12L is 60k, rebate makes it 0.
                // Marginal relief compares Tax Calculated vs (Income - 12L).
                // Correct logic: Tax = min(CalculatedTax, (TaxableIncome - 1200000)) ? 
                // Actually it's: Payable Tax = (Income - 12L) + (Tax on 12L with rebate? No, tax on 12L is 0).
                // It means you just give the excess income as tax.
                // BUT only if CalculatedTax > (Income - 12L).

                // Let's hold on complex marginal relief if needed, but for robust calc:
                taxNew = Math.min(taxNew, taxableIncomeNew - 1200000);
            }
        }

    } else {
        taxNew = 0; // Rebate u/s 87A
    }

    const cessNew = taxNew * 0.04;
    const totalTaxNew = taxNew + cessNew;


    // --- OLD REGIME CALCULATION ---
    const stdDedOld = 50000;

    // HRA Exemption
    // Min of:
    // 1. Actual HRA
    // 2. Rent Paid - 10% of Basic
    // 3. 50% of Basic (Metro) or 40% (Non-Metro). Assuming 50% for simplicity or max possible.
    const hraExemption = Math.max(0, Math.min(
        inputs.hra,
        investments.hraRentPaid - (0.1 * inputs.basic),
        0.5 * inputs.basic
    ));

    const deductionsOld: { [key: string]: number } = {
        'Standard Deduction': stdDedOld,
        'Professional Tax': inputs.professionalTax,
        'Section 80C': Math.min(investments.section80C + inputs.pfDeduction, 150000), // PF is part of 80C
        'Section 80D': Math.min(investments.section80D, 75000), // Max usually 25k self + 50k parents
        'Section 80CCD(1B) (NPS Self)': Math.min(investments.npsSelf, 50000),
        'Section 80CCD(2) (NPS Emp)': investments.npsEmployer, // Allowed in both
        'HRA Exemption': hraExemption,
        'Home Loan Interest': Math.min(investments.homeLoanInterest, 200000),
        'LTA Exemption': Math.min(inputs.lta, 50000) // Assuming usage logic external or simplified
    };

    const totalDedOld = Object.values(deductionsOld).reduce((a, b) => a + b, 0);
    const taxableIncomeOld = Math.max(0, grossSalary - totalDedOld);

    let taxOld = 0;
    // Old Regime Slabs (Traditional)
    // 0-2.5: 0
    if (taxableIncomeOld > 250000) {
        let remaining = taxableIncomeOld;
        let prev = 0;
        for (const slab of OLD_REGIME_SLABS) {
            if (remaining > prev) {
                const taxable = Math.min(remaining, slab.limit) - prev;
                taxOld += taxable * slab.rate;
                prev = slab.limit;
            }
        }
    }

    // Rebate 87A Old: TI <= 5L -> Tax 0 (Rebate 12500)
    if (taxableIncomeOld <= 500000) {
        taxOld = 0;
    }

    const cessOld = taxOld * 0.04;
    const totalTaxOld = taxOld + cessOld;

    // In Hand Calculation
    const monthlyInHandNew = (grossSalary - inputs.pfDeduction - inputs.professionalTax - totalTaxNew) / 12;
    const monthlyInHandOld = (grossSalary - inputs.pfDeduction - inputs.professionalTax - totalTaxOld) / 12;

    return {
        oldRegime: {
            regime: 'Old',
            grossSalary,
            taxableIncome: taxableIncomeOld,
            taxAmount: taxOld,
            cess: cessOld,
            totalTax: totalTaxOld,
            inHandMonthly: monthlyInHandOld,
            deductionsBreakdown: deductionsOld
        },
        newRegime: {
            regime: 'New',
            grossSalary,
            taxableIncome: taxableIncomeNew,
            taxAmount: taxNew,
            cess: cessNew,
            totalTax: totalTaxNew,
            inHandMonthly: monthlyInHandNew,
            deductionsBreakdown: deductionsNew
        }
    };
}

// Helper to fix specific inHand assignment above
export function calculateInHand(gross: number, annualTax: number, pf: number, pt: number): number {
    return (gross - pf - pt - annualTax) / 12;
}
