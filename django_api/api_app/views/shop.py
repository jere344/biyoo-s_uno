from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from api_app.models.shop import (
    CardBackInventory,
    ProfileEffect,
    ProfileEffectInventory,
    GameEnvironment,
    GameEnvironmentInventory,
)
from api_app.models.uno import CardBack


class CardBackListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        card_backs = CardBack.objects.all()
        return Response(
            [card_back.to_dict() for card_back in card_backs], status=status.HTTP_200_OK
        )


class PurchaseCardBackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, card_back_id):
        card_back = get_object_or_404(CardBack, id=card_back_id)

        if request.user.cards_currency < card_back.price:
            return Response(
                {"error": "Not enough currency"}, status=status.HTTP_400_BAD_REQUEST
            )

        # if the user already has the card back, don't let him buy it again
        if CardBackInventory.objects.filter(
            user=request.user, card_back=card_back
        ).exists():
            return Response(
                {"error": "Card back already purchased"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.cards_currency -= card_back.price
        request.user.save()

        inventory_item = CardBackInventory.objects.create(
            user=request.user, card_back=card_back, is_active=False
        )
        return Response(
            {"success": "Card back purchased", "id": inventory_item.id},
            status=status.HTTP_201_CREATED,
        )


class CardBackInventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        inventory = CardBackInventory.objects.filter(user=request.user)
        return Response(
            [item.to_dict() for item in inventory], status=status.HTTP_200_OK
        )

    def post(self, request, inventory_id):
        inventory_item = get_object_or_404(
            CardBackInventory, id=inventory_id, user=request.user
        )
        CardBackInventory.objects.filter(user=request.user).update(is_active=False)
        inventory_item.is_active = True
        inventory_item.save()
        return Response({"success": "Card back activated"}, status=status.HTTP_200_OK)


class ProfileEffectListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile_effects = ProfileEffect.objects.all()
        return Response(
            [effect.to_dict() for effect in profile_effects], status=status.HTTP_200_OK
        )


class PurchaseProfileEffectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_effect_id):
        profile_effect = get_object_or_404(ProfileEffect, id=profile_effect_id)

        if request.user.cards_currency < profile_effect.price:
            return Response(
                {"error": "Not enough currency"}, status=status.HTTP_400_BAD_REQUEST
            )

        # if the user already has the profile effect, don't let them buy it again
        if ProfileEffectInventory.objects.filter(
            user=request.user, profile_effect=profile_effect
        ).exists():
            return Response(
                {"error": "Profile effect already purchased"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.cards_currency -= profile_effect.price
        request.user.save()

        ProfileEffectInventory.objects.create(
            user=request.user, profile_effect=profile_effect, is_active=False
        )
        return Response(
            {"success": "Profile effect purchased"}, status=status.HTTP_201_CREATED
        )


class ProfileEffectInventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        inventory = ProfileEffectInventory.objects.filter(user=request.user)
        return Response(
            [item.to_dict() for item in inventory], status=status.HTTP_200_OK
        )

    def post(self, request, inventory_id):
        inventory_item = get_object_or_404(
            ProfileEffectInventory, id=inventory_id, user=request.user
        )
        ProfileEffectInventory.objects.filter(user=request.user).update(is_active=False)
        inventory_item.is_active = True
        inventory_item.save()
        return Response(
            {"success": "Profile effect activated"}, status=status.HTTP_200_OK
        )


class GameEnvironmentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        game_environments = GameEnvironment.objects.all()
        return Response(
            [env.to_dict() for env in game_environments], status=status.HTTP_200_OK
        )


class PurchaseGameEnvironmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, game_environment_id):
        game_environment = get_object_or_404(GameEnvironment, id=game_environment_id)

        if request.user.cards_currency < game_environment.price:
            return Response(
                {"error": "Not enough currency"}, status=status.HTTP_400_BAD_REQUEST
            )

        # if the user already has the game environment, don't let them buy it again
        if GameEnvironmentInventory.objects.filter(
            user=request.user, game_environment=game_environment
        ).exists():
            return Response(
                {"error": "Game environment already purchased"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.cards_currency -= game_environment.price
        request.user.save()

        GameEnvironmentInventory.objects.create(
            user=request.user, game_environment=game_environment, is_active=False
        )
        return Response(
            {"success": "Game environment purchased"}, status=status.HTTP_201_CREATED
        )


class GameEnvironmentInventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        inventory = GameEnvironmentInventory.objects.filter(user=request.user)
        return Response(
            [item.to_dict() for item in inventory], status=status.HTTP_200_OK
        )

    def post(self, request, inventory_id):
        inventory_item = get_object_or_404(
            GameEnvironmentInventory, id=inventory_id, user=request.user
        )
        GameEnvironmentInventory.objects.filter(user=request.user).update(
            is_active=False
        )
        inventory_item.is_active = True
        inventory_item.save()
        return Response(
            {"success": "Game environment activated"}, status=status.HTTP_200_OK
        )
