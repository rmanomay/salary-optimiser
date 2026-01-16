from http.server import BaseHTTPRequestHandler
import json
from typing import Dict

# ================== MODELS ==================
class SalaryInputs:
    def __init__(self, data: dict):
        self.basic = float(data.get('basic', 0))
        self.hra = float(data.get('hra', 0))
        self.special_allowance = float(data.get('special_allowance', 0))
        self.lta = float(data.get('lta', 0))
        self.variable_pay = float(data.get('variable_pay', 0))
        self.other_allowances = float(data.get('other_allowances', 0))
        self.pf_deduction = float(data.get('pf_deduction', 0))
        self.professional_tax = float(data.get('professional_tax', 0))

class Investments:
    def __init__(self, data: dict):
        self.section_80c = float(data.get('section_80c', 0))
        self.section_80d = float(data.get('section_80d', 0))
        self.hra_rent_paid = float(data.get('hra_rent_paid', 0))
        self.nps_self = float(data.get('nps_self', 0))
        self.nps_employer = float(data.get('nps_employer', 0))
        self.home_loan_interest = float(data.get('home_loan_interest', 0))

# ================== TAX ENGINE ==================
def calculate_tax_new_regime(salary: SalaryInputs, investments: Investments, gross_salary: float) -> dict:
    std_deduction = 75000
    
    deductions = {
        'Standard Deduction': std_deduction,
        'NPS Employer (80CCD(2))': investments.nps_employer
    }
    
    total_deductions = sum(deductions.values())
    taxable_income = max(0, gross_salary - total_deductions)
    
    tax = 0.0
    
    if taxable_income <= 1200000:
        tax = 0.0
    else:
        remaining = taxable_income
        
        if remaining > 400000:
            tax += min(remaining - 400000, 400000) * 0.05
        if remaining > 800000:
            tax += min(remaining - 800000, 400000) * 0.10
        if remaining > 1200000:
            tax += min(remaining - 1200000, 400000) * 0.15
        if remaining > 1600000:
            tax += min(remaining - 1600000, 400000) * 0.20
        if remaining > 2000000:
            tax += min(remaining - 2000000, 400000) * 0.25
        if remaining > 2400000:
            tax += (remaining - 2400000) * 0.30
            
        if taxable_income > 1200000:
            excess_income = taxable_income - 1200000
            if tax > excess_income:
                tax = excess_income
    
    cess = tax * 0.04
    total_tax = tax + cess
    
    in_hand_monthly = (gross_salary - salary.pf_deduction - salary.professional_tax - total_tax) / 12
    
    return {
        "regime": "New",
        "gross_salary": gross_salary,
        "taxable_income": taxable_income,
        "tax_amount": tax,
        "cess": cess,
        "total_tax": total_tax,
        "in_hand_monthly": in_hand_monthly,
        "deductions_breakdown": deductions
    }

def calculate_tax_old_regime(salary: SalaryInputs, investments: Investments, gross_salary: float) -> dict:
    std_deduction = 50000
    
    hra_exemption = max(0, min(
        salary.hra,
        investments.hra_rent_paid - (0.10 * salary.basic),
        0.50 * salary.basic
    ))
    
    sec_80c = min(investments.section_80c + salary.pf_deduction, 150000)
    sec_80d = min(investments.section_80d, 75000)
    nps_self = min(investments.nps_self, 50000)
    home_loan = min(investments.home_loan_interest, 200000)
    lta_exemption = min(salary.lta, 50000)
    
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
    
    if remaining > 250000:
        tax += min(remaining - 250000, 250000) * 0.05
    if remaining > 500000:
        tax += min(remaining - 500000, 500000) * 0.20
    if remaining > 1000000:
        tax += (remaining - 1000000) * 0.30
        
    if taxable_income <= 500000:
        tax = 0.0

    cess = tax * 0.04
    total_tax = tax + cess
    
    in_hand_monthly = (gross_salary - salary.pf_deduction - salary.professional_tax - total_tax) / 12

    return {
        "regime": "Old",
        "gross_salary": gross_salary,
        "taxable_income": taxable_income,
        "tax_amount": tax,
        "cess": cess,
        "total_tax": total_tax,
        "in_hand_monthly": in_hand_monthly,
        "deductions_breakdown": deductions
    }

def compare_tax_regimes(salary_data: dict, investments_data: dict) -> dict:
    salary = SalaryInputs(salary_data)
    investments = Investments(investments_data)
    
    gross_salary = (
        salary.basic + 
        salary.hra + 
        salary.special_allowance + 
        salary.lta + 
        salary.variable_pay + 
        salary.other_allowances
    )
    
    new_regime_res = calculate_tax_new_regime(salary, investments, gross_salary)
    old_regime_res = calculate_tax_old_regime(salary, investments, gross_salary)
    
    return {
        "old_regime": old_regime_res,
        "new_regime": new_regime_res
    }

# ================== VERCEL HANDLER ==================
class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            salary_data = request_data.get('salary', {})
            investments_data = request_data.get('investments', {})
            
            result = compare_tax_regimes(salary_data, investments_data)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
        return
    
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = {"message": "POST to this endpoint with salary and investments data"}
        self.wfile.write(json.dumps(response).encode())
        return
