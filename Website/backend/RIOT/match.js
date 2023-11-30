const Player = require("./player.js").Player;
const requester = require("./requester.js").requester;

class Match {
  constructor(match_id) {
    this.match_id = match_id;
    this.participants = [];
  }

  set_match(match_json) {
    this.winner;
    this.set_participants(match_json.infos.participants);
  }

  set_participants(participants_list) {
    for (var i = 0; i < participants_list.length; i++) {
      var player = new Player();
      player.summoner_dto = requester.getPlayer(
        null,
        participants_list[i].puuid,
        null,
        null
      );
      var stats = new Player_stats(participants_list[i]);
      this.participants.push({ player: player, stats: stats });
    }
  }

  player_stats;
}

class Player_stats {
  constructor(stats) {
    this.champion = {
      id: stats.championId,
      name: stats.championName,
      transform: stats.championTransform,
      lane: stats.lane,
    };
    this.final_level = stats.champLevel;
    this.kda = {
      kills: stats.kills,
      deaths: stats.deaths,
      assists: stats.assists,
      kda: (stats.kills + stats.assists) / stats.deaths,
      kp: stats.kills + stats.assists / stats.teamKills,
      dk: stats.doubleKills,
      tk: stats.tripleKills,
      spree: stats.killingSprees,
      largestspree: stats.largestKillingSpree,
      largestMultiKills: stats.largestMultiKill,
      longestTimeSpentLiving: stats.longestTimeSpentLiving,
    };
    this.pings = {
      allInPings: stats.allInPings,
      assistMePings: stats.assistMePings,
      baitPings: stats.baitPings,
      basicPings: stats.basicPings,
      commandPings: stats.commandPings,
      dangerPings: stats.dangerPings,
      enemyMissingPings: stats.enemyMissingPings,
      enemyVisionPings: stats.enemyVisionPings,
    };
    this.vision = {
      detectorWardsPlaced: stats.detectorWardsPlaced,
      wardsPlaced: stats.wardsPlaced,
      wardsKilled: stats.wardsKilled,
      visionScore: stats.visionScore,
    };
    this.objectives = { barons: stats.baronKills, dragons: stats.dragonKills };
    this.purchases = {
      goldEarned: stats.goldEarned,
      goldSpent: stats.goldSpent,
      consumables: stats.consumablesPurchased,
      items: {
        slots: [
          stats.item0,
          stats.item1,
          stats.item2,
          stats.item3,
          stats.item4,
          stats.item5,
          stats.item6,
        ],
        nb: stats.itemsPurchased,
      },
    };
    this.damages = {
      dealt: {
        total: stats.totalDamageDealtToChampions,
        ap: stats.magicDamageDealtToChampions,
        ad: "",
        true: "",
      },
      taken: {
        total: stats.totalDamageTaken,
        ap: stats.magicDamageTaken,
        ad: stats.physicalDamageTaken,
        true: stats.trueDamageTaken,
      },
      dealtToTurrets: stats.damageDealtToTurrets,
      dealtToBuildings: stats.damageDealtToBuildings,
      dealtToObjectives: stats.damageDealtToObjectives,
      taken: stats.totalDamageTaken,
      mitigated: stats.damageSelfMitigated,
      largestCriticalStrike: stats.largestCriticalStrike,
    };
    this.firstblood = {
      assists: stats.firstBloodAssist,
      kills: stats.firstBloodKill,
      assists: stats.firstTowerAssist,
      kills: stats.firstTowerKill,
    };
    this.end = {
      ff15: stats.gameEndedInEarlySurrender,
      ff: stats.gameEndedInSurrender,
    };
    this.farm = {
      minions: {
        killed: stats.totalMinionsKilled,
        denied: stats.totalMinionsKilled - stats.neutralMinionsKilled,
      },
      jungle: {
        killed: stats.neutralMinionsKilled,
        enemy: stats.neutralMinionsKilledEnemyJungle,
        team: stats.neutralMinionsKilledTeamJungle,
      },
      cs: {
        permin: stats.totalMinionsKilled / (stats.gameDuration / 60),
        perminjungle: stats.neutralMinionsKilled / (stats.gameDuration / 60),
      },
    };
    this.misc = {
      timeCCingOthers: stats.timeCCingOthers,
      timePlayed: stats.timePlayed,
      timeSpentDead: stats.timeSpentDead,
      timeCCingOthers: stats.timeCCingOthers,
      totalTimeCrowdControlDealt: stats.totalTimeCrowdControlDealt,
    };
  }
}

exports.Match = Match;
