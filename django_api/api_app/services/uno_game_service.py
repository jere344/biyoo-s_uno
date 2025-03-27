from functools import lru_cache
from api_app.models.uno import CardBack, UnoGame, UnoPlayer, UnoCard   

import random



# all the settings that can be changed for a game
class UnoGameRules:
    def __init__(self):
        self.starting_cards_count = 7
        self.starting_deck = []
        self.players = []
        self.card_back = "default"

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
    
    def select_base_deck(self):
        self.starting_deck = get_base_deck()

@lru_cache(maxsize=128)
def get_base_deck():
    deck = []

    for color in ["red", "green", "blue", "yellow"]:
        for _ in range(2):
            for number in range(1, 10):
                deck.append(UnoCard.objects.get(color=color, action=str(number), is_special=False))
            for action in ["reverse", "skip", "+2"]:
                deck.append(UnoCard.objects.get(color=color, action=action, is_special=False))
        deck.append(UnoCard.objects.get(color=color, action="0", is_special=False))
    
    for _ in range(4):
        deck.append(UnoCard.objects.get(color="black", action="wild_+4_reverse", is_special=False))
        deck.append(UnoCard.objects.get(color="black", action="wild", is_special=False))
    
    return deck

            
            

class UnoGameService:
    """
    Service to manage a game of Uno
    The service is stateless, it only contains methods to manage the game
    """
    def __init__(self, game:UnoGame):
        self.game = game
    
    def start_game(self, rules:UnoGameRules):
        rules.verify()

        self.game.direction = False
        self.game.game_over = False
        self.game.stored_to_draw = 0
        self.game.winner = None
        self.game.card_back = CardBack.objects.get(name=rules.card_back)
        self.game.save()
        
        random.shuffle(rules.starting_deck)
        
        # distribute cards then assign player number and save
        distributed = 0
        for user in rules.players:
            existing = UnoPlayer.objects.filter(user=user)
            if existing.exists():
                existing.delete()

            player = UnoPlayer.objects.create(user=user, player_number=rules.players.index(user), game=self.game)
            player.hand.set(rules.starting_deck[distributed:distributed + rules.starting_cards_count])
            distributed += rules.starting_cards_count
            player.save()

        self.game.current_player_number = random.randint(0, len(rules.players) - 1)
        self.game.current_card = rules.starting_deck[distributed]
        self.game.pile.set(rules.starting_deck[distributed:])
        self.game.save()
    
    def _set_to_next_turn(self):
        if self.game.direction:
            self.game.current_player_number = (self.game.current_player_number + 1) % self.game.players.count()
        else:
            self.game.current_player_number = (self.game.current_player_number - 1) % self.game.players.count()
        self.game.save()
        
    def finish_turn(self):
        winner = None
        for player in self.game.players.all():
            if player.hand.count() == 0:
                winner = player
                break

        if winner is not None:
            self.game.game_over = True
            self.game.winner = self.game.current_player
            self.game.save()
            for player in self.game.players.all():
                player.user.games_played += 1
                if player == self.game.winner:
                    player.user.games_won += 1
                player.user.save()
            return
        self._set_to_next_turn()
        self.game.save()
    
    def get_player(self, user):
        return UnoPlayer.objects.get(user=user, game=self.game)

    
    def can_place(self, player:UnoPlayer, card:dict):
        """check if a card can be placed on the current card. 
        Can be replaced in the future for different rules
        """
        if self.game.game_over:
            return False # game is over
        if self.game.current_player_number != player.player_number:
            return False # not your turn
        if card["id"] not in [card.id for card in player.hand.all()]:
            return False # you don't have this card
        
        if self.game.stored_to_draw != 0:
            if not any(x in card["action"] for x in ("+2", "+4", "skip")):
                return False
            if "skip" in card["action"]:
                return card["color"] == self.game.current_card.color
            # card have a ranking, +2 < +4 < black+4
            # you can only place a card superior or equal to the one on the pile
            rank = lambda a: 3 if ("+4" in a and "wild" in a) else (2 if "+4" in a else 1)
            if rank(card["action"]) < rank(self.game.current_card.action):
                return False
        
        if card["color"] != self.game.current_card.color and card["color"] != "black":
            if card["action"] != self.game.current_card.action:
                return False # card cannot be placed on the current card
            
        return True

    def play_card(self, user, card:UnoCard, color=None):
        """play a card and finish the turn"""
        
        player = self.get_player(user)
        if not self.can_place(player, card.to_dict()):
            print("trying to place", card.to_dict(), "on", self.game.current_card.to_dict())
            raise ValueError("You can't place this card")

        # alternative way of doing things :
            # a bit of a trick, we don't place the current card in the pile but a copy,
            # so at every point the current card is also in the can draw pile
            # this has 2 advantages: 
            #   - we never get stuck, because the current card can be "duplicated"
            #   - we can alter the current card without altering the pile
            # this has 2 drawbacks:
            #   - the pile will be bigger than it should
            #   - if there's only one card left in the pile, the game will never end, we can pick then place the same card on itself
            #       but this is a very unlikely scenario.
            # self.game.pile.add(card)
            # self.game.current_card = card

        # place the original version of the current card in the pile
        self.game.pile.add(
            UnoCard.objects.get(
                action=self.game.current_card.action, 
                color=self.game.current_card.color if "wild" not in self.game.current_card.action else "black",
                is_special=False
            )
        )
        self.game.current_card = card
        player.hand.remove(card)
        
        if "reverse" in card.action:
            self.game.direction = not self.game.direction
        if "+2" in card.action:
            self.game.stored_to_draw += 2
        if "+4" in card.action:
            self.game.stored_to_draw += 4
        if "skip" in card.action:
            # if put on a +2, it cancel the draw. Else it skips the next player
            if self.game.stored_to_draw == 0:
                self._set_to_next_turn()
            else :
                self.game.stored_to_draw = 0
        
        # if it's a black+4 or a basic black replace the card with a new one with the specified color
        if "wild" in card.action:
            if color is None:
                raise Exception("You must specify a color")
            self.game.current_card = UnoCard.objects.get(is_special=True, color=color, action=card.action)

        player.save()
        self.finish_turn()
        
        player.user.cards_currency += 1
        player.user.save()

    def draw_card(self, user):
        """draw a card and finish the turn"""
        player = self.get_player(user)
        if player.player_number != self.game.current_player_number:
            raise Exception("It's not your turn")
        if self.game.stored_to_draw != 0:
            for _ in range(self.game.stored_to_draw):
                self._draw_one(player)
            self.game.stored_to_draw = 0
        else :
            self._draw_one(player)
        
        self.finish_turn()
    
    def _draw_one(self, player:UnoPlayer):
        """draw one card from the pile if possible"""
        if self.game.pile.count() != 0:
            card = random.choice(self.game.pile.all())
            self.game.pile.remove(card)
            player.hand.add(card)
            player.said_uno = False
            player.save()
    
    def say_uno(self, user):
        """announce that you have one card left
        can be done only if you have one card, or two cards during your turn"""
        player = self.get_player(user)
        card_count = player.hand.count()
        if card_count == 1 or card_count == 2:
            player.said_uno = True
            player.save()
        else:
            raise Exception("You can't say uno")

    def deny_uno(self, target_user):
        """has only one card and didn't say uno, draw two cards"""
        target_player = self.get_player(target_user)
        if target_player.hand.count() == 1 and not target_player.said_uno:
            self._draw_one(target_player)
            self._draw_one(target_player)
            self.finish_turn()
            target_player.save()
        else:
            raise Exception("You can't deny uno")
    
    def to_dict(self, request=None) -> dict:
        return self.game.to_dict()
