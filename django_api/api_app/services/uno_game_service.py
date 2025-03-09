from api_app.models.uno import UnoGame, UnoPlayer, UnoCard   

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
        self.game.pile.set(rules.starting_deck[distributed + 1:])
        self.game.save()
    
    def _set_to_next_turn(self):
        if self.game.direction:
            self.game.current_player_number = (self.game.current_player_number + 1) % self.game.players.count()
        else:
            self.game.current_player_number = (self.game.current_player_number - 1) % self.game.players.count()
        
    def finish_turn(self):
        if self.game.current_player.hand.count() == 0:
            self.game.game_over = True
            self.game.winner = self.game.current_player
            self.game.save()
            return
        self._set_to_next_turn()
        self.game.save()
    
    def get_player(self, user):
        return UnoPlayer.objects.get(user=user, game=self.game)
        
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
    
    def current_player_can_place(self, card:dict):
        """Used by the composer. todo: make sense of this"""
        if card["id"] not in [card.id for card in self.game.current_player.hand.all()]:
            return False
        if card["color"] != self.game.current_card.color and card["color"] != "wild":
            if card["action"] != self.game.current_card.action:
                return False
        if self.game.stored_to_draw != 0:
            if card["action"] not in ["+2", "+4", "skip"]:
                return False
            if card["action"] == "+2" and self.game.current_card.action != "+2":
                return False
            if card["action"] == "+4" and self.game.current_card.action != "+4":
                return False
        return True

    def play_card(self, user, card:UnoCard):
        """play a card and finish the turn"""
        player = self.get_player(user)
        self.can_place(player, card)

        self.game.pile.add(self.game.current_card)
        self.game.current_card = card
        player.hand.remove(card)
        player.save()

        if card.action == "reverse":
            self.game.direction = not self.game.direction
        elif card.action == "+2":
            self.game.stored_to_draw += 2
        elif card.action == "+4":
            self.game.stored_to_draw += 4
        elif card.action == "skip":
            # if put on a +2, it cancel the draw. Else it skips the next player
            if self.game.stored_to_draw == 0:
                self.game.stored_to_draw = 0
            else :
                self._set_to_next_turn()
    
        self.finish_turn()

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
        if card_count == 1 or (card_count == 2 and self.game.current_player_number == player.player_number):
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
