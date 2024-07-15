from flask import Flask, request
from Utils.player import Player
from Utils.requester import Requester
import json
import urllib.parse as urllib_parse
import asyncio

app = Flask(__name__)
players:list[Player] = []
requester = Requester()


with open('Files/players.json','r') as file:
    data = json.load(file)
    for player in data:
        players.append(Player(identifier=player['puuid']))

async def setup_players():
    for player in players:
        print("Setuping",player.identifier)
        await player.setup(player.identifier)

asyncio.run(setup_players())

def check_origin(request):
    return request.remote_addr != '127.0.0.1'

@app.route('/update',methods=['GET'])
def update():
    if check_origin(request):
        return "Unauthorized", 401
    for player in players:
        player.update()
    return "Updated", 200

@app.route('/get_followed', methods=['POST'])
def get_followed():
    if check_origin(request):
        return "Unauthorized", 401
    outputs = []
    for player in players:
        outputs.append({'player_info':player.identity.gameName,'status':player.status.export(player.identity.puuid)})
    return json.dumps(outputs), 200

@app.route('/add_follow', methods=['POST'])
def add_follow():
    if check_origin(request):
        return "Unauthorized", 401
    print(request)
    print(request.data.decode('utf-8'))
    params = json.loads(request.data.decode('utf-8'))
    username = params['user']
    tag = params['tag']
    if (username,tag) not in [(player.identity.gameName,player.identity.tagLine) for player in players]:
        players.append(Player(identifier=(username,tag)))
        asyncio.run(save_player(players[-1]))
    return "Added", 200

async def save_player(player):
    await player.setup(player.identifier)
    player.update()
    with open('Files/players.json','w') as file:
        json.dump([{'puuid':player.identity.puuid} for player in players],file)

if __name__ == '__main__':
    app.run(host='0.0.0.0' ,port=5200)