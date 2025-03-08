from django.urls import include, path
from rest_framework.routers import DefaultRouter
from api_app import consumers


router = DefaultRouter()

from api_app.views import room, script


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
]

websocket_urlpatterns = [
  path("ws/rooms/<int:pk>/chat/", consumers.ChatConsumer.as_asgi())
]
