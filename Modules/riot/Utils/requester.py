import requests
from Utils.riot_types import *

class Requester:
    def __init__(self):
        self.api_key = "RGAPI-2772c942-51bd-4a2c-b288-2099a8fc0792"
        self.headers = {
            "X-Riot-Token": self.api_key,
        }

    def request(self,url:str):
        request = Request(url,self.headers)
        request.send()
        #print(str(request))
        return request.export_response()
            
    def get_account_by_gt(self, gameName:str, tagLine:str):
        return self.request(f"https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}")
    
    def get_account_by_puuid(self, puuid:str):
        return self.request(f"https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/{puuid}")
        
    def get_summoner(self,puuid:str):
        return self.request( f"https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}")

    def get_ranks(self,summonerId:str):
        return self.request( f"https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/{summonerId}")
    
    def is_in_game(self, puuid:str):
        return self.request( f"https://euw1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/{puuid}")

class Request:
    def __init__(self,url,headers=None):
        self.headers = headers
        self.request:str = url
        self.response = {
            "status": 0,
            "data": {}
        }
        pass
    def __str__(self):
        return f"Request: {self.request.split('.com/')[1].split('/')[3]} ,Response: Status: {self.response['status']}, Data: {self.response['data']}"
    def __repr__(self):
        return f"Status: {self.request}, Data: {self.response}"
    
    def send(self):
        try:
            res= requests.get(self.request,headers=self.headers)
            error = ""
            match res.status_code // 100:
                case 2:
                    self.response['status'] = 1
                case 4:
                    if res.status_code == 404:
                        error = "NOT FOUND"
                    else:
                        error = "REQUEST"
                case 5:
                    error = "RIOT"
                case _:
                    error = "UNKNOWN"
            self.response['data'] = {'error':error,'content':res.json()}            
        except requests.RequestException as error:
            print(f"Error: {error}")
            self.response['data'] = {'error':error}
            self.response['status'] = -1
        pass

    def export_response(self):
        if self.response['status'] == 1:
            match self.request.split('.com/')[1].split('/')[3]:
                case "accounts":
                    return AccountDTO(**self.response['data']['content'])
                case "summoners":
                    return SummonerDTO(**self.response['data']['content'])
                case "entries":
                    return manage_rank(self.response['data']['content'])
                case "active-games":
                    gameType = self.response['data']['content']['gameType']
                    gameMode = self.response['data']['content']['gameMode']
                    gameId = self.response['data']['content']['gameId']
                    participants = [CurrentGameParticipant(champion = participant['championId'],perks = Perks(perkIds=participant['perks']['perkIds'],perkStyle=participant['perks']['perkStyle'],perkSubStyle=participant['perks']['perkSubStyle']),teamId=participant['teamId'],summonerId=participant['summonerId'],puuid=participant['puuid'],spell1Id=participant['spell1Id'],spell2Id=participant['spell2Id'])for participant in self.response['data']['content']['participants']]
                    gameLength = self.response['data']['content']['gameLength']
                    bannedChampions = [BannedChampion(champion = banned['championId'],teamId = banned['teamId'],pickTurn = banned['pickTurn']) for banned in self.response['data']['content']['bannedChampions']]
                    return CurrentGameInfo(gameType=gameType,gameId=gameId,gameMode=gameMode,participants=participants,gameLength=gameLength,bannedChampions=bannedChampions)
        else :
            print(f"Error: {self.response['data']['error']},{self.response['data']['content'] if 'content' in self.response['data'] else 'No Content'}, Request: {self.request}")
            return None


