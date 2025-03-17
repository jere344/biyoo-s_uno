from django.conf import settings
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
    cards_currency = models.IntegerField(default=0)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    is_online = models.BooleanField(default=False)
    last_activity = models.DateTimeField(auto_now=True)

    @property
    def card_back(self):
        active_card = self.card_back_inventory.filter(is_active=True).first()
        return active_card.card_back if active_card else None

    @property
    def game_environment(self):
        active_game_env = self.game_environment_inventory.filter(is_active=True).first()
        return active_game_env.game_environment if active_game_env else None

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'username': self.username,
            'profile_picture': f"{settings.MEDIA_FULL_URL}{self.profile_picture}"  if self.profile_picture else None,
            'room_id': self.room.id if self.room else None,
            'cards_currency': self.cards_currency,
            'games_played': self.games_played,
            'games_won': self.games_won,
            'is_online': self.is_online,
            'last_activity': self.last_activity.isoformat(),
        }
    
    def to_dict_public(self) -> dict:
        return {
            'id': self.id,
            'username': self.username,
            "profile_picture": f"{settings.MEDIA_FULL_URL}{self.profile_picture}" if self.profile_picture else None,
            'games_played': self.games_played,
            'games_won': self.games_won,
        }


class CustomUserManager(BaseUserManager):
    pass


@receiver(post_save, sender=CustomUser)
def user_updated(sender, instance:CustomUser, **kwargs):
    """
    Signal handler to broadcast user updates to connected clients
    """
    channel_layer = get_channel_layer()
    if channel_layer:
        # Send to user-specific group
        try:
            async_to_sync(channel_layer.group_send)(
                f"user_{instance.id}",
                {
                    "type": "user_update",
                    "data": instance.to_dict()
                }
            )
        except Exception as e:
            # Handle any channel layer errors
            print(f"Failed to send user update for user {instance.id}: {str(e)}")