from auth_app.models import CustomUser as User
from django.contrib.auth.models import update_last_login
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
import os

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username", "profile_picture"]

    def update(self, instance, validated_data):
        if 'profile_picture' in validated_data:
            try:
                old_file = instance.profile_picture.path
                if old_file:
                    os.remove(old_file)
            except Exception as e:
                pass
        return super().update(instance, validated_data)


class UserPasswordSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['password']

    def update(self, user, validated_data):
        user.set_password(validated_data.get('password', user.password))
        user.save()
        return user


class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username", "password", "profile_picture"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class TokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['user'] = UserSerializer(self.user, context={'request': self.context['request']}).data

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
