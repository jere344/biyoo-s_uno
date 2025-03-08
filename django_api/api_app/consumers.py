import datetime
import json 
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.auth import AuthMiddlewareStack
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from django.conf import settings
from api_app.models import Message

# export default interface IMessage {
#   id: number;
#   room_id: number;
#   sender: IUser;
#   content: string;
#   created_at: string;
# }



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