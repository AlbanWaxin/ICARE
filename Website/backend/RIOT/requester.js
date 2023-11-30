const fetch = require("node-fetch");

class Requester {
  constructor() {
    this.api_key = "RGAPI-2d5e3ac0-1caa-4118-ac6d-a41c7e3690a1";
    this.headers = {
      "X-Riot-Token": this.api_key,
    };
  }

  async getPlayer(puuid, summoner_name, account_id, summoner_id) {
    var url = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/";
    const headers = this.headers;
    if (puuid != null) {
      url += `by-puuid/${puuid}`;
    } else if (account_id != null) {
      url += `by-account/${account_id}`;
    } else if (summoner_id != null) {
      url += `/${summoner_id}`;
    } else if (summoner_name.length > 0) {
      url += `by-name/${summoner_name}`;
    } else {
      console.error("Error: No summoner identifier provided.");
      return null;
    }
    try {
      const res = await fetch(url, { headers });
      const res_json = await res.json();
      return res_json;
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  async is_InGame(player_id) {
    const url = `https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${player_id}`;
    console.log(url);
    const headers = this.headers;
    try {
      const res = await fetch(url, { headers });
      switch (res.status) {
        case 200:
          const res_json = await res.json();
          return res_json;
        case 404:
          return false;
        default:
          console.log(`Error: ${res.status} - ${await res.text()}`);
          return null;
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  async getMatchHistory(player_puuid) {
    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${player_puuid}/ids?count=100`;
    const headers = this.headers;
    try {
      const res = await fetch(url, { headers });
      switch (res.status) {
        case 200:
          const res_json = await res.json();
          return res_json;
        case 404:
          return false;
        default:
          console.log(`Error: ${res.status} - ${await res.text()}`);
          return null;
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  async getMatchData(match_id) {
    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${match_id}`;
    const headers = this.headers;
    try {
      const res = await fetch(url, { headers });
      switch (res.status) {
        case 200:
          const res_json = await res.json();
          return res_json;
        case 404:
          return false;
        default:
          console.log(`Error: ${res.status} - ${await res.text()}`);
          return null;
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  async test() {
    const test_player = {};
    test_player.summoner_dto = await this.getPlayer(
      null,
      "LYS CodeCubes",
      null,
      null
    );
    console.log(test_player.summoner_dto);
    console.log(await this.is_InGame(test_player.summoner_dto.id));
    const matchs = await this.getMatchHistory(test_player.summoner_dto.puuid);
    const match = await this.getMatchData(matchs[0]);
    console.log(match.info.participants);
  }
}

const requester = new Requester();
requester.test();
exports.requester = requester;
