import datetime
from auth_app.models import CustomUser
from django.db import models
from django.conf import settings


class Room(models.Model):
    name:str = models.CharField(max_length=100, verbose_name="nom")
    created_at:datetime = models.DateTimeField(auto_now_add=True, verbose_name="créé le")
    player_limit:int = models.IntegerField(default=8, verbose_name="limite de joueurs")
    is_open:bool = models.BooleanField(default=True, verbose_name="ouverte")
    
    def __str__(self):
        return f"{self.name}"
    
    class Meta:
        verbose_name = "salle"
        verbose_name_plural = "salles"
        ordering = ['name']
    
    def to_dict(self) -> dict:
        if not self.id:
            return {}
        return {
            "id": self.id,
            "name": self.name,
            "player_limit": self.player_limit,
            "is_open": self.is_open,
            "users": [
                {
                    "id": user.id,
                    "username": user.username,
                    "profile_picture": f"{settings.MEDIA_FULL_URL}{user.profile_picture}" if user.profile_picture else None
                }
                for user in self.users.all()
            ],
            "created_at": self.created_at,
        }
    
    def from_dict(self, data:dict) -> None:
        """
        Update the Room instance with the data from the dictionary
        """
        self.name = data.get("name", self.name)
        self.player_limit = data.get("player_limit", self.player_limit)
        self.is_open = data.get("is_open", self.is_open)
    
    def add_user(self, user:CustomUser, force: bool) -> None:
        """
        Add a user to the room
        """
        if self.users.count() >= self.player_limit:
            raise ValueError("The room is full")
        if self.is_open == False and force == False:
            raise ValueError("The room is closed")
        user.room = self
        user.save()
    
    def remove_user(self, user:CustomUser) -> None:
        """
        Remove a user from the room
        """
        user.room = None
        user.save()


class Message(models.Model):
    room:Room = models.ForeignKey(Room, on_delete=models.CASCADE, verbose_name="salle")
    sender:CustomUser = models.ForeignKey(CustomUser, on_delete=models.CASCADE, verbose_name="expéditeur")
    content:str = models.TextField(verbose_name="contenu")
    created_at:datetime = models.DateTimeField(auto_now_add=True, verbose_name="créé le")

    def __str__(self):
        return f"{self.sender.username} - {self.content}"
    
    class Meta:
        verbose_name = "message"
        verbose_name_plural = "messages"
        ordering = ['created_at']
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "room_id": self.room.id,
            "sender": {
                "id": self.sender.id,
                "username": self.sender.username,
                "profile_picture": f"{settings.MEDIA_FULL_URL}{self.sender.profile_picture}" if self.sender.profile_picture else None
            },
            "content": self.content,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
    
    def from_dict(self, data:dict) -> None:
        """
        Update the Message instance with the data from the dictionary
        """
        self.content = data.get("content", self.content)
