
import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework_simplejwt.tokens import AccessToken

class UserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        # all validation logic
        query_string = parse_qs(self.scope["query_string"].decode())
        token = query_string.get("token", [None])[0]
        if token:
            try:
                # Validate token and get user
                access_token = AccessToken(token)
                user_id = access_token["user_id"]
                self.user = await database_sync_to_async(User.objects.get)(id=user_id)
                self.scope["user"] = self.user
            except Exception as e:
                self.send(text_data=json.dumps({
                    "type": "error",
                    "error": "failed to test token" + str(e)
                }))
                await self.close(code=4000)
                return
        else:
            self.send(text_data=json.dumps({
                "type": "error",
                "error": "Token not provided"
            }))
            await self.close(code=4000)
            return

        if not self.user.is_authenticated:
            self.send(text_data=json.dumps({
                "type": "error",
                "error": "User not authenticated"
            }))
            await self.close(code=4000)
            return
        
        # connection succcessful, add user to user group
        self.user_id = self.user.id
        self.user_group_name = f"user_{self.user_id}"
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        # Send initial user data
        user_data = await self.get_user_data(self.user_id)
        await self.send(text_data=json.dumps({
            'type': 'user_data',
            'data': user_data
        }))

        # set user online
        self.user.is_online = True
        await database_sync_to_async(self.user.save)()

    
    async def disconnect(self, close_code):
        if hasattr(self, "user_group_name"):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
        if hasattr(self, "user"):
            self.user.is_online = False
            await database_sync_to_async(self.user.save)()
    
    async def receive(self, text_data):
        # Handle any client-to-server communication if needed
        pass
    
    @database_sync_to_async
    def get_user_data(self, user_id):
        user = User.objects.get(id=user_id)
        return {
            'id': user.id,
            'username': user.username,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
            'room_id': user.room.id if user.room else None,
            'test': 'test',
            # Add future fields like currency, etc. here
        }
    
    async def user_update(self, event):
        """
        Handler for user update events
        """
        await self.send(text_data=json.dumps({
            'type': 'user_update',
            'data': event['data']
        }))
