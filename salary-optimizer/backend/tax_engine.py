from models import SalaryInputs, Investments, TaxResult, ComparisonResponse

def calculate_tax_new_regime(salary: SalaryInputs, investments: Investments, gross_salary: float) -> TaxResult:
    # FY 2025-26 New Regime Slabs
    # 0-4L: Nil
    # 4-8L: 5%
    # 8-12L: 10%
    # 12-16L: 15%
    # 16-20L: 20%
    # 20-24L: 25%
    # >24L: 30%
    
    std_deduction = 75000
    
    # Deductions allowed: 80CCD(2) (NPS Employer) + Std Deduction
    deductions = {
        'Standard Deduction': std_deduction,
        'NPS Employer (80CCD(2))': investments.nps_employer
    }
    
    total_deductions = sum(deductions.values())
    taxable_income = max(0, gross_salary - total_deductions)
    
    tax = 0.0
    
    # Tax Calculation
    # Rebate 87A: If Taxable Income <= 12L, Tax is 0 (Rebate up to 60k is irrelevant if income is below limit, but practically tax becomes 0)
    # Actually, rebate is "up to 60k" or "up to tax payable".
    # Since tax on 12L is 60k, effectively 0 tax <= 12L.
    
    if taxable_income <= 1200000:
        tax = 0.0
    else:
        # Calculate full slab tax
        remaining = taxable_income
        
        # Slabs logic
        # 0-4L: 0
        
        # 4-8L: 5%
        if remaining > 400000:
            tax += min(remaining - 400000, 400000) * 0.05
            
        # 8-12L: 10%
        if remaining > 800000:
            tax += min(remaining - 800000, 400000) * 0.10
            
        # 12-16L: 15%
        if remaining > 1200000:
            tax += min(remaining - 1200000, 400000) * 0.15
            
        # 16-20L: 20%
        if remaining > 1600000:
            tax += min(remaining - 1600000, 400000) * 0.20
            
        # 20-24L: 25%
        if remaining > 2000000:
            tax += min(remaining - 2000000, 400000) * 0.25
        
        # >24L: 30%
        if remaining > 2400000:
            tax += (remaining - 2400000) * 0.30
            
        # Marginal Relief Check
        # If income > 12L, tax payable should not exceed (Income - 12L)
        if taxable_income > 1200000:
            excess_income = taxable_income - 1200000
            if tax > excess_income:
                tax = excess_income
    
    cess = tax * 0.04
    total_tax = tax + cess
    
    in_hand_monthly = (gross_salary - salary.pf_deduction - salary.professional_tax - total_tax) / 12
    
    return TaxResult(
        regime="New",
        gross_salary=gross_salary,
        taxable_income=taxable_income,
        tax_amount=tax,
        cess=cess,
        total_tax=total_tax,
        in_hand_monthly=in_hand_monthly,
        deductions_breakdown=deductions
    )

def calculate_tax_old_regime(salary: SalaryInputs, investments: Investments, gross_salary: float) -> TaxResult:
    # Old Regime Slabs (General <60yo)
    # 0-2.5L: Nil
    # 2.5-5L: 5%
    # 5-10L: 20%
    # >10L: 30%
    
    std_deduction = 50000
    
    # HRA Exemption
    # Min of: HRA Received, Rent Paid - 10% Basic, 50% Basic (Metro assumed)
    hra_exemption = max(0, min(
        salary.hra,
        investments.hra_rent_paid - (0.10 * salary.basic),
        0.50 * salary.basic
    ))
    
    # Investements Caps
    # 80C + PF
    sec_80c = min(investments.section_80c + salary.pf_deduction, 150000)
    sec_80d = min(investments.section_80d, 75000) # Assumed max
    nps_self = min(investments.nps_self, 50000) # 80CCD(1B)
    home_loan = min(investments.home_loan_interest, 200000)
    lta_exemption = min(salary.lta, 50000) # Simplified
    
    deductions = {
        'Standard Deduction': std_deduction,
        'Professional Tax': salary.professional_tax,
        'HRA Exemption': hra_exemption,
        'Section 80C': sec_80c,
        'Section 80D': sec_80d,
        'NPS Self (80CCD(1B))': nps_self,
        'NPS Employer (80CCD(2))': investments.nps_employer,
        'Home Loan Interest': home_loan,
        'LTA Exemption': lta_exemption
    }
    
    total_deductions = sum(deductions.values())
    taxable_income = max(0, gross_salary - total_deductions)
    
    tax = 0.0
    
    remaining = taxable_income
    
    # 2.5-5L: 5%
    if remaining > 250000:
        tax += min(remaining - 250000, 250000) * 0.05
        
    # 5-10L: 20%
    if remaining > 500000:
        tax += min(remaining - 500000, 500000) * 0.20
        
    # >10L: 30%
    if remaining > 1000000:
        tax += (remaining - 1000000) * 0.30
        
    # Rebate 87A (Old)
    # If TI <= 5L, Rebate 12500 (Tax becomes 0)
    if taxable_income <= 500000:
        tax = 0.0

    cess = tax * 0.04
    total_tax = tax + cess
    
    in_hand_monthly = (gross_salary - salary.pf_deduction - salary.professional_tax - total_tax) / 12

    return TaxResult(
        regime="Old",
        gross_salary=gross_salary,
        taxable_income=taxable_income,
        tax_amount=tax,
        cess=cess,
        total_tax=total_tax,
        in_hand_monthly=in_hand_monthly,
        deductions_breakdown=deductions
    )

def compare_tax_regimes(request: TaxRequest) -> ComparisonResponse:
    gross_salary = (
        request.salary.basic + 
        request.salary.hra + 
        request.salary.special_allowance + 
        request.salary.lta + 
        request.salary.variable_pay + 
        request.salary.other_allowances
    )
    
    new_regime_res = calculate_tax_new_regime(request.salary, request.investments, gross_salary)
    old_regime_res = calculate_tax_old_regime(request.salary, request.investments, gross_salary)
    
    return ComparisonResponse(
        old_regime=old_regime_res,
        new_regime=new_regime_res
    )
