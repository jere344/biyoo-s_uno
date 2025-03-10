from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# uno cards are readonly. Each game just link to the correct card and doesn't edit it.
# the images are already there.
class UnoCard(models.Model):
    color:str = models.CharField(max_length=100, verbose_name="couleur")
    action:str = models.CharField(max_length=100, verbose_name="action")
    image:str = models.ImageField(upload_to="base_cards", verbose_name="image")
    is_special = models.BooleanField(verbose_name="carte spéciale", default=False) # cards that are not really playeable
    
    def __str__(self):
        return f"{self.color} {self.action} {self.image}"
    
    class Meta:
        verbose_name = "carte"
        verbose_name_plural = "cartes"
        ordering = ['color', 'action']
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "color": self.color,
            "action": self.action,
            "image": f"{settings.MEDIA_FULL_URL}{self.image}"
        }

class UnoPlayer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="joueur")
    hand = models.ManyToManyField(UnoCard, verbose_name="main")
    player_number = models.IntegerField(verbose_name="numéro de joueur", db_index=True)
    said_uno = models.BooleanField(verbose_name="a dit uno", default=False)
    game = models.ForeignKey("UnoGame", on_delete=models.CASCADE, verbose_name="partie", related_name="players")
    card_back = models.ForeignKey(UnoCard, on_delete=models.CASCADE, verbose_name="dos de carte", related_name="in_game_back", null=True)
    
    def __str__(self):
        return f"{self.user.username}"
    
    class Meta:
        verbose_name = "joueur"
        verbose_name_plural = "joueurs"
        ordering = ['user']
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user": {
                "id": self.user.id,
                "username": self.user.username,
                "profile_picture": f"{settings.MEDIA_FULL_URL}{self.user.profile_picture}" if self.user.profile_picture else None
            },
            "player_number": self.player_number,
            "hand": [card.to_dict() for card in self.hand.all()],
            "said_uno": self.said_uno,
            "card_back" : UnoCard.objects.get(id=1).to_dict()
        }
        
    
    
class UnoGame(models.Model):
    current_card = models.ForeignKey(UnoCard, on_delete=models.CASCADE, verbose_name="carte actuelle" , related_name="in_game_current", null=True)
    direction = models.BooleanField(verbose_name="sens du jeu")
    pile = models.ManyToManyField(UnoCard, verbose_name="pioche", related_name="in_game_piles", blank=True)
    current_player_number = models.IntegerField(verbose_name="joueur actuel", null=True)
    room = models.OneToOneField("Room", on_delete=models.CASCADE, verbose_name="salle")
    stored_to_draw = models.IntegerField(verbose_name="cartes à piocher", default=0) # for +2 and +4 cards
    game_over = models.BooleanField(verbose_name="fin de partie")
    winner = models.ForeignKey(UnoPlayer, on_delete=models.CASCADE, verbose_name="gagnant", related_name="won", null=True)

    @property
    def current_player(self) -> UnoPlayer:
        return self.players.get(player_number=self.current_player_number)
    
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "current_card": self.current_card.to_dict(),
            "direction": self.direction,
            "pile": [card.to_dict() for card in self.pile.all()],
            "game_over": self.game_over,
            "current_player_number": self.current_player_number,
            "players": [player.to_dict() for player in self.players.all()],
            "card_back" : UnoCard.objects.get(id=1).to_dict(),
            "winner": self.winner.to_dict() if self.winner else None
        }
    
    def __str__(self):
        return f"Partie {self.id}"
    
    class Meta:
        verbose_name = "partie"
        verbose_name_plural = "parties"
        ordering = ['id']

 