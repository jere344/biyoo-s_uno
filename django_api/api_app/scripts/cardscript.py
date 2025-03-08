
def run():
    class UnoCard():
        def __init__(self, color:str, action:str, image:str):
            self.color = color
            self.action = action
            self.image = image
        
        def __str__(self):
            return f"{self.color} {self.action} {self.image}"
        

    all_cards:list[UnoCard] = []
    actions = ["+2", "+4", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse"]
    colors = ["yellow", "blue", "green", "red"]
    # for each image in /media/base/cards sorted alphabetically
    all_images = []
    import pathlib

    # path = 'django_api/api_app/media/temp'

    path = pathlib.Path("C:\\Users\\Jeremy\\Desktop\\biyoo_uno\\django_api\\media\\base_cards")
    all_files = path.iterdir()
    all_files = sorted(all_files, key=lambda x: int(x.name.split('.')[0]))
    for file in all_files:
        all_images.append('base_cards/' + file.name)

    for color in colors:
        for action in actions:
            all_cards.append(UnoCard(color, action, all_images.pop(0)))
        
    all_cards.append(UnoCard("wild", "+4", all_images.pop(0)))
    all_cards.append(UnoCard("wild", "color", all_images.pop(0)))

    for card in all_cards:
        print(card)
    
    # now we add the cards to the database
    from api_app.models import UnoCard as UnoCardModel
    for card in all_cards:
        if UnoCardModel.objects.filter(color=card.color, action=card.action, image=card.image).exists():
            UnoCardModel.objects.filter(color=card.color, action=card.action, image=card.image).delete()
        UnoCardModel.objects.create(color=card.color, action=card.action, image=card.image)