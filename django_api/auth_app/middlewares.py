from django.utils.timezone import now
from auth_app.models import CustomUser as User


class LastActivityTraceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        user: User  = request.user
        if user.is_authenticated:
            user.last_activity = now()
            user.save()
        return response