from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from .uno import CardBack

User = get_user_model()

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