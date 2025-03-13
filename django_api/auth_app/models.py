from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json


class CustomUser(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    room = models.ForeignKey("api_app.Room", on_delete=models.SET_NULL, null=True, blank=True, related_name="users")
    # Add future fields here
    # currency = models.IntegerField(default=0)
    # Example fields that could be added later:
    # experience_points = models.IntegerField(default=0)
    # games_played = models.IntegerField(default=0)
    # games_won = models.IntegerField(default=0)


class CustomUserManager(BaseUserManager):
    pass


@receiver(post_save, sender=CustomUser)
def user_updated(sender, instance, **kwargs):
    """
    Signal handler to broadcast user updates to connected clients
    """
    channel_layer = get_channel_layer()
    if channel_layer:
        # Prepare user data to be sent
        user_data = {
            'id': instance.id,
            'username': instance.username,
            'profile_picture': instance.profile_picture.url if instance.profile_picture else None,
            'room_id': instance.room.id if instance.room else None,
            # Add future fields here as they're added to the model
        }
        
        # Send to user-specific group
        try:
            async_to_sync(channel_layer.group_send)(
                f"user_{instance.id}",
                {
                    "type": "user_update",
                    "data": user_data
                }
            )
        except:
            # Handle any channel layer errors
            pass