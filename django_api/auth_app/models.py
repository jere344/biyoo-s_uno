from django.contrib.auth.models import User
from django.db import models
from api_app.models import Room


User.add_to_class('profile_picture', models.ImageField(upload_to='profile_pictures/', null=True, blank=True))
User.add_to_class('room', models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name="users"))
