from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from api_app.models.shop import CardBackInventory
from api_app.models.uno import CardBack

class CardBackListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        card_backs = CardBack.objects.all()
        return Response([card_back.to_dict() for card_back in card_backs], status=status.HTTP_200_OK)

class PurchaseCardBackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, card_back_id):
        print("PurchaseCardBackView")
        card_back = get_object_or_404(CardBack, id=card_back_id)

        if request.user.cards_currency < card_back.price:
            return Response({"error": "Not enough currency"}, status=status.HTTP_400_BAD_REQUEST)

        # if the user already has the card back, don't let him buy it again
        if CardBackInventory.objects.filter(user=request.user, card_back=card_back).exists():
            return Response({"error": "Card back already purchased"}, status=status.HTTP_400_BAD_REQUEST)

        request.user.cards_currency -= card_back.price
        request.user.save()

        CardBackInventory.objects.create(user=request.user, card_back=card_back, is_active=False)
        return Response({"success": "Card back purchased"}, status=status.HTTP_201_CREATED)

class CardBackInventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        inventory = CardBackInventory.objects.filter(user=request.user)
        return Response([item.to_dict() for item in inventory], status=status.HTTP_200_OK)

    def post(self, request, inventory_id):
        inventory_item = get_object_or_404(CardBackInventory, id=inventory_id, user=request.user)
        CardBackInventory.objects.filter(user=request.user).update(is_active=False)
        inventory_item.is_active = True
        inventory_item.save()
        return Response({"success": "Card back activated"}, status=status.HTTP_200_OK)
