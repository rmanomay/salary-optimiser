from rest_framework import serializers

class SalaryInputsSerializer(serializers.Serializer):
    basic = serializers.FloatField()
    hra = serializers.FloatField()
    special_allowance = serializers.FloatField()
    lta = serializers.FloatField()
    variable_pay = serializers.FloatField()
    other_allowances = serializers.FloatField()
    pf_deduction = serializers.FloatField()
    professional_tax = serializers.FloatField()

class InvestmentsSerializer(serializers.Serializer):
    section_80c = serializers.FloatField()
    section_80d = serializers.FloatField()
    hra_rent_paid = serializers.FloatField()
    nps_self = serializers.FloatField()
    nps_employer = serializers.FloatField()
    home_loan_interest = serializers.FloatField()

class TaxRequestSerializer(serializers.Serializer):
    salary = SalaryInputsSerializer()
    investments = InvestmentsSerializer()

class TaxResultSerializer(serializers.Serializer):
    regime = serializers.CharField()
    gross_salary = serializers.FloatField()
    taxable_income = serializers.FloatField()
    tax_amount = serializers.FloatField()
    cess = serializers.FloatField()
    total_tax = serializers.FloatField()
    in_hand_monthly = serializers.FloatField()
    deductions_breakdown = serializers.DictField(child=serializers.FloatField())

class ComparisonResponseSerializer(serializers.Serializer):
    old_regime = TaxResultSerializer()
    new_regime = TaxResultSerializer()
