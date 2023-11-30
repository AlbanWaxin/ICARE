const axios = require("axios");
const cheerio = require("cheerio");

// Function to fetch the HTML content of a website
async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching the HTML:", error);
    return null;
  }
}

class Scrapper {
  constructor() {
    this.sites = {
      manhuascan: {
        name: "manhuascan",
        url: "https://manhuascan.io",
        cli: "chapters",
        image: "",
        wb_name: "h1",
      },
      "1stkissmanga": {
        name: "1stkissmanga",
        url: "https://1stkissmanga.me",
        cli: "main version-chap no-volumn",
        image: "img-responsive",
        wb_name: "h1",
      },
      mangabuddy: {
        name: "mangabuddy",
        url: "https://mangabuddy.com",
        cli: "chapter-list-inner",
        image: "my_image",
        wb_name: "h1",
      },
      coffeemanga: {
        name: "coffeemanga.io",
        url: "https://coffeemanga.io",
        cli: "main version-chap no-volumn",
        image: "img-responsive",
        wb_name: "h1",
      },
    };
  }

  async treatment(link) {
    const split = link.split("//")[1].split("/");
    var chap_link = "";
    var chap_date = "";
    var chap_number = -1;
    var url = {
      title:
        split[split.length - 1].length != 0
          ? split[split.length - 1]
          : split[split.length - 2],
      site: this.sites[split[0].split(".")[0]],
    };
    var chapter_list = [];
    const html = await fetchHTML(link);
    if (html) {
      const loaded = cheerio.load(html);
      switch (url.site) {
        case this.sites.manhuascan:
          loaded("div").each((index, element) => {
            if (loaded(element).attr("id") == url.site.cli) {
              loaded(element)
                .find("li")
                .each((index, chapter) => {
                  //console.log("chapter-list found", url.title);
                  loaded(chapter)
                    .find("a")
                    .each((index, chap_linking) => {
                      const href = loaded(chap_linking).attr("href");
                      chap_link = url.site.url + href;
                      chap_number = +href
                        .split("chapter-")[1]
                        .replace("-", ".");
                      loaded(chap_linking)
                        .find("time")
                        .each((index, timed) => {
                          chap_date = this.treat_date(loaded(timed).text());
                          //console.log(chap_date);
                        });
                    });
                  chapter_list.push({
                    number: chap_number,
                    link: chap_link,
                    date: chap_date,
                  });
                });
            }
          });
          //console.log(chapter_list.length, url);
          break;
        case this.sites["1stkissmanga"]:
          loaded("ul").each((index, element) => {
            if (
              loaded(element).attr("class") &&
              loaded(element).attr("class").includes(url.site.cli)
            ) {
              console.log("1stkissmanga found", url.title);
              loaded(element)
                .find("li")
                .each((index, chapter) => {
                  const nb = loaded(chapter).find("a");
                  if (nb.length != 1) {
                    nb.each((index, link) => {
                      if (loaded(link).attr("class") == "c-new-tag") {
                        const href = loaded(link).attr("href");
                        chap_link = href;
                        chap_number = +href
                          .split("chapter-")[1]
                          .replace("/", "")
                          .replace("-", ".")
                          .replace("_", ".");
                        chap_date = this.treat_date(loaded(link).attr("title"));
                      }
                    });
                  } else {
                    nb.each((index, link) => {
                      const href = loaded(link).attr("href");
                      chap_link = href;
                      chap_number = +href
                        .split("chapter-")[1]
                        .replace("/", "")
                        .replace("_", ".")
                        .replace("-", ".");
                    });
                    loaded(chapter)
                      .find("i")
                      .each((index, i) => {
                        chap_date = this.treat_date(loaded(i).text());
                      });
                  }
                  chapter_list.push({
                    number: chap_number,
                    link: chap_link,
                    date: chap_date,
                  });
                });
            }
          });
          break;
        case this.sites.mangabuddy:
          loaded("div").each((index, element) => {
            if (loaded(element).attr("id") == url.site.cli) {
              loaded(element)
                .find("li")
                .each((index, chapter) => {
                  loaded(chapter)
                    .find("a")
                    .each((index, link) => {
                      const href = loaded(link).attr("href");
                      chap_link = url.site.url + href;
                      chap_number = href.includes("chapter")
                        ? +href.split("chapter-")[1].replace("-", ".")
                        : href.includes("notice")
                        ? +href.split("notice-")[1]
                        : -1;
                      loaded(link)
                        .find("time")
                        .each((index, time) => {
                          chap_date = this.treat_date(loaded(time).text());
                        });
                    });
                  chapter_list.push({
                    number: chap_number,
                    link: chap_link,
                    date: chap_date,
                  });
                });
            }
          });
          break;
        case this.sites.coffeemanga:
          loaded("ul").each((index, element) => {
            if (loaded(element).attr("class").includes(url.site.cli)) {
              loaded(element)
                .find("li")
                .each((index, chapter) => {
                  const nb = loaded(chapter).find("a");
                  if (nb.length != 1) {
                    nb.each((index, link) => {
                      if (loaded(link).attr("class") == "c-new-tag") {
                        const href = loaded(link).attr("href");
                        chap_link = href;
                        chap_number = +href
                          .split("chapter-")[1]
                          .replace("/", "")
                          .replace("-", ".")
                          .replace("_", ".");
                        chap_date = this.treat_date(loaded(link).attr("title"));
                      }
                    });
                  } else {
                    nb.each((index, link) => {
                      const href = loaded(link).attr("href");
                      chap_link = href;
                      chap_number = +href
                        .split(/chapter-|episode-/)[1]
                        .replace("/", "")
                        .replace("_", ".")
                        .replace("-", ".");
                    });
                    loaded(chapter)
                      .find("i")
                      .each((index, i) => {
                        chap_date = this.treat_date(loaded(i).text());
                      });
                  }
                  chapter_list.push({
                    number: chap_number,
                    link: chap_link,
                    date: chap_date,
                  });
                });
            }
          });
          break;
        default:
          break;
      }
      return chapter_list;
    }
    return null;
  }

