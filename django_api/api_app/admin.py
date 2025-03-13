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

    
