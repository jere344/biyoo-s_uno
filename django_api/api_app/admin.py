from django.contrib import admin

from .models import UnoCard, Room

#list connected players in the room
class RoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'player_limit', 'is_open', 'get_users']
    list_filter = ['created_at', 'is_open']
    search_fields = ['name', 'users__username']
    readonly_fields = ['created_at']
    ordering = ['name']

    def get_users(self, obj):
        return ", ".join([user.username for user in obj.users.all()])
    get_users.short_description = 'Users'

admin.site.register(Room, RoomAdmin)


class UnoCardAdmin(admin.ModelAdmin):
    list_display = ['color', 'action', 'is_special', 'image_tag']
    list_filter = ['color', 'action', 'is_special']
    search_fields = ['color', 'action']
    readonly_fields = ['image']

    def image_tag(self, obj):
        from django.utils.html import mark_safe
        return mark_safe(f'<img src="{obj.image.url}" width="60" height="100" />')



admin.site.register(UnoCard, UnoCardAdmin)

    
from .models.shop import CardBack, CardBackInventory

class CardBackAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'image_tag']
    readonly_fields = ['image_tag']
    search_fields = ['name']
    ordering = ['name']
    fields = ['name', 'price', 'image', 'image_tag']  # Include image field

    def image_tag(self, obj):
        from django.utils.html import mark_safe
        return mark_safe(f'<img src="/media/{obj.image.name}" width="70" height="100" />')
    
admin.site.register(CardBack, CardBackAdmin)

class CardBackInventoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'card_back', 'is_active']

admin.site.register(CardBackInventory, CardBackInventoryAdmin)

from .models.shop import GameEnvironment, GameEnvironmentInventory

class GameEnvironmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'image_tag']
    readonly_fields = ['image_tag']
    search_fields = ['name']
    ordering = ['name']
    fields = ['name', 'price', 'image', 'image_tag']  # Include image field

    def image_tag(self, obj):
        from django.utils.html import mark_safe
        return mark_safe(f'<img src="/media/{obj.image.name}" width="120" height="70" />')

admin.site.register(GameEnvironment, GameEnvironmentAdmin)

class GameEnvironmentInventoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'game_environment', 'is_active']

admin.site.register(GameEnvironmentInventory, GameEnvironmentInventoryAdmin)

from .models.shop import ProfileEffect, ProfileEffectInventory

    
class ProfileEffectAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'description']
    search_fields = ['name']
    ordering = ['name']
    fields = ['name', 'price', 'description']

admin.site.register(ProfileEffect, ProfileEffectAdmin)

class ProfileEffectInventoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'profile_effect', 'is_active']

admin.site.register(ProfileEffectInventory, ProfileEffectInventoryAdmin)