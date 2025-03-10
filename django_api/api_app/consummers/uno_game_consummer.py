import datetime
import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from api_app.models import Room
from api_app.services import uno_game_service
from api_app.models.uno import UnoGame, UnoCard


class UnoGameConsummer(JsonWebsocketConsumer):
    # Class variable to track connected users per room
    connected_users = {}
    
    def connect(self):
        self.accept()
        self.room_id = self.scope["url_route"]["kwargs"]["pk"]
        self.room_group_name = f"uno_game_{self.room_id}"

        query_string = parse_qs(self.scope["query_string"].decode())
        token = query_string.get("token", [None])[0]

        if token:
            try:
                # Validate token and get user
                access_token = AccessToken(token)
                user_id = access_token["user_id"]
                User = get_user_model()
                self.user = User.objects.get(id=user_id)
                if self.user.room_id != self.room_id:
                    raise Exception(f"User tried to connect to a room he is not in")
                self.scope["user"] = self.user
                self.room = Room.objects.get(id=self.room_id)
            except Exception as e:
                self.send_json({
                    "type": "error",
                    "error": str(e)
                })
                self.close()
                return
        else:
            self.close()
            return

        if not self.user.is_authenticated:
            self.close()
            return

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        
        # Track connected user
        if self.room_id not in self.connected_users:
            self.connected_users[self.room_id] = set()
        self.connected_users[self.room_id].add(self.user.id)
        
        # if the game has started, send the game state
        # if the game has not started, send the player count
        try:
            game_service = self.get_game_service()
            if game_service :
                self._send_game_state()
            else :
                self._send_player_count()
        except ValueError:
            self._send_player_count()
    
    def _send_player_count(self):
        """Send the current WebSocket player count to all users in the room"""
        player_count = len(self.connected_users.get(self.room_id, set()))
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "websocket_player_count",
                "count": player_count
            }
        )
    
    def _send_game_state(self):
        """Send the current WebSocket game state to all users in the room"""
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "websocket_game_state",
            }
        )
    
    def websocket_player_count(self, event):
        """Handle player count event and send to client"""
        self.send_json({
            "type": "player_count",
            "count": event["count"]
        })
    
    def websocket_game_state(self, event):
        """ Send the game state to the user
        other players' hands and the pile are hidden
        """
        try :
            game_service = self.get_game_service()
        except ValueError:
            self.send_json({
                "type": "game_state",
                "game": None
            })
            return

        game_dict = game_service.game.to_dict()
        for player in game_dict["players"]:
            if player["user"]["username"] != self.user.username:
                player["hand"] = len(player["hand"])
            else: # if it's the current player, show which card he can play
                for card in player["hand"]:
                    card["can_play"] = game_service.can_place(game_service.get_player(self.user), card)
        game_dict["pile"] = len(game_dict["pile"])
        
        self.send_json({
            "type": "game_state",
            "game": game_dict
        })
    
    def get_game_service(self):
        try:
            # Always get a fresh instance from the database
            game = UnoGame.objects.get(room=self.room)
            return uno_game_service.UnoGameService(game)
        except UnoGame.DoesNotExist:
            raise ValueError("No game has been started yet")

    def disconnect(self, close_code):
        # Remove user from connected users set before disconnecting
        if hasattr(self, 'room_id') and hasattr(self, 'user'):
            if self.room_id in self.connected_users and self.user.id in self.connected_users[self.room_id]:
                self.connected_users[self.room_id].remove(self.user.id)
                # Send updated player count
                self._send_player_count()
                
                # Clean up empty rooms
                if not self.connected_users[self.room_id]:
                    del self.connected_users[self.room_id]
                
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive_json(self, content):
        if content["type"] == "start_game":
            self.start_game(content)
        elif content["type"] == "play_card":
            self.play_card(content)
        elif content["type"] == "draw_card":
            self.draw_card(content)
        elif content["type"] == "restart_game":
            self.restart_game(content)
        elif content["type"] == "stop_game":
            self.stop_game(content)
        else:
            self.send_json(
                {
                    "type": "error",
                    "error": "Invalid message type"
                }
            )
    
    def stop_game(self, content):
        self.room = self.room
        game = UnoGame.objects.get(room=self.room)
        game.delete()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "websocket_game_state",
                "game": None
            }
        )

        
    def restart_game(self, content):
        self.room = self.room
        game = UnoGame.objects.get(room=self.room)
        if game.game_over:
            game.delete()
            self.start_game(content)

    def start_game(self, content):
        self.room = self.room
        if UnoGame.objects.filter(room=self.room).exists():
            self.send_json(
                {
                    "type": "error",	
                    "error": "Game has already been started"
                }
            )
            return

        game = UnoGame(room=self.room)
        game_service = uno_game_service.UnoGameService(game)

        game_rules = uno_game_service.UnoGameRules()
        game_rules.players = [get_user_model().objects.get(id=user_id) for user_id in self.connected_users[self.room_id]]
        game_rules.select_base_deck()

        game_service.start_game(game_rules)
        
        self._send_game_state()
    
    def play_card(self, content):
        card = UnoCard.objects.get(id=content["card_id"])
        color = content.get("color", None)
        game_service = self.get_game_service()
        game_service.play_card(self.user, card, color)
        
        self._send_game_state()

    def draw_card(self, content):
        game_service = self.get_game_service()
        game_service.draw_card(self.user)
        
        self._send_game_state()




