from pydantic import BaseModel
from typing import Dict, Optional

class SalaryInputs(BaseModel):
    basic: float
    hra: float
    special_allowance: float
    lta: float
    variable_pay: float  # yearly
    other_allowances: float
    pf_deduction: float # Yearly Employee PF
    professional_tax: float

class Investments(BaseModel):
    section_80c: float # Cap 1.5L usually
    section_80d: float # Health Ins
    hra_rent_paid: float # Yearly Rent
    nps_self: float # 80CCD(1B)
    nps_employer: float # 80CCD(2)
    home_loan_interest: float

class TaxRequest(BaseModel):
    salary: SalaryInputs
    investments: Investments

class TaxResult(BaseModel):
    regime: str
    gross_salary: float
    taxable_income: float
    tax_amount: float
    cess: float
    total_tax: float
    in_hand_monthly: float
    deductions_breakdown: Dict[str, float]

class ComparisonResponse(BaseModel):
    old_regime: TaxResult
    new_regime: TaxResult
