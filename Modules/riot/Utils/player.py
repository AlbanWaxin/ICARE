from Utils.player_stats import Player_stats
from Utils.riot_types import *
from Utils.requester import Requester
from dataclasses import dataclass , InitVar
from typing import Any
import json

@dataclass
class Player_status():
    game:CurrentGameInfo = None
    ranks:dict[str,Rank] = None
    level:int = None
    icon:int = None

    def update(self,requester:Requester,player:Identity):
        self.game = requester.is_in_game(player.puuid)
        if self.game is not None:
            print("In game",player.puuid)
        self.ranks = requester.get_ranks(player.summonerId)
        summoner = requester.get_summoner(player.puuid)
        self.level = summoner.summonerLevel
        self.icon = summoner.profileIconId
    
    def export(self,player_puuid:str):
        if self.game is not None:
            allies,ennemies = self.game.get_team(player_puuid)
            game = {
                'gameType': self.game.gameType,
                'gameMode': self.game.gameMode,
                'gameLength': self.game.gameLength,
                'ally': [ally.export() for ally in allies],
                'ennemies': [[ennemy.export() for ennemy in ennemyteam] for ennemyteam in ennemies],
                'bannedChampions': [banned.export() for banned in self.game.bannedChampions],
                'gameId': self.game.gameId
            }
        else:
            game = None
        return {
            'is_in_game': self.game is not None,
            'ranks': {rank:self.ranks[rank].export() for rank in self.ranks},
            'level': self.level,
            'icon': self.icon,
            'game': game
        }
    
@dataclass
class Player():
    identifier: str | tuple[str,str]
    identity:Identity = None
    status:Player_status = None
    stats:Player_stats = None
    requester:Requester = Requester()

    async def setup(self,identifier):
        if type(identifier) == tuple:
            accountdto : AccountDTO = self.requester.get_account_by_gt(identifier[0],identifier[1])
        elif type(identifier) == str:
            accountdto : AccountDTO = self.requester.get_account_by_puuid(identifier)
        else:
            raise ValueError("Invalid identifier")
        self.identity = Identity(puuid=accountdto.puuid,gameName=accountdto.gameName,tagLine=accountdto.tagLine)
        summoner = self.requester.get_summoner(self.identity.puuid) 
        self.identity.summonerId = summoner.id
        self.identity.accountId = summoner.accountId
        ranks = self.requester.get_ranks(self.identity.summonerId)
        self.status = Player_status(ranks=ranks,level=summoner.summonerLevel,icon=summoner.profileIconId)
        
    def update(self):
        new_identity:AccountDTO = self.requester.get_account_by_puuid(self.identity.puuid)
        self.identity.gameName = new_identity.gameName
        self.identity.tagLine = new_identity.tagLine
        self.status.update(self.requester,self.identity)
        #self.stats.update(requester)
        pass

    def status_export(self):
        return {
            'username': self.username,
            'tag': self.tag,
            'status': self.status.export(),
        }





