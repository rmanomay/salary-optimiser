from django.urls import path
from .views import CalculateTaxView

urlpatterns = [
    path('calculate', CalculateTaxView.as_view(), name='calculate_tax'),
]
