from flask import Flask, request
from requester import Requester
import json
import urllib.parse as urllib_parse

app = Flask(__name__)
requester = Requester()

def check_origin(request):
    return request.remote_addr != '127.0.0.1'


@app.route('/get_followed', methods=['POST'])
def get_followed():
    if check_origin(request):
        return "Unauthorized", 401
    player_list = json.loads(request.data.decode("utf-8"))
    players = {}
    for player in player_list:
        if player == None: return "No player", 400
        sumid = requester.get_summoner(player['puuid'])['id']
        game = requester.is_in_game(sumid)
        infos = {
                'name': player['gameName'],
                'puuid': player['puuid'],
                'ranks': {"sq":{"rank": None, "division" : None, "wins" : None, "losses" : None},
                          "flex":{"rank": None, "division" : None, "wins" : None, "losses" : None},
                          "tft":{"rank": None, "division" : None, "wins" : None, "losses" : None}},
                'url' : "https://u.gg/lol/profile/euw1/" + urllib_parse.quote(player['gameName']) + "-" + player['tagLine'],
                'in_game': game != False
            }
        ranks = requester.get_ranks(sumid)
        id0,id1 = None,None
        for rank in ranks:
            if rank['queueType'] == "RANKED_SOLO_5x5":
                id0 = ranks.index(rank)
            if rank['queueType'] == "RANKED_FLEX_SR":
                id1 = ranks.index(rank)
        if id0 == None : 
            infos['ranks']["sq"]["rank"] = "UNRANKED"
            infos['ranks']["sq"]["division"] = "UNRANKED"
            infos['ranks']["sq"]["wins"] = 0
            infos['ranks']["sq"]["losses"] = 0
        else:
            infos['ranks']["sq"]["rank"]=ranks[id0]["tier"]
            infos['ranks']["sq"]["division"]=ranks[id0]["rank"]
            infos['ranks']["sq"]["wins"]=ranks[id0]["wins"]
            infos['ranks']["sq"]["losses"]=ranks[id0]["losses"]
        if id1 == None :
            infos['ranks']["flex"]["rank"] = "UNRANKED"
            infos['ranks']["flex"]["division"] = "UNRANKED"
            infos['ranks']["flex"]["wins"] = 0
            infos['ranks']["flex"]["losses"] = 0
        else:
            infos['ranks']["flex"]["rank"]=ranks[id1]["tier"]
            infos['ranks']["flex"]["division"]=ranks[id1]["rank"]
            infos['ranks']["flex"]["wins"]=ranks[id1]["wins"]
            infos['ranks']["flex"]["losses"]=ranks[id1]["losses"]
        print(game)
        if game:
            ally,ennemies = [],[]
            # find teamId for the player
            for participant in game['participants']:
                if participant['puuid'] == player['puuid']:
                    teamId = participant['teamId']
                    break
            for participant in game['participants']:
                if participant['teamId'] == teamId:
                    ally.append({"champ": participant['championName'], "spell1": participant['spell1Id'], "spell2": participant['spell2Id'], "summoner": participant['summonerName']})
                else:
                    ennemies.append({"champ": participant['championName'], "spell1": participant['spell1Id'], "spell2": participant['spell2Id'], "summoner": participant['summonerName']})
            infos['game'] = {
                "ally": ally,
                "ennemies": ennemies,
                "gametype": game['gameType'],
                "gamelength": game['gameLength'],
            }
        players[player['gameName']] = infos
    return json.dumps(players), 200
    
@app.route('/start_follow', methods=['GET'])
def start_follow():
    if check_origin(request):
        return "Unauthorized", 401
    player = request.args.get('player')
    return json.dumps(get_follow_data(player,True)[0]), 200

@app.route('/add_follow', methods=['POST'])
def add_follow():
    if check_origin(request):
        return "Unauthorized", 401
    players = json.loads(request.data.decode("utf-8"))
    print(players)
    follows = []
    for player in players:
        data = get_follow_data(player['player'],False)
        print("No player") if data[0] == "No player" else follows.append(data[0])
    return  json.dumps(follows), 200

def get_follow_data(player,main):
    if player == None: return "No player", 400
    puuid = requester.get_puuid(gameName=player.split('#')[0], tagLine=player.split('#')[1])['puuid']
    return {"main": main, "puuid": puuid , "gameName": player.split('#')[0], "tagLine": player.split('#')[1], "id": requester.get_summoner(puuid)['id']},200

if __name__ == '__main__':
    app.run(host='0.0.0.0' ,port=5200)