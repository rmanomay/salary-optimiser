import type { SalaryInputs, Investments, TaxResult } from '../utils/taxCalculator';

// Backend is deployed on Vercel
const API_URL = import.meta.env.PROD
    ? 'https://salary-optimizer-api.vercel.app/api'
    : 'http://localhost:8000/api';

export interface ComparisonResponse {
    old_regime: TaxResult;
    new_regime: TaxResult;
}

// Map frontend camelCase to backend snake_case
function transformToApiPayload(inputs: SalaryInputs, investments: Investments) {
    return {
        salary: {
            basic: inputs.basic,
            hra: inputs.hra,
            special_allowance: inputs.specialAllowance,
            lta: inputs.lta,
            variable_pay: inputs.variablePay,
            other_allowances: inputs.otherAllowances,
            pf_deduction: inputs.pfDeduction,
            professional_tax: inputs.professionalTax
        },
        investments: {
            section_80c: investments.section80C,
            section_80d: investments.section80D,
            hra_rent_paid: investments.hraRentPaid,
            nps_self: investments.npsSelf,
            nps_employer: investments.npsEmployer,
            home_loan_interest: investments.homeLoanInterest
        }
    };
}

// Map backend snake_case to frontend camelCase (mostly for TaxResult matches)
// Actually the frontend TaxResult interface in utils matches what we used before.
// We should update the utils/taxCalculator types to match backend response or map them here.
// For now, let's map manual keys if needed, but the TaxResult interface I defined in TS 
// has camelCase keys (taxableIncome, taxAmount). Backend sends snake_case likely (Pydantic default).
// Need to handle that.

function mapResponseToTaxResult(res: any): TaxResult {
    return {
        regime: res.regime,
        grossSalary: res.gross_salary,
        taxableIncome: res.taxable_income,
        taxAmount: res.tax_amount,
        cess: res.cess,
        totalTax: res.total_tax,
        inHandMonthly: res.in_hand_monthly,
        deductionsBreakdown: res.deductions_breakdown
    };
}

export async function calculateTaxAPI(inputs: SalaryInputs, investments: Investments): Promise<{ oldRegime: TaxResult, newRegime: TaxResult }> {
    try {
        const response = await fetch(`${API_URL}/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transformToApiPayload(inputs, investments)),
        });

        if (!response.ok) {
            throw new Error('API Calculation failed');
        }

        const data = await response.json();
        return {
            oldRegime: mapResponseToTaxResult(data.old_regime),
            newRegime: mapResponseToTaxResult(data.new_regime)
        };

    } catch (error) {
        console.error(error);
        throw error;
    }
}
