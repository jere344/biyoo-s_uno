import time
import threading
from django.utils import timezone
from functools import wraps
from typing import Optional

class Scheduler:
    def __init__(self):
        self.tasks = {}
        self.running = False
        self.thread = None
    
    def register_task(self, interval: int, name: Optional[str] = None):
        """Register a task to run at a specific interval (in seconds)."""
        def decorator(func):
            task_name = name or func.__name__
            self.tasks[task_name] = {
                'function': func,
                'interval': interval,
                'last_run': time.time()
            }
            return func
        return decorator
    
    def _run_tasks(self):
        """Internal method to run tasks at their scheduled intervals."""
        while self.running:
            current_time = time.time()
            for task_name, task_info in self.tasks.items():
                # Check if it's time to run this task
                if current_time - task_info['last_run'] >= task_info['interval']:
                    try:
                        task_info['function']()
                        task_info['last_run'] = current_time
                    except Exception as e:
                        print(f"Error running task {task_name}: {str(e)}")
            
            # Sleep briefly to avoid high CPU usage. 
            # Because of this, minimum interval is 1 second.
            time.sleep(1)
    
    def start(self):
        """Start the scheduler."""
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._run_tasks)
            self.thread.daemon = True
            self.thread.start()
    
    def stop(self):
        """Stop the scheduler."""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
            self.thread = None

# Create a global scheduler instance
scheduler = Scheduler()

# Example task using the scheduler
# @scheduler.register_task(interval=60)  # Run every 60 seconds
# def give_card_currency_to_online_users():
#     from auth_app.models import CustomUser as User
    
#     online_users = User.objects.filter(is_online=True)
#     for user in online_users:
#         try:
#             user.cards_currency += 2
#             user.save()
#         except Exception as e:
#             print(f"Error giving currency to user {user.username}: {str(e)}")

def start_scheduler():
    scheduler.start()