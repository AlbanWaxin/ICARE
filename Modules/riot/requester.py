import requests
import json

class Requester:
    def __init__(self):
        self.api_key = "RGAPI-12baffd9-0a78-4a7f-9903-d22587d229f4"
        self.headers = {
            "X-Riot-Token": self.api_key,
        }

    def request(self,url):
        try:
            res= requests.get(url,headers=self.headers)
            return False if res.status_code == 404 else res.json()
        except requests.RequestException as error:
            print(f"Error: {error}")
            
    def get_puuid(self, gameName, tagLine):
        return self.request(f"https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}")
        
    def get_summoner(self,puuid):
        return self.request( f"https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}")

    def get_ranks(self,id):
        return self.request( f"https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/{id}")
    
    def is_in_game(self, player_id):
        return self.request( f"https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/{player_id}")
        

