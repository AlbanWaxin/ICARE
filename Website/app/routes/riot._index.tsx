import {
  LoaderFunctionArgs,
  LinksFunction,
  redirect,
  json,
} from "@remix-run/node";

import fetch from "node-fetch";
import { useLoaderData, Form, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";

let alphabet:any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let used_Letter:any = { solo: "S", off: "N" };

const Riot_Welcome = () => {
  const players = useLoaderData<typeof loader>();
  let player_cards = [];
  for (let i = 0; i < players.length; i++) {
    player_cards.push(
      <Player_card
        players={players}
        player={players[i]}
        key={i}
      />
    );
  }
  return (
    <div>
      <Adder />
      <Section cards={player_cards} />
    </div>
  );
};

type AddProps = {};

const Adder = (props: AddProps) => {
  const [input_value, setInputValue] = useState("");
  const [tag_value, setTagValue] = useState("");
  return (
    <div className="add w-full sticky bg-[#222222]">
      <div className="w-full h-1/2 flex flex-row justify-center">
        <input
          className="w-1/5 h-1/2 text-white bg-[#222222] border-2 border-white rounded-md p-1 text-center font-bold m-0 pr-2"
          type="text"
          placeholder="Riot Name"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <input
          className="w-32 h-1/2 text-white bg-[#222222] border-2 border-white rounded-md p-1 text-center font-bold m-0 pr-2"
          type="text"
          placeholder="Tag"
          onChange={(e) => setTagValue(e.target.value)}
        />
        <button
          className="rounded-md p-1 text-white text-xs w-1/12 text-center font-bold m-0  ml-6 mr-2 border-2 border-white bg-[#5b65ec]"
          onClick={(e) => new_follow(input_value, e)}
        >
          Add
        </button>
        <Form
          id="hidden-add-form"
          style={{ display: "none" }}
          method="post"
          action="/riot"
        >
          <input
            type="hidden"
            name="username"
            value={input_value}
          />
          <input
            type="hidden"
            name="tag"
            value={tag_value}
          />
          <input
            type="hidden"
            name="form_action"
            value="add"
          />
        </Form>
      </div>
    </div>
  );
};

type SectionProps = {
  cards: JSX.Element[];
};

const Section = (props: SectionProps) => {
  return (
    <div className="basis-full flex-col mt-5">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-4 mr-4">
        {props.cards}
      </div>
    </div>
  );
};

type Player_CardProps = {
    players: Riot_Player[];
  player: Riot_Player;
  key: number;
};

const Player_card = (props: Player_CardProps) => {
  return (
    <div className="w-full mx-auto min-h-40 max-h-48 rounded-xl bg-[#333333] border-2 border-[#555555]">
      <div className="w-full h-3/4 flex flex-row">
        <Card_Left
          level={props.player.level}
          icon={props.player.icon}
        />
        <Card_Right player={props.player} />
      </div>
      <div className="w-full h-1/4 bg-[#222222] rounded-b-xl">
        <Riot_Status
          name={props.player.name}
          is_in_game={props.player.is_in_game}
          game={props.player.game}
          other_players={props.players}
        />
      </div>
    </div>
  );
};

type Card_LeftProps = {
  level: number;
  icon: number;
};

const Card_Left = (props: Card_LeftProps) => {
  return (
    <div className="w-1/4 pr-4 h-full">
      <img
        src={
          "http://ddragon.leagueoflegends.com/cdn/14.13.1/img/profileicon/" +
          props.icon +
          ".png"
        }
        alt="icon"
        className="mt-2 ml-2 mr-2 w-full h-4/6 rounded-full"
      />
      <h3 className="text-white text-2xl font-bold text-justify-center text-center ml-5">
        {props.level}
      </h3>
    </div>
  );
};

type Card_RightProps = {
  player: Riot_Player;
};

const Card_Right = (props: Card_RightProps) => {
  return (
    <div className="w-3/4 h-full flex flex-col justify-center items-center">
      <Riot_Rank_Elt ranks={props.player.ranks} />
    </div>
  );
};

type Riot_Rank_EltProps = {
  ranks: Riot_Ranks;
};

const Riot_Rank_Elt = (props: Riot_Rank_EltProps) => {
  let src_solo_duo =
    "/riot/ranks/" + props.ranks["RANKED_SOLO_5x5"].tier + ".png";
  let solo_lp = String(props.ranks["RANKED_SOLO_5x5"].leaguePoints) + " - LP";
  let src_flex = "/riot/ranks/" + props.ranks["RANKED_FLEX_SR"].tier + ".png";
  let flex_lp = String(props.ranks["RANKED_FLEX_SR"].leaguePoints) + " - LP";
  return (
    <div className="w-full flex flex-row h-fulli">
      <div className="w-1/2 h-full flex flex-col justify-center content-center">
        <p className="text-white text-xl font-bold text-center w-full">
          Solo/Duo
        </p>
        <img
          src={src_solo_duo}
          alt="icon"
          className="w-full pl-8 pr-8 h-1/2 content-center justify-center"
        />
        <p className="text-white text-xl font-bold text-center w-full">
          {solo_lp}
        </p>
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center content-center">
        <h5 className="text-white text-xl font-bold text-center w-full">
          Flex
        </h5>
        <img
          src={src_flex}
          alt="icon"
          className="w-full pl-8 pr-8 h-1/2 content-center justify-center"
        />
        <p className="text-white text-xl font-bold text-center w-full">
          {flex_lp}
        </p>
      </div>
    </div>
  );
};

type Riot_Status = {
  name: string;
  is_in_game: boolean;
  game: Riot_Game;
  other_players: Riot_Player[] | undefined;
};

const Riot_Status = (props: Riot_Status) => {
  let text = "";
  let letter = "";
  if (props.is_in_game) {
    letter = choose_letter(props.game);
    text = props.name + " - " + props.game.gameType;
  } else {
    text = props.name + " - " + "Not In Game";
  }
  return (
    <div className="h-full content-center flex flex-row justify-center">
      <h2 className=" w-11/12 /h-full text-white text-2xl font-bold text-center content-center">
        {text}{" "}
      </h2>
      <div className="w-1/12 h-full content-center justify-center">
        <h1 className="w-11/12 /h-full text-white text-2xl font-bold text-center content-center">{letter} </h1>
      </div>
    </div>
  );
};

type Riot_Game = {
  gameType: string;
  gameId: string;
};

type Riot_Ranks = {
  RANKED_SOLO_5x5: Riot_Rank;
  RANKED_FLEX_SR: Riot_Rank;
  CEHRRY: Riot_Rank;
};

type Riot_Rank = {
  tier: string;
  rank: string;
  leaguePoints: number;
};

type Riot_Player = {
  name: string;
  ranks: Riot_Ranks;
  icon: number;
  level: number;
  game: Riot_Game;
  is_in_game: boolean;
};

export default Riot_Welcome;

function createPlayer(
  name: string,
  ranks: object,
  icon: number,
  level: number,
  game: any,
  is_in_game: boolean
): Riot_Player {
  return {
    name: name,
    ranks: ranks as Riot_Ranks,
    icon: icon,
    level: level,
    game: game,
    is_in_game: is_in_game,
  };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await fetch(
    "http://127.0.0.1:6000/riot/get_followed?user=CodeCubes"
  );
  const data: any = await response.json();
  let players: Riot_Player[] = [];
  for (let i = 0; i < data.length; i++) {
    let player = data[i];
    players.push(
      createPlayer(
        player.player_info,
        player.status.ranks,
        player.status.icon,
        player.status.level,
        player.status.game,
        player.status.is_in_game
      )
    );
  }
  return players;
};

function choose_letter(
  game_info: Riot_Game,
) {
  console.log(used_Letter, game_info);
  if (used_Letter[game_info.gameId] != undefined) {
    return used_Letter[game_info.gameId];
  }
  let letter = alphabet[0];
  alphabet.shift();
  used_Letter[game_info.gameId] = letter;
  return letter;
}

function new_follow(name: string, e: any) {
  let form:any = document.getElementById("hidden-add-form");
  if (form === null) {
    return;
  }
  console.log("new")
  form.submit();
}