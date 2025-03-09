import datetime
import json 
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from api_app.models import Message


class ChatConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['pk']
        self.room_group_name = f"chat_{self.room_id}"
    
        query_string = parse_qs(self.scope['query_string'].decode())
        token = query_string.get('token', [None])[0]

        if token:
            try:
                # Validate token and get user
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                User = get_user_model()
                self.user = User.objects.get(id=user_id)
                if self.user.room_id != self.room_id:
                    print(f"User {self.user.username} tried to connect to a room he is not in")
                    self.close()
                self.scope['user'] = self.user
            except Exception as e:
                self.close()
                return
        else:
            self.close()
            return
        
        if not self.user.is_authenticated:
            self.close()
            return
        
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

    def receive_json(self, content):
        # we also need to save the message to the database
        message = Message.objects.create(
            room_id=content['room_id'],
            sender=self.user,
            content=content['content'],
            created_at=datetime.datetime.now()
        )
        
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message.to_dict()
            }
        )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({'message': message}))