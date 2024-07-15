import json
from dataclasses import dataclass, field

# Summoner

@dataclass
class SummonerDTO():
    id:str
    accountId:str
    puuid:str
    profileIconId:int
    revisionDate:int
    summonerLevel:int

# Ranks

def manage_rank(response):
    queue_types = ['RANKED_SOLO_5x5','RANKED_FLEX_SR','CHERRY']
    ranks = {queue['queueType']: Rank(rank=queue['rank'] if "rank" in queue else 'UNRANKED',tier=queue['tier']if "rank" in queue else 'UNRANKED',leaguePoints=queue['leaguePoints']) for queue in response}
    for queue in queue_types:
        if queue not in ranks:
            ranks[queue] = Rank()
    return ranks

@dataclass
class Rank():
    tier:str = 'UNRANKED'
    rank:str = 'UNRANKED'
    leaguePoints:int = 0

    def export(self):
        return {
            'tier': self.tier,
            'rank': self.rank,
            'leaguePoints': self.leaguePoints
        }
# Accounts

@dataclass 
class AccountDTO():
    puuid:str
    gameName:str
    tagLine:str

@dataclass
class Identity():
    accountId:str = None
    summonerId:str = None
    puuid:str = None 
    gameName:str = None
    tagLine:str = None


# Active-Game
@dataclass
class BannedChampion():
    champion:str
    teamId:int
    pickTurn:int

    def __post_init__(self):
        self.champion = get_champion_name(self.champion)

    def export(self):
        return {
            'champion': self.champion,
            'teamId': self.teamId,
            'pickTurn': self.pickTurn
        }

@dataclass
class Perks():
    perkIds:list[int]
    perkStyle:int
    perkSubStyle:int

@dataclass
class CurrentGameParticipant():
    champion:str
    perks:Perks
    teamId:int
    summonerId:str
    puuid:str
    spell1Id:int
    spell2Id:int

    def __post_init__(self):
        self.champion = get_champion_name(self.champion)

    def export(self):
        return {
            'champion': self.champion,
            'perks': (self.perks.perkStyle,self.perks.perkSubStyle),
            'teamId': self.teamId,
            'summonerId': self.summonerId,
            'puuid': self.puuid,
            'spell1Id': self.spell1Id,
            'spell2Id': self.spell2Id,
        }

@dataclass
class CurrentGameInfo():
    gameType:str
    gameMode:str
    gameId:int
    participants:list[CurrentGameParticipant]
    teams:dict[str,list[CurrentGameParticipant]] = field(init=False)
    gameLength:int
    bannedChampions:list[BannedChampion]

    def __post_init__(self):
        self.teams = self.get_teams()

    def get_teams(self):
        teams = {}
        for participant in self.participants:
            if participant.teamId not in teams:
                teams[participant.teamId] = []
            teams[participant.teamId].append(participant)
        return teams
    
    def get_team(self, player_puuid:str):
        player = [participant for participant in self.participants if participant.puuid == player_puuid][0]
        teamId = player.teamId
        allies = self.teams[teamId]
        ennemies = [self.teams[team] for team in self.teams.keys() if team != teamId]
        return allies, ennemies

def get_champion_name(champion_id):
    with open('Utils/champion.json','r') as file:
        data = json.load(file)
        for id,champion in data.items():
            if id == str(champion_id):
                return champion
        return None
