import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db import transaction
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
                self.user = await self.get_user_by_id(user_id)
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
        user_data = await self.get_user_data()
        self.send(text_data=json.dumps({
            "type": "user_data",
            "data": user_data
        }))

        # set user online
        await self.set_user_online(self.user_id, True)

    
    async def disconnect(self, close_code):
        if hasattr(self, "user_group_name"):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
        if hasattr(self, "user"):
            await self.set_user_online(self.user.id, False)
    
    async def receive(self, text_data):
        # Handle any client-to-server communication if needed
        pass

    @database_sync_to_async
    def get_user_data(self):
        return self.user.to_dict()

    
    @database_sync_to_async
    def get_user_by_id(self, user_id):
        with transaction.atomic():
            return User.objects.select_for_update().get(id=user_id)
    
    @database_sync_to_async
    def set_user_online(self, user_id, is_online):
        with transaction.atomic():
            user = User.objects.select_for_update().get(id=user_id)
            if user.is_online != is_online:
                user.is_online = is_online
                user.save()
            return user
    
    async def user_update(self, event):
        """
        Handler for user update events
        """
        await self.send(text_data=json.dumps({
            'type': 'user_update',
            'data': event['data']
        }))