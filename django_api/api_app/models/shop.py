from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from .uno import CardBack

User = get_user_model()

# region Shop

class ProfileEffect(models.Model):
    name = models.CharField(max_length=50, verbose_name="nom")
    description = models.TextField(verbose_name="description")
    price = models.PositiveIntegerField(verbose_name="prix")
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price
        }

class GameEnvironment(models.Model):
    name = models.CharField(max_length=50, verbose_name="nom")
    description = models.TextField(verbose_name="description")
    price = models.PositiveIntegerField(verbose_name="prix")
    image = models.ImageField(upload_to="game_environments", verbose_name="image")
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image": f"{settings.MEDIA_FULL_URL}{self.image}",
        }

# region Inventory

class CardBackInventory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="utilisateur", related_name="card_back_inventory")
    card_back = models.ForeignKey(CardBack, on_delete=models.CASCADE, verbose_name="dos de carte", related_name="inventory_items")
    is_active = models.BooleanField(default=False, verbose_name="actif")

    def __str__(self):
        return f"{self.user.username} - {self.card_back.id}"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user": self.user.username,
            "card_back": self.card_back.to_dict(),
            "is_active": self.is_active
        }

class ProfileEffectInventory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="utilisateur", related_name="profile_effect_inventory")
    profile_effect = models.ForeignKey(ProfileEffect, on_delete=models.CASCADE, verbose_name="effet de profil", related_name="inventory_items")
    is_active = models.BooleanField(default=False, verbose_name="actif")

    def __str__(self):
        return f"{self.user.username} - {self.profile_effect.id}"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user": self.user.username,
            "profile_effect": self.profile_effect.to_dict(),
            "is_active": self.is_active
        }

class GameEnvironmentInventory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="utilisateur", related_name="game_environment_inventory")
    game_environment = models.ForeignKey(GameEnvironment, on_delete=models.CASCADE, verbose_name="environnement de jeu", related_name="inventory_items")
    is_active = models.BooleanField(default=False, verbose_name="actif")

    def __str__(self):
        return f"{self.user.username} - {self.game_environment.id}"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user": self.user.username,
            "game_environment": self.game_environment.to_dict(),
            "is_active": self.is_active
        }
