import React from 'react';
import type { SalaryInputs, Investments } from '../utils/taxCalculator';

interface Props {
    inputs: SalaryInputs;
    investments: Investments;
    setInputs: React.Dispatch<React.SetStateAction<SalaryInputs>>;
    setInvestments: React.Dispatch<React.SetStateAction<Investments>>;
}

export function SalaryInputForm({ inputs, investments, setInputs, setInvestments }: Props) {

    const handleInputChange = (field: keyof SalaryInputs, value: string) => {
        setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));
    };

    const handleInvChange = (field: keyof Investments, value: string) => {
        setInvestments(prev => ({ ...prev, [field]: Number(value) || 0 }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    💰 Salary Components (Yearly)
                </h3>
                <div className="space-y-4">
                    <InputGroup label="Basic Salary" value={inputs.basic} onChange={v => handleInputChange('basic', v)} />
                    <InputGroup label="HRA" value={inputs.hra} onChange={v => handleInputChange('hra', v)} />
                    <InputGroup label="Special Allowance" value={inputs.specialAllowance} onChange={v => handleInputChange('specialAllowance', v)} />
                    <InputGroup label="LTA" value={inputs.lta} onChange={v => handleInputChange('lta', v)} />
                    <InputGroup label="Variable Pay / Bonus" value={inputs.variablePay} onChange={v => handleInputChange('variablePay', v)} />
                    <InputGroup label="Other Allowances" value={inputs.otherAllowances} onChange={v => handleInputChange('otherAllowances', v)} />
                    <div className="pt-4 border-t border-gray-100">
                        <InputGroup label="Employee PF Deduction" value={inputs.pfDeduction} onChange={v => handleInputChange('pfDeduction', v)} />
                        <InputGroup label="Professional Tax" value={inputs.professionalTax} onChange={v => handleInputChange('professionalTax', v)} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🛡️ Investments & Deductions
                </h3>
                <div className="space-y-4">
                    <InputGroup label="Section 80C (PPF, ELSS, LIC)" value={investments.section80C} onChange={v => handleInvChange('section80C', v)}
                        hint="Max 1.5L (Old Regime)" />
                    <InputGroup label="Section 80D (Health Ins)" value={investments.section80D} onChange={v => handleInvChange('section80D', v)} />
                    <InputGroup label="Rent Paid (Yearly)" value={investments.hraRentPaid} onChange={v => handleInvChange('hraRentPaid', v)} />
                    <InputGroup label="NPS Self (80CCD 1B)" value={investments.npsSelf} onChange={v => handleInvChange('npsSelf', v)} />
                    <InputGroup label="NPS Employer (80CCD 2)" value={investments.npsEmployer} onChange={v => handleInvChange('npsEmployer', v)}
                        hint="Valid in NEW Regime too" />
                    <InputGroup label="Home Loan Interest" value={investments.homeLoanInterest} onChange={v => handleInvChange('homeLoanInterest', v)} />
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, hint }: { label: string, value: number, onChange: (v: string) => void, hint?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                value={value === 0 ? '' : value}
                onChange={e => onChange(e.target.value)}
                placeholder="0"
            />
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
}
