from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from api_app.models import Message, Room
# no serializer

class RoomViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    permission_classes = [IsAuthenticated]
    queryset = Room.objects.all()

    def create(self, request):
        try :
            room = Room()
            room.from_dict(request.data)
            room.save()
            room.add_user(request.user, force=True)

            return Response(room.to_dict(), status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    
    def update(self, request, pk):
        room = get_object_or_404(Room, pk=pk)
        try:
            room.from_dict(request.data)
            room.save()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(room.to_dict(), status=status.HTTP_200_OK)

    def list(self, request):
        rooms = Room.objects.all()
        for to_delete in rooms.filter(users=None):
            to_delete.delete()
        return Response([room.to_dict() for room in rooms], status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk):
        room = get_object_or_404(Room, pk=pk)
        if request.user not in room.users.all():
            return Response({"error": "You are not in this room"}, status=status.HTTP_403_FORBIDDEN)
        return Response(room.private_to_dict(), status=status.HTTP_200_OK)
    
    def join(self, request, pk):
        room = get_object_or_404(Room, pk=pk)
        # if the user was invited, we can force join the room
        try :
            if request.data.get("code") and request.data.get("code") == room.invitation_code:
                room.add_user(request.user, force=True)
            else :
                room.add_user(request.user, force=False)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(room.to_dict(), status=status.HTTP_200_OK)

    def leave(self, request, pk):
        room = get_object_or_404(Room, pk=pk)
        try:
            room.remove_user(request.user)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)

class ChatViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'delete']
    permission_classes = [IsAuthenticated]
    queryset = Room.objects.all()

    def create(self, request, pk):
        if request.user not in Room.objects.get(pk=pk).users.all():
            return Response({"error": "You are not in this room"}, status=status.HTTP_403_FORBIDDEN)
        
        # if there are more than 50 messages, delete the oldest one
        messages = Message.objects.filter(room=Room.objects.get(pk=pk))
        if messages.count() > 50:
            messages.order_by('created_at')[0].delete()

        message = Message()
        message.from_dict(request.data)
        message.room = Room.objects.get(pk=pk)
        message.sender = request.user
        message.save()
        
        return Response(message.to_dict(), status=status.HTTP_201_CREATED)
    
    def list(self, request, pk):
        try :
            if request.user not in Room.objects.get(pk=pk).users.all():
                return Response({"error": "You are not in this room"}, status=status.HTTP_403_FORBIDDEN)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
        
        messages = Message.objects.filter(room=Room.objects.get(pk=pk))
        return Response([message.to_dict() for message in messages], status=status.HTTP_200_OK)
    
    def destroy(self, request, pk, message_id):
        message = get_object_or_404(Message, pk=message_id)
        if request.user != message.sender:
            return Response({"error": "You are not the sender of this message"}, status=status.HTTP_403_FORBIDDEN)
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    


    