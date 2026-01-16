from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class TaxCalculationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('calculate_tax')

    def test_calculate_tax_success(self):
        payload = {
            "salary": {
                "basic": 500000,
                "hra": 200000,
                "special_allowance": 100000,
                "lta": 50000,
                "variable_pay": 100000,
                "other_allowances": 50000,
                "pf_deduction": 21600,
                "professional_tax": 2400
            },
            "investments": {
                "section_80c": 150000,
                "section_80d": 25000,
                "hra_rent_paid": 180000,
                "nps_self": 50000,
                "nps_employer": 0,
                "home_loan_interest": 0
            }
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('old_regime', response.data)
        self.assertIn('new_regime', response.data)
        self.assertEqual(response.data['old_regime']['regime'], 'Old')
        self.assertEqual(response.data['new_regime']['regime'], 'New')
