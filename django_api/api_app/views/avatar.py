import os
import requests
import json
from django.http import FileResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from requests.exceptions import RequestException

class AvatarModelView(APIView):
    """
    View to fetch and return a 3D model for a player.
    """
    
    def get(self, request, player_name):
        # Create a folder to store the models if it doesn't exist
        models_folder = os.path.join(settings.MEDIA_ROOT, 'avatar_models')
        os.makedirs(models_folder, exist_ok=True)
        
        # Create a folder for this specific player if it doesn't exist
        player_folder = os.path.join(models_folder, player_name)
        
        # Check if we already have the model for this player
        model_info_path = os.path.join(player_folder, 'model_info.json')
        if os.path.exists(model_info_path):
            # Return the cached model info
            with open(model_info_path, 'r') as f:
                model_info = json.load(f)
            return Response(model_info)
        
        # If we don't have the model, create the player folder
        os.makedirs(player_folder, exist_ok=True)
        
        # Browser-like headers to prevent access denied
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        }
        
        try:
            # Step 1: Get user ID from player name using the correct API endpoint
            user_lookup_url = "https://users.roblox.com/v1/usernames/users"
            user_lookup_payload = {
                "usernames": [player_name],
                "excludeBannedUsers": True
            }
            user_lookup_headers = {
                **headers,
                'Content-Type': 'application/json'
            }
            
            user_info_response = requests.post(
                user_lookup_url, 
                headers=user_lookup_headers, 
                json=user_lookup_payload
            )
            user_data = user_info_response.json()
            
            if 'data' not in user_data or not user_data['data']:
                return Response({"error": f"Could not find user ID for player: {player_name}"}, 
                                status=status.HTTP_404_NOT_FOUND)
            
            user_id = user_data['data'][0]['id']
            
            # Step 2: Get avatar 3D model URL using user ID
            print(f"Getting 3D avatar for user ID: {user_id}")
            avatar_url = f"https://thumbnails.roblox.com/v1/users/avatar-3d?userId={user_id}"
            avatar_response = requests.get(avatar_url, headers=headers)
            avatar_data = avatar_response.json()
            print(avatar_data)

            if 'imageUrl' not in avatar_data or not avatar_data['imageUrl'] :
                return Response({"error": f"Could not find avatar imageUrl for user ID: {user_id}"}, 
                                status=status.HTTP_404_NOT_FOUND)
            if avatar_data['state'] != 'Completed':
                return Response({"error": f"Avatar data not ready for user ID: {user_id}"}, 
                                status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
            # Step 3: Get the metadata URL from the avatar data
            print("Downloading metadata...")
            metadata_url = avatar_data['imageUrl']
            metadata_response = requests.get(metadata_url, headers=headers)
            metadata = metadata_response.json()
            
            # Function to find the correct CDN subdomain and download content
            def download_from_cdn(asset_id, subdomains=None):
                if subdomains is None:
                    subdomains = ['t1', 't2', 't3', 't4', 't5', 't6', 't7']
                
                for subdomain in subdomains:
                    url = f"https://{subdomain}.rbxcdn.com/{asset_id}"
                    try:
                        response = requests.get(url, headers=headers, timeout=10)
                        response.raise_for_status()
                        return response.content, url
                    except RequestException:
                        continue
                
                raise Exception(f"Failed to download asset {asset_id} from any subdomain")
            
            # Download OBJ & MTL files
            model_files = {}
            for key in ["obj", "mtl"]:
                asset_id = metadata[key]
                content, _ = download_from_cdn(asset_id)
                file_path = os.path.join(player_folder, f"{asset_id}.{key}")
                with open(file_path, "wb") as f:
                    f.write(content)
                model_files[key] = os.path.basename(file_path)
            
            # Download Textures
            textures = metadata["textures"]
            texture_files = {}
            
            for texture in textures:
                content, _ = download_from_cdn(texture)
                tex_path = os.path.join(player_folder, f"{texture}.png")  # Assume PNG format
                with open(tex_path, "wb") as f:
                    f.write(content)
                texture_files[texture] = os.path.basename(tex_path)
            
            # Fix .MTL file to use local texture paths
            mtl_path = os.path.join(player_folder, model_files["mtl"])
            mtl_fixed_path = os.path.join(player_folder, "fixed.mtl")
            
            with open(mtl_path, "r") as f:
                mtl_data = f.read()
            
            for tex_name, tex_path in texture_files.items():
                mtl_data = mtl_data.replace(tex_name, tex_path)
            
            with open(mtl_fixed_path, "w") as f:
                f.write(mtl_data)
            
            # Save model info for future reference
            model_info = {
                "obj_file": model_files["obj"],
                "mtl_file": "fixed.mtl",
                "textures": list(texture_files.values()),
                "base_url": f"/api/avatar/{player_name}/file/"
            }
            
            with open(model_info_path, 'w') as f:
                json.dump(model_info, f)
            
            # Return model info
            return Response(model_info)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AvatarFileView(APIView):
    """
    View to fetch and return specific files for a player's 3D model.
    """
    
    def get(self, request, player_name, file_name):
        # Get the file path
        file_path = os.path.join(settings.MEDIA_ROOT, 'avatar_models', player_name, file_name)
        
        # Check if the file exists
        if not os.path.exists(file_path):
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Return the file
        return FileResponse(open(file_path, 'rb'))
