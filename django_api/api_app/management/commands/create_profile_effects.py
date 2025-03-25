import re
from django.core.management.base import BaseCommand
from api_app.models.shop import ProfileEffect

class Command(BaseCommand):
    help = 'Create ProfileEffect entries based on effects defined in React component'

    def handle(self, *args, **options):
        # Dictionary of effect descriptions and prices
        effect_data = {
            # Visual effects
            'fire': {'description': 'Adds a fire effect around your avatar', 'price': 50},
            'rainbow': {'description': 'Surrounds your avatar with a rainbow border', 'price': 50},
            'pulse': {'description': 'Makes your avatar pulse with animation', 'price': 40},
            'rotate': {'description': 'Rotates your avatar continuously', 'price': 30},
            'glow': {'description': 'Adds a glowing effect to your avatar', 'price': 35},
            'particles': {'description': 'Displays particle effects around your avatar', 'price': 60},
            'shadow': {'description': 'Adds a shadow effect to your avatar', 'price': 25},
            'bounce': {'description': 'Makes your avatar bounce', 'price': 30},
            'ripple': {'description': 'Creates a ripple effect around your avatar', 'price': 45},
            
            # Country flags
            'belgium': {'description': 'Adds Belgian flag border to your avatar', 'price': 20},
            'china': {'description': 'Adds Chinese flag border to your avatar', 'price': 20},
            'india': {'description': 'Adds Indian flag border to your avatar', 'price': 20},
            'usa': {'description': 'Adds USA flag border to your avatar', 'price': 20},
            'indonesia': {'description': 'Adds Indonesian flag border to your avatar', 'price': 20},
            'pakistan': {'description': 'Adds Pakistani flag border to your avatar', 'price': 20},
            'brazil': {'description': 'Adds Brazilian flag border to your avatar', 'price': 20},
            'nigeria': {'description': 'Adds Nigerian flag border to your avatar', 'price': 20},
            'bangladesh': {'description': 'Adds Bangladeshi flag border to your avatar', 'price': 20},
            'russia': {'description': 'Adds Russian flag border to your avatar', 'price': 20},
            'japan': {'description': 'Adds Japanese flag border to your avatar', 'price': 20},
            
            # Pride flags
            'pride': {'description': 'Adds Pride flag border to your avatar', 'price': 20},
            'transgender': {'description': 'Adds Transgender flag border to your avatar', 'price': 20},
            'bisexual': {'description': 'Adds Bisexual flag border to your avatar', 'price': 20},
            'lesbian': {'description': 'Adds Lesbian flag border to your avatar', 'price': 20},
            'nonbinary': {'description': 'Adds Non-binary flag border to your avatar', 'price': 20},
            'pansexual': {'description': 'Adds Pansexual flag border to your avatar', 'price': 20},
            'asexual': {'description': 'Adds Asexual flag border to your avatar', 'price': 20},
        }
        
        
        created_count = 0
        skipped_count = 0
        
        for effect_name, data in effect_data.items():
                
            # Check if this effect already exists
            if ProfileEffect.objects.filter(name=effect_name).exists():
                self.stdout.write(f"Effect already exists: {effect_name}")
                skipped_count += 1
                continue
            
            # Create the effect
            effect = ProfileEffect.objects.create(
                name=effect_name,
                description=data['description'],
                price=data['price']
            )
            
            self.stdout.write(f"Created effect: {effect_name}")
            created_count += 1
        
        self.stdout.write(self.style.SUCCESS(
            f"Successfully created {created_count} profile effects. Skipped {skipped_count} effects."
        ))
