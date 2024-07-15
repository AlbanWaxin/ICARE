from Utils.riot_types import get_champion_name,manage_rank

print(manage_rank([
    {
        "leagueId": "1218c089-2b9c-4f99-82ed-10d486bd0324",
        "queueType": "RANKED_SOLO_5x5",
        "tier": "PLATINUM",
        "rank": "IV",
        "summonerId": "LbvRVpGa1DaJo51ZLw1PnyA5RImPadrlh7FeGzgLTepdU50",
        "leaguePoints": 1,
        "wins": 17,
        "losses": 17,
        "veteran": False,
        "inactive": False,
        "freshBlood": False,
        "hotStreak": False
    },
    {
        "queueType": "CHERRY",
        "summonerId": "LbvRVpGa1DaJo51ZLw1PnyA5RImPadrlh7FeGzgLTepdU50",
        "leaguePoints": 0,
        "wins": 2,
        "losses": 3,
        "veteran": False,
        "inactive": False,
        "freshBlood": False,
        "hotStreak": False
    },
    {
        "leagueId": "ee3c637d-7762-41ad-a7d5-818029a3831b",
        "queueType": "RANKED_FLEX_SR",
        "tier": "BRONZE",
        "rank": "III",
        "summonerId": "LbvRVpGa1DaJo51ZLw1PnyA5RImPadrlh7FeGzgLTepdU50",
        "leaguePoints": 74,
        "wins": 9,
        "losses": 14,
        "veteran": False,
        "inactive": False,
        "freshBlood": False,
        "hotStreak": False
    }
]))