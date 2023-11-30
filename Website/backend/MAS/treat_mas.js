const { json } = require("express");
const fs = require("fs");
const { Scrapper } = require("./scrapper");
const { Webtoon } = require("./webtoon");
const path = require("path");

class MAS {
  constructor() {}

  get_MAS_json() {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../datas/MAS_db.json"), "utf8")
    );
  }

  set_MAS_json(json) {
    fs.writeFileSync(
      path.join(__dirname, "../../datas/MAS_db.json"),
      JSON.stringify(json)
    );
  }

  fuze(tab) {
    return Object.values(tab).reduce((acc, val) => acc.concat(val), []);
  }

  slice_by_state() {
    const json = get_MAS_json();
    const states = {
      dropped: [],
      finished: [],
      innactive: [],
      up_to_date: [],
      up_innactive: [],
      not_up_to_date: [],
    };
    json.filter((item) => states[item.state].push(item));
    return states;
  }

  change_webtoon(name, slot, value) {
    const jss = get_MAS_json();
    const index = jss.findIndex((item) => item.name.includes(name));
    jss[index][slot] = value;
    if (slot == "last_chapter_read") {
      new Webtoon(
        jss[index].name,
        jss[index].state,
        jss[index].image,
        jss[index].last_chapter_read,
        jss[index].chapters,
        jss[index].link
      ).determine_state();
      jss[index] = Webtoon.to_json();
    }
    set_MAS_json(json);
    return slice_by_state();
  }

  async update() {
    const scrapper = new Scraper();
    const slice = slice_by_state();
    for (const state of slice) {
      if (!state == dropped || !state == finished) {
        to_update = [];
        updated = [];
        for (const webtoon of state) {
          to_update.push(
            new Webtoon(
              webtoon.name,
              webtoon.state,
              webtoon.image,
              webtoon.last_chapter_read,
              webtoon.chapters,
              webtoon.link
            )
          );
        }
        updated = await scrapper.scrape_all(to_update);
        state = updated.map(Webtoon.to_json);
      }
    }
    set_MAS_json(fuze(slice));
  }

  async add_webtoon(link) {
    const scrapper = new Scraper();
    const slice = slice_by_state();
    const scrape = await scrapper.create_from_scrape(link);
    const webtoon = new Webtoon(
      scrape.name,
      "",
      scrape.image,
      0,
      scrape.chapters,
      link
    ).determine_state();
    slice[webtoon.state].push(webtoon.to_json());
    set_MAS_json(fuze(slice));
    return slice_by_state();
  }

  async remove_webtoon(link) {
    const jss = get_MAS_json();
    const index = jss.findIndex((item) => item.link.includes(link));
    slice.splice(index, 1);
    set_MAS_json(fuze(slice));
    return slice_by_state();
  }
}

exports.MAS = MAS;
