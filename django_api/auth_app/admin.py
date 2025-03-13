from django.contrib import admin


# Unregister the default UserAdmin
# admin.site.unregister(User)

# Create a new UserAdmin with profile_picture
# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     fieldsets = UserAdmin.fieldsets + (
#         ('Additional Info', {'fields': ('profile_picture',)}),
#     )
#     list_display = UserAdmin.list_display + ('profile_picture',)

from auth_app.models import CustomUser

admin.site.register(CustomUser)