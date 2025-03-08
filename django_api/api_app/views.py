from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from api_app.models import Comment
from api_app.serializers import CommentSerializer

class CommentViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # users can only create one comment
        if Comment.objects.filter(user=request.user).exists():
            return Response('only_one_comment_allowed', status=status.HTTP_400_BAD_REQUEST)
        serializer.save() 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        if comment.user != request.user:
            return Response('not_allowed', status=status.HTTP_403_FORBIDDEN)
        
        serializer = CommentSerializer(comment, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        updated_comment = serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        if comment.user != request.user:
            return Response('not_allowed', status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        return Response('comment_deleted', status=status.HTTP_200_OK)
    
    def list(self, request):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data if comments else [], status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

from api_app.models import GamePlayed
from api_app.serializers import GamePlayedSerializer

class GamePlayedViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    permission_classes = [IsAuthenticated]
    queryset = GamePlayed.objects.all()
    serializer_class = GamePlayedSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save() 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        game = get_object_or_404(GamePlayed, pk=pk)
        if game.user != request.user:
            return Response('not_allowed', status=status.HTTP_403_FORBIDDEN)
        
        serializer = GamePlayedSerializer(game, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        updated_game = serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        game = get_object_or_404(GamePlayed, pk=pk)
        if game.user != request.user:
            return Response('not_allowed', status=status.HTTP_403_FORBIDDEN)
        game.delete()
        return Response('game_deleted', status=status.HTTP_200_OK)
    
    def list(self, request):
        """ List all games played by the authenticated user """
        limit = request.query_params.get('limit', 20)
        games = GamePlayed.objects.filter(user=request.user).order_by('-created_at')[:int(limit)]
        serializer = GamePlayedSerializer(games, many=True, context={'request': request})
        return Response(serializer.data if games else [], status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        game = get_object_or_404(GamePlayed, pk=pk)
        if game.user != request.user:
            return Response('not_allowed', status=status.HTTP_403_FORBIDDEN)
        serializer = GamePlayedSerializer(game, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    

