from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaxRequestSerializer, ComparisonResponseSerializer
from tax_engine import compare_tax_regimes
from types import SimpleNamespace

def dict_to_namespace(d):
    return SimpleNamespace(**{k: dict_to_namespace(v) if isinstance(v, dict) else v for k, v in d.items()})

class CalculateTaxView(APIView):
    def post(self, request):
        serializer = TaxRequestSerializer(data=request.data)
        if serializer.is_valid():
            # The tax_engine expects objects with dot notation (like Pydantic models)
            # We can convert the validated data to nested SimpleNamespaces
            data = serializer.validated_data
            
            # Create a mock request object that tax_engine expects
            class MockRequest:
                def __init__(self, data):
                    self.salary = SimpleNamespace(**data['salary'])
                    self.investments = SimpleNamespace(**data['investments'])
            
            mock_request = MockRequest(data)
            
            result = compare_tax_regimes(mock_request)
            
            # result is a ComparisonResponse (Pydantic model?) 
            # Actually tax_engine returns ComparisonResponse(old_regime=TaxResult(...), ...)
            # We can convert these to dicts for the serializer
            
            def pydantic_to_dict(obj):
                if hasattr(obj, 'model_dump'):
                    return obj.model_dump()
                return obj.__dict__

            response_data = {
                'old_regime': pydantic_to_dict(result.old_regime),
                'new_regime': pydantic_to_dict(result.new_regime)
            }
            
            # Validate with response serializer (optional but good for consistency)
            res_serializer = ComparisonResponseSerializer(data=response_data)
            if res_serializer.is_valid():
                return Response(res_serializer.data)
            return Response(res_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