  async scrape(webtoon) {
    const new_chapters = await this.treatment(webtoon.link);
    webtoon.chapters = new_chapters;
    webtoon.determine_state();
    return webtoon;
  }

  async scrape_all(webtoons) {
    var new_webtoons = [];
    var new_chapters = [];
    var new_images = [];
    for (let i = 0; i < webtoons.length; i++) {
      new_chapters.push(this.treatment(webtoons[i].link));
    }
    await Promise.all(new_chapters).then((values) => {
      for (let i = 0; i < values.length; i++) {
        if (values[i].length != 0) {
          webtoons[i].chapters = values[i];
          webtoons[i].determine_state();
        } else {
          console.log(
            "Scrape of",
            webtoons[i].name,
            "from",
            webtoons[i].link,
            "failed"
          );
        }
      }
    });
    return new_webtoons;
  }

  async create_from_scrape(link) {
    const ni = await this.get_name_image(link);
    return {
      name: ni[0],
      image: ni[1],
      chapters: await this.treatment(link),
    };
  }

  async get_name_image(link) {
    const split = link.split("//")[1].split("/");
    var name = "";
    var image_link = "";
    var url = {
      title: split[split.length - 2],
      site: this.sites[split[0].split(".")[0]],
    };
    const html = await fetchHTML(link);
    if (html) {
      const loaded = cheerio.load(html);
      var first = false;
      loaded("img").each((index, img) => {
        if (loaded(img).attr("class")) {
          //console.log(loaded(img).get(0).attribs);
          if (
            loaded(img).attr("class").includes(url.site.image) &&
            !first &&
            (loaded(img).attr("data-srcset") ||
              loaded(img).attr("srcset") ||
              url.site == this.sites.manhuascan)
          ) {
            const x = url.site == this.sites.manhuascan ? "data-src" : "src";
            image_link = loaded(img).attr(x);
            first = true;
            //console.log('Image loaded');
          }
        }
      });
      first = false;
      loaded(url.site.wb_name).each((index, wb) => {
        if (!first) {
          name = loaded(wb)
            .text()
            .replace(/\t|\n|\r/gm, "");
          first = true;
        }
      });
      //console.log(image_link + '\n');
      return [name, image_link];
    }
  }

