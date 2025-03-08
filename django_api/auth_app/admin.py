from django.contrib import admin


# register the added profile_picture field

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# Unregister the default UserAdmin
admin.site.unregister(User)

# Create a new UserAdmin with profile_picture
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('profile_picture',)}),
    )
    list_display = UserAdmin.list_display + ('profile_picture',)
