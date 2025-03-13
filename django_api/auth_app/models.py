from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models



class CustomUser(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    room = models.ForeignKey("api_app.Room", on_delete=models.SET_NULL, null=True, blank=True, related_name="users")
    pass



class CustomUserManager(BaseUserManager):
    pass