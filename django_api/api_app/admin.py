from django.contrib import admin

from .models import UnoCard, Room

admin.site.register(UnoCard)

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