  treat_date(dateString) {
    const date = new Date();
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    const test = dateString.replace(/\t|\n|\r|,/gm, "");
    const parts = test.split(" ");
    if (dateString.includes("ago")) {
      switch (parts[1]) {
        case "year":
        case "years":
          year = year - +parts[0];
          break;
        case "month":
        case "months":
          if (month <= +parts[0]) {
            year -= 1;
            month = 12 - (+parts[0] - month);
          } else {
            month = month - +parts[0];
          }
          break;
        case "day":
        case "days":
          if (day <= +parts[0]) {
            if (month == 1) {
              year = -1;
              month = 12;
            } else {
              month = month - 1;
            }
            day = 31 - (+parts[0] - day);
          } else {
            day = day - +parts[0];
          }
          break;
        case "week":
        case "weeks":
          if (day <= +parts[0] * 7) {
            if (month == 1) {
              year = -1;
              month = 12;
            } else {
              month = month - 1;
            }
            day = 31 - (+parts[0] * 7 - day);
          } else {
            day = day - +parts[0];
          }

        default:
          break;
      }
    } else {
      month = months[parts[0]];
      day = parts[1];
      year = parts[2];
    }

    // Retourner la date formatée
    return `${day}/${month}/${year}`;
  }
}

// var scrap = new Scrapper();
// async function test(link) {
//   var result = await scrap.get_name_image(link);
//   console.log(result);
// }

// // test("https://manhuascan.io/manga/transmigrating-to-the-otherworld-once-more");

// async function get_image(link) {
//   const html = await fetchHTML(link);
//   const loaded = cheerio.load(html);
//   links = [];
//   loaded("section").each((index, element) => {
//     if (loaded(element).attr("class") == "content") {
//       loaded(element)
//         .find("ul")
//         .each(async (index, element) => {
//           var section_list = { name: "", links: [] };
//           if (!loaded(element).attr("class")) {
//             const lists = loaded(element).find("li");
//             const name = loaded(element).find("h2");
//             name.each((index, element) => {
//               var section = loaded(element).text();
//               section_list["name"] = section;
//             });
//             lists.each(async (index, element) => {
//               await loaded(element)
//                 .find("a")
//                 .each(async (index, element) => {
//                   var a_link = loaded(element);
//                   section_list.links.push({
//                     name: a_link.text(),
//                     link: a_link.attr("href"),
//                   });
//                 });
//             });
//           }
//           links.push(section_list);
//         });
//     }
//   });
//   console.log(links);
//   var section_list_i = [];
//   for (var i = 0; i < links.length; i++) {
//     for (var j = 0; j < links[i].links.length; j++) {
//       var html_i = await fetchHTML("https://www.gensh.in" + ));
//     var loaded_i = cheerio.load(html_i);
//     loaded_i("img").each((index, img) => {
//       // console.log("ici");
//       if (loaded_i(img).attr("alt") == "icon_image") {
//         section_list_i.links.push({
//           name: a_,
//           link: loaded_i(img).attr("src"),
//         });
//       }
//     });
//   }
//   console.log(links);
//   links.forEach((element) => {
//     path = "../files/genshin_images/item/" + element.name + "/";
//     element.links.forEach((link) => {
//       downloadImage(
//         "https://www.gensh.in/" + link.link,
//         path + link.name + ".jpg"
//       );
//     });
//   });
// }

// const fs = require("fs");
// const client = require("https");

// function downloadImage(url, filepath) {
//   return new Promise((resolve, reject) => {
//     client.get(url, (res) => {
//       if (res.statusCode === 200) {
//         res
//           .pipe(fs.createWriteStream(filepath))
//           .on("error", reject)
//           .once("close", () => resolve(filepath));
//       } else {
//         // Consume response data to free up memory
//         res.resume();
//         reject(
//           new Error(`Request Failed With a Status Code: ${res.statusCode}`)
//         );
//       }
//     });
//   });
// }

// links = get_image("https://www.gensh.in/database/item");

module.exports = { Scrapper };
