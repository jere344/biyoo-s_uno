from django.urls import include, path
from rest_framework.routers import DefaultRouter
from api_app.consummers import chat_consummer, uno_game_consummer, user_consummer  # added import for user consumer
from api_app.views import room, script, shop  # added import for shop views

router = DefaultRouter()

urlpatterns = [
  path('', include(router.urls)),
  
  # path('comments/', CommentViewSet.as_view({'get': 'list', 'post': 'create'})),
  # path('comments/<int:pk>/', CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
  
  # path('gameplayed/', views.GamePlayedViewSet.as_view({'get': 'list', 'post': 'create'})),
  # path('gameplayed/<int:pk>/', views.GamePlayedViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
  path("script/<str:script_name>/", script.ScriptViewSet.as_view()),
  path("rooms/", room.RoomViewSet.as_view({'get': 'list', 'post': 'create'})),
  path("rooms/<int:pk>/", room.RoomViewSet.as_view({'get': 'retrieve', 'put': 'update'})),
  path("rooms/<int:pk>/join/", room.RoomViewSet.as_view({'post': 'join'})),
  path("rooms/<int:pk>/leave/", room.RoomViewSet.as_view({'post': 'leave'})),

  path("rooms/<int:pk>/chat/", room.ChatViewSet.as_view({'get': 'list', 'post': 'create'})),
  path("rooms/<int:pk>/chat/<int:message_id>/", room.ChatViewSet.as_view({'delete': 'destroy'})),
  
  path("shop/card_backs/", shop.CardBackListView.as_view(), name="card_back_list"),
  path("shop/card_backs/purchase/<int:card_back_id>/", shop.PurchaseCardBackView.as_view(), name="purchase_card_back"),
  path("shop/inventory/", shop.CardBackInventoryView.as_view(), name="card_back_inventory"),
  path("shop/inventory/activate/<int:inventory_id>/", shop.CardBackInventoryView.as_view(), name="activate_card_back"),
]

websocket_urlpatterns = [
  path("ws/rooms/<int:pk>/chat/", chat_consummer.ChatConsumer.as_asgi()),
  path("ws/rooms/<int:pk>/uno/", uno_game_consummer.UnoGameConsummer.as_asgi()),
  path("ws/user/", user_consummer.UserConsumer.as_asgi())  # Add path for user updates
]
