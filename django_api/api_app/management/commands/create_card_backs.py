from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from api_app.models.uno import CardBack
import requests
from io import BytesIO
from PIL import Image  # Add Pillow import

class Command(BaseCommand):
    help = 'Create CardBack entries with default card back designs'

    def handle(self, *args, **options):
        # Dictionary of card back data (name, description, price, image URL)
        card_back_data = {
            'default': {
                'description': 'Default UNO card back design',
                'price': 0,
                'image_url': 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/fed3bb24-454f-4bdf-a721-6aa8f23e7cef/d9gnihf-ec16caeb-ec9c-4870-9480-57c7711d844f.png'
            },
            'blue': {
                'description': 'EU got ya',
                'price': 25,
                'image_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkygrBUntjV0ENgvwddwbghXmBstag82twaQ&s'
            },
            'red': {
                'description': 'REDcard',
                'price': 25,
                'image_url': 'https://miro.medium.com/v2/resize:fit:1049/1*XNaLeiUvczkz2cUBLzcsfw.png'
            },
            'yellow': {
                'description': 'Yellow card',
                'price': 25,
                'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Yellow_card.svg/1575px-Yellow_card.svg.png'
            },
            'gold': {
                'description': "Earthstone' golden card",
                'price': 100,
                'image_url': 'https://media-hearth.cursecdn.com/attachments/39/684/cardback_20.png'
            },
            'goldenpokemon': {
                'description': 'Golden Pokemon card',
                'price': 100,
                'image_url': 'https://efour.b-cdn.net/uploads/default/optimized/3X/4/c/4caffde1518947206d57c91e61f0a7573980c5ef_2_343x485.jpeg'
            },
            'pokemon': {
                'description': 'Pokemon card back design',
                'price': 50,
                'image_url': 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fill/w_759,h_1053/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQyMCIsInBhdGgiOiJcL2ZcLzRmNzcwNWVjLThjNDktNGVlZC1hNTZlLWMyMWYzOTg1MjU0Y1wvZGFoNDNjeS1hOGUxMjFjYi05MzRhLTQwZjYtOTdjNy1mYTJkNzcxMzBkZDUucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9GzaYS7sd8RPY5FlHca09J9ZQZ9D9zI69Ru-BsbkLDA'
            },
            'red playing card': {
                'description': 'Random red card back design',
                'price': 25,
                'image_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNHlCAhNnlQ4pCIluYMG_9EPMnBMPrVovkg&s'
            },
            'blue playing card': {
                'description': 'Random blue card back design',
                'price': 25,
                'image_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL_ctJcBkiwVBroK0c6v26NeuJQba0TnjPmQ&s'
            },
            'black playing card': {
                'description': 'Random black card back design',
                'price': 25,
                'image_url': 'https://opengameart.org/sites/default/files/card%20back%20black.png'
            },
            'earthstone': {
                'description': "Earthstone card back design",
                'price': 50,
                'image_url': 'https://static.wikia.nocookie.net/hearthstone/images/c/c4/Card_back-Default.png/revision/latest?cb=20140823204025'
            },
            'Mushu Report': {
                'description': 'Lorcana card back design',
                'price': 50,
                'image_url': 'https://wiki.mushureport.com/images/d/d7/Card_Back_official.png'
            },
            'yu-gi-oh': {
                'description': 'Yu-Gi-Oh card back design',
                'price': 50,
                'image_url': 'https://ms.yugipedia.com//thumb/4/4a/Back-AE.png/257px-Back-AE.png'
            },
            'magic': {
                'description': 'Magic the Gathering card back design',
                'price': 50,
                'image_url': 'https://m.media-amazon.com/images/I/61AGZ37D7eL._AC_UF1000,1000_QL80_.jpg'
            },
            'BoxHead2199': {
                'description': 'Cool card back design by BoxHead2199 on reddit',
                'price': 50,
                'image_url': 'https://preview.redd.it/look-for-opinions-on-my-2-playing-card-back-designs-look-to-v0-r4rle6ipe3fc1.png?width=816&format=png&auto=webp&s=e5a6eca1e034c45a1221c80a23fe16dbbe6c45db'
            },
            'Kusanagi Nene': {
                'description': 'The queen',
                'price': 50,
                'image_url': 'https://static.wikia.nocookie.net/projectsekai/images/f/fd/Who_We_Want_To_Be_T.png/revision/latest/scale-to-width-down/1000?cb=20240308052246'
            },
            'Akito': {
                'description': 'The king',
                'price': 50,
                'image_url': 'https://static.wikia.nocookie.net/projectsekai/images/5/57/Reaching_For_Great_Heights_T.png/revision/latest/scale-to-width-down/1000?cb=20240308052115'
            },
            'Otori Emu': {
                'description': 'WonDeRHoYYY',
                'price': 50,
                'image_url': 'https://static.wikia.nocookie.net/projectsekai/images/7/7e/Let%27s_Think_Together_T.png/revision/latest/scale-to-width-down/1000?cb=20240308052158'
            },
            'Kamishiro Rui': {
                'description': 'The queen²',
                'price': 50,
                'image_url': 'https://static.wikia.nocookie.net/projectsekai/images/0/00/A_Greeting_In_Return_T.png/revision/latest/scale-to-width-down/1000?cb=20240308052337'
            },
            'inscryption': {
                'description': 'Inscryption card back design',
                'price': 50,
                'image_url': 'https://cards.vladde.me/cards/backs/common.png'
            },
            'inscryption death': {
                'description': 'Inscryption death card back design',
                'price': 50,
                'image_url': 'https://preview.redd.it/quick-question-about-death-cards-v0-vi64m94mpt3b1.jpg?width=640&crop=smart&auto=webp&s=74fa797804b3e044d83f3f6f4d93a9fede9b8c3a'
            },
            'inscryption stoat': {
                'description': 'Inscryption stoat card back design',
                'price': 50,
                'image_url': 'https://static.wikia.nocookie.net/inscryption/images/6/62/Stoat_talking.png/revision/latest?cb=20221024235118'
            },
                
        }
        
        created_count = 0
        skipped_count = 0
        
        for card_back_name, data in card_back_data.items():
            # Check if this card back already exists
            if CardBack.objects.filter(name=card_back_name).exists():
                self.stdout.write(f"Card back already exists: {card_back_name}")
                skipped_count += 1
                continue
            
            # Create a new CardBack instance
            card_back = CardBack(
                name=card_back_name,
                price=data['price']
            )
            
            # Download image from URL
            try:
                response = requests.get(data['image_url'])
                response.raise_for_status()  # Raise an exception for HTTP errors
                
                # Process the image - check dimensions and rotate if needed
                image_content = BytesIO(response.content)
                img = Image.open(image_content)
                
                # Check if width > height and rotate if necessary
                if img.width > img.height:
                    self.stdout.write(f"Rotating image for {card_back_name} (width: {img.width}, height: {img.height})")
                    img = img.transpose(Image.ROTATE_90)  # Rotate 90 degrees
                    
                    # Save the modified image to a BytesIO object
                    output = BytesIO()
                    img.save(output, format=img.format or 'PNG')
                    output.seek(0)
                    image_content = output.getvalue()
                else:
                    # Use original content if no rotation needed
                    image_content = response.content
                
                # Get the filename from the URL
                image_name = f"{card_back_name}.png"
                
                # Save the image to the model's ImageField
                card_back.image.save(
                    image_name,
                    ContentFile(image_content),
                    save=True
                )
                
                self.stdout.write(f"Created card back: {card_back_name} with image from {data['image_url']}")
                created_count += 1
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f"Failed to download image for {card_back_name}: {str(e)}"
                ))
        
        self.stdout.write(self.style.SUCCESS(
            f"Successfully created {created_count} card backs. Skipped {skipped_count} card backs."
        ))
