from django.apps import AppConfig


class ApiAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_app'
    
    def ready(self):
        # Import and start the scheduler when Django is fully loaded
        # Avoid running scheduler in some management commands like migrations
        import sys
        if not any(arg in sys.argv for arg in ['makemigrations', 'migrate', 'collectstatic']):
            from api_app.scheduler import start_scheduler
            start_scheduler()
