from django.db import models
from django.contrib.auth.models import User
# uno cards are readonly. Each game just link to the correct card and doesn't edit it.
# the images are already there.
class UnoCard(models.Model):
    color:str = models.CharField(max_length=100, verbose_name="couleur")
    action:str = models.CharField(max_length=100, verbose_name="action")
    image:str = models.ImageField(upload_to="base_cards", verbose_name="image")
    
    def __str__(self):
        return f"{self.color} {self.action} {self.image}"
    
    class Meta:
        verbose_name = "carte"
        verbose_name_plural = "cartes"
        ordering = ['color', 'action']
    
    def to_dict(self, request=None) -> dict:
        return {
            "id": self.id,
            "color": self.color,
            "action": self.action,
            "image": request.build_absolute_uri(self.image.url) if request else self.image.url
        }

class UnoPlayer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="joueur")
    hand = models.ManyToManyField(UnoCard, verbose_name="main")
    player_number = models.IntegerField(verbose_name="numéro de joueur", db_index=True)
    said_uno = models.BooleanField(verbose_name="a dit uno", default=False)
    game = models.ForeignKey("UnoGame", on_delete=models.CASCADE, verbose_name="partie", related_name="players")
    
    def __str__(self):
        return f"{self.user.username}"
    
    class Meta:
        verbose_name = "joueur"
        verbose_name_plural = "joueurs"
        ordering = ['user']
    
    def to_dict(self, request=None) -> dict:
        return {
            "id": self.id,
            "user": self.user.username,
            "player_number": self.player_number,
            "hand": [card.to_dict() for card in self.hand.all()],
            "said_uno": self.said_uno
        }
    
    
class UnoGame(models.Model):
    current_card = models.ForeignKey(UnoCard, on_delete=models.CASCADE, verbose_name="carte actuelle" , related_name="in_game_current")
    direction = models.BooleanField(verbose_name="sens du jeu")
    pile = models.ManyToManyField(UnoCard, verbose_name="pioche", related_name="in_game_piles")
    game_over = models.BooleanField(verbose_name="fin de partie")
    current_player_number = models.IntegerField(verbose_name="joueur actuel")

    @property
    def current_player(self) -> UnoPlayer:
        return self.players.get(player_number=self.current_player_number)
    
    def to_dict(self, request=None) -> dict:
        return {
            "id": self.id,
            "current_card": self.current_card.to_dict(),
            "direction": self.direction,
            "pile": [card.to_dict() for card in self.pile.all()],
            "game_over": self.game_over,
            "current_player": self.current_player.to_dict()
        }
    
    def __str__(self):
        return f"Partie {self.id}"
    
    class Meta:
        verbose_name = "partie"
        verbose_name_plural = "parties"
        ordering = ['id']

    
import random



# all the settings that can be changed for a game
class UnoGameRules:
    def __init__(self):
        self.starting_cards_count = 7
        self.starting_deck = []
        self.players = []

    def verify(self):
        if len(self.players) < 2:
            raise Exception("Not enough players")
        if len(self.starting_deck) < len(self.players) * self.starting_cards_count + 1:
            raise Exception("Not enough cards")
        if self.starting_cards_count < 1:
            raise Exception("Can't start with less than one card")
        for player in self.players:
            if self.players.count(player) > 1:
                raise Exception("Duplicate player")
            if UnoPlayer.objects.filter(user=player).exists():
                raise Exception("Player already in a game")
        

class UnoGameService:
    def __init__(self, game:UnoGame):
        self.game = game
    
    def start_game(self, rules:UnoGameRules):
        rules.verify()

        self.game.direction = False
        self.game.game_over = False
        self.game.current_player_number = random.randint(0, len(rules.players) - 1)
        random.shuffle(rules.starting_deck)
        
        # distribute cards then assign player number and save
        distributed = 0
        for user in rules.players:
            player = UnoPlayer.objects.create(user=user, player_number=rules.players.index(user))
            player.hand.set(rules.starting_deck[distributed:distributed + rules.starting_cards_count])
            distributed += rules.starting_cards_count
            player.save()
            self.game.players.add(player)

        self.game.current_card = rules.starting_deck[distributed]
        self.game.pile.set(rules.starting_deck[distributed + 1:])
        
        self.game.save()

    
    def finish_turn(self):
        if self.game.current_player.hand.count() == 0:
            self.game.game_over = True
            self.game.save()
            return
        if self.game.direction:
            self.game.current_player_number = (self.game.current_player_number + 1) % len(self.game.players)
        else:
            self.game.current_player_number = (self.game.current_player_number - 1) % len(self.game.players)
        self.game.save()
        
    def can_place(self, player:UnoPlayer, card:UnoCard):
        """default can_place implementation. Can be replaced for custom rules"""
        if player.player_number != self.game.current_player_number:
            raise Exception("It's not your turn")
        if card not in player.hand.all():
            raise Exception("You don't have this card")
        if card.color != self.game.current_card.color and card.color != "wild":
            if card.action != self.game.current_card.action:
                raise Exception("You can't place this card")
        return True

    def play_card(self, player:UnoPlayer, card:UnoCard):
        """play a card and finish the turn"""
        self.can_place(self.game, card, player)

        self.game.pile.add(self.game.current_card)
        self.game.current_card = card
        player.hand.remove(card)
        player.save()
    
        self.finish_turn()

    def play_draw(self, player:UnoPlayer):
        """draw a card and finish the turn"""
        if player.player_number != self.game.current_player_number:
            raise Exception("It's not your turn")
        self.draw_one(player)
        
        self.finish_turn()
    
    def draw_one(self, player:UnoPlayer):
        """draw one card from the pile if possible"""
        if self.game.pile.count != 0:
            card = random.choice(self.game.pile.all())
            self.game.pile.remove(card)
            player.hand.add(card)
            player.said_uno = False
            player.save()
    
    def change_direction(self):
        self.game.direction = not self.game.direction
        self.game.save()
    
    def say_uno(self, player:UnoPlayer):
        """announce that you have one card left
        can be done only if you have one card, or two cards during your turn"""
        card_count = player.hand.count()
        if card_count == 1 or (card_count == 2 and self.game.current_player_number == player.player_number):
            player.said_uno = True
            player.save()
        else:
            raise Exception("You can't say uno")

    def deny_uno(self, target_player:UnoPlayer):
        """has only one card and didn't say uno, draw two cards"""
        if target_player.hand.count() == 1 and not target_player.said_uno:
            self.draw_one(target_player)
            self.draw_one(target_player)
            self.finish_turn()
            target_player.save()
        else:
            raise Exception("You can't deny uno")
    
    def to_dict(self, request=None) -> dict:
        return self.game.to_dict()
