class Webtoon {
  constructor(
    name,
    state, // up_to_date, not_up_to_date, dropped, innactive,finished
    image,
    last_chapter_read,
    chapters, //[{number, link, date}]
    link
  ) {
    this.name = name;
    this.state = state;
    this.image = image;
    last_chapter_read
      ? (this.last_chapter_read = last_chapter_read)
      : (this.last_chapter_read = 0);
    chapters ? (this.chapters = chapters) : (this.chapters = []);
    link ? (this.link = link) : (this.links = "");
  }

  to_json() {
    return {
      name: this.name,
      state: this.state,
      image: this.image,
      last_chapter_read: this.last_chapter_read,
      chapters: this.chapters,
      link: this.link,
    };
  }

  max_chapter() {
    var max = { number: 0, el: null };
    this.chapters
      .slice()
      .sort(function (a, b) {
        return a.number - b.number;
      })
      .forEach((element) => {
        max =
          element.number - max.number <= 10
            ? { number: element.number, el: element }
            : max;
      });
    return max;
  }

  determine_state() {
    if (this.state !== "dropped" && this.state !== "finished") {
      let max_c = this.max_chapter();
      this.state =
        this.last_chapter_read == max_c.number
          ? "up_to_date"
          : "not_up_to_date";
      if (!compare_date(max_c.el.date)) {
        this.state = this.state == "up_to_date" ? "innactive" : "up_innactive";
      }
    }
  }
}

function compare_date(input_date) {
  const date = new Date();
  splitted_date = input_date.split("/");
  // console.log(splitted_date);
  const m = [1, 3, 5, 7, 8, 10, 12];
  const tab = [
    date.getFullYear() - splitted_date[2] <= 1,
    date.getMonth() + 1 - splitted_date[1],
    splitted_date[1] in m
      ? 31 - splitted_date[0] + date.getDate()
      : 30 - splitted_date[0] + date.getDate(),
  ];
  // console.log(tab);
  return tab[0] && (tab[1] == 0 || (tab[1] == 1 && tab[2] <= 31));
}
module.exports = { Webtoon };

// const test = new Webtoon(
//   "test",
//   "",
//   "test.jpg",
//   0,
//   [{ number: 1, link: "", date: "12/5/2023" }],
//   ""
// );

// test.determine_state();
// console.log(test.state);

// const test2 = new Webtoon(
//   "test2",
//   "",
//   "test2.jpg",
//   1,
//   [{ number: 1, link: "", date: "12/07/2023" }],
//   ""
// );
