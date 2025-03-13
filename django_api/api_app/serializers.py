from rest_framework.serializers import ModelSerializer, ImageField
from rest_framework.exceptions import ValidationError



from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework.serializers import ModelSerializer

class CommentUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_picture') 

from api_app.models import Comment

class CommentSerializer(ModelSerializer):
	user = CommentUserSerializer(read_only=True)

	
	class Meta:
		model = Comment
		fields = ('id', 'user', 'body', 'created_at', 'updated_at', 'rating')
		read_only_fields = ('id', 'user', 'created_at', 'updated_at')
  

	def create(self, validated_data):
		""" Ensure the comment is linked to the authenticated user """
		request = self.context.get('request')
		if request and request.user.is_authenticated:
			validated_data['user'] = request.user
		return super().create(validated_data)


from api_app.models import GamePlayed, GameState, GameStateCard

from rest_framework.serializers import ModelSerializer, ValidationError

class GameStateCardSerializer(ModelSerializer):
    class Meta:
        model = GameStateCard
        fields = ('id', 'emoji', 'matched')
    
    def create(self, validated_data):
        # The view/parent serializer should set game_state
        return GameStateCard.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        raise ValidationError("You're not supposed to update a GameStateCard instance. Delete it and create a new one instead.")


class GameStateSerializer(ModelSerializer):
    cards = GameStateCardSerializer(many=True)

    class Meta:
        model = GameState
        fields = ('id', 'cards')
    
    def create(self, validated_data):
        cards_data = validated_data.pop('cards')
        game_state = GameState.objects.create(**validated_data)
        for card_data in cards_data:
            # Assign the game_state to each card
            GameStateCard.objects.create(game_state=game_state, **card_data)
        return game_state

    def update(self, instance, validated_data):
        cards_data = validated_data.pop('cards')
        # Delete existing cards if needed (or update them as per your business logic)
        instance.cards.all().delete()
        for card_data in cards_data:
            GameStateCard.objects.create(game_state=instance, **card_data)
        return instance
    

from rest_framework.serializers import ModelSerializer

class GamePlayedSerializer(ModelSerializer):
    game_state = GameStateSerializer()  # Make it writable

    class Meta:
        model = GamePlayed
        fields = ('id', 'user', 'created_at', 'game_level', 'game_duration', 'game_tries', 'game_score', 'game_finished', 'game_state')
        read_only_fields = ('id', 'user', 'created_at')
    
    def create(self, validated_data):
        # Pop nested game_state data
        game_state_data = validated_data.pop('game_state')
        game_state = GameStateSerializer().create(game_state_data)
        validated_data['game_state'] = game_state
        
        # Link the game played to the authenticated user if available
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user

        return GamePlayed.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        game_state_data = validated_data.pop('game_state', None)
        if game_state_data:
            # Update the nested game_state using the serializer
            game_state_serializer = GameStateSerializer(instance=instance.game_state, data=game_state_data)
            game_state_serializer.is_valid(raise_exception=True)
            game_state_serializer.save()
        
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        
        return super().update(instance, validated_data)
