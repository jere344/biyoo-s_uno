from django.urls import include, path
from rest_framework import routers

from auth_app import views
from django.conf import settings
from django.conf.urls.static import static


# Seulement pour modifier le nom du router (Api Root --> Api Auth)
class AuthRootView(routers.APIRootView):
  def get_view_name(self) -> str:
    return "Api Auth"


class AuthRouter(routers.DefaultRouter):
  APIRootView = AuthRootView


# Create a router and register our viewsets with it.
router = AuthRouter()

# Appeler en POST
router.register(r'token', views.TokenViewSet, basename='token')
router.register(r'token-refresh', views.TokenRefreshViewSet, basename='token-refresh')

urlpatterns = [
  path('', include(router.urls)),
  
  # Appeler en GET
  path('current-user/', views.CurrentUserView.as_view()),  

  # Appeler en PUT
  path('current-user/me/', views.CurrentUserView.as_view()),  
  path('current-user-password/me/', views.CurrentUserPasswordView.as_view()),

  # Appeler en POST 
  path('register/', views.RegisterView.as_view()),

  # Appeler en DELETE
  path('current-user/me/', views.CurrentUserView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
