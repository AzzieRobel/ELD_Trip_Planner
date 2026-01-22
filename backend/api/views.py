from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def plan_trip(request):
    return Response({
        "message": "Trip planning endpoint ready"
    })
