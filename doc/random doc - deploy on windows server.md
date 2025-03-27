I have this old windows pc I use to host everything. I use meshcentral to access it now I want to host this project there instead of cpanel (since cpanel doesn't support websockets). Right now it's on cpanel, maybe the .cpanel.yml can give you an idea of how it currently is deployed. So client side react + django api + postgres. Can you guide my through the steps to deploy my app on a standard, personnal windows 10 machine used as a server? 

Where I am at :

- bought domain 
- have react dist folder on my server (C:/Users/User/Desktop/biyoo-s_uno/react-ts-app/dist)
- have django api running through python3 manage.py runserver. For now I don't care about production ready, I just want to see it working.
- have caddyFile setup and running (sc.exe create Caddy binPath= "C:\caddy\caddy.exe run --config C:\caddy\Caddyfile") 
- Have created A records for both api and site
   - biyoouno.ovh.
	0 	A 	88.181.249.5 
   - api.biyoouno.ovh.
	0 	A 	88.181.249.5

C:\caddy\Caddyfile
{
  # Global options
  http_port 11180
  https_port 11443

  # local_certs
}
biyoouno.ovh {
  # React app (frontend)
  root * C:/Users/User/Desktop/biyoo-s_uno/react-ts-app/dist
  try_files {path} /index.html
  file_server

  log {
    output file C:/caddy/logs/frontend.log
  }
}
api.biyoouno.ovh {
  # Django API backend
  reverse_proxy localhost:8000
  
  # WebSockets
  @websockets {
    header Connection *Upgrade*
    header Upgrade    websocket
  }
  reverse_proxy @websockets localhost:8000

  log {
    output file C:/caddy/logs/api.log
  }
}

Have port forwarded :
http :
  start port: 80
  exit port : 80
  destination port : 11180
https :
  start port: 443
  exit port : 443
  destination port : 11443

