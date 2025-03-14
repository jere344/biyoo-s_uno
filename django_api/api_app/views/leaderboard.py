from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from auth_app.models import CustomUser
from django.db.models import F, ExpressionWrapper, FloatField, Case, When, Value
from django.db.models.functions import Cast

class LeaderboardView(APIView):
    def get(self, request):
        sort_by = request.query_params.get('sort_by', 'games_won')
        limit = int(request.query_params.get('limit', 10))
        
        queryset = CustomUser.objects.all().order_by(f'-{sort_by}')[:limit]
        
        leaderboard_data = [user.to_dict_public() for user in queryset]
        
        return Response(leaderboard_data, status=status.HTTP_200_OK)
