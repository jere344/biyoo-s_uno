from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class ScriptViewSet(APIView):
    http_method_names = ['get']

    def get(self, request, script_name:str):
        # if localhsot
        if request.META.get('REMOTE_ADDR') != '127.0.0.1' and request.META.get('REMOTE_ADDR') != 'localhost':
            return Response('Not allowed', status=status.HTTP_403_FORBIDDEN)
        # run the script in the scripts folder with the given name
        from api_app.scripts import get_run
        get_run[script_name]()
        return Response('script_run', status=status.HTTP_200_OK)