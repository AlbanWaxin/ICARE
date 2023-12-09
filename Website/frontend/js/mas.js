console.log(data);
const innactive = document.getElementsByClassName("innactive")[0];
const not_up_to_date = document.getElementsByClassName("not_up_to_date")[0];
const up_to_date = document.getElementsByClassName("up_to_date")[0];
const up_innactive = document.getElementsByClassName("up_innactive")[0];
const finished = document.getElementsByClassName("finished")[0];
const dropped = document.getElementsByClassName("dropped")[0];

$(document).ready(function () {
  for (var i = 0; i < data.length; i++) {
    let card = create_card(data[i]);
    if (data[i].state == "innactive") {
      innactive.appendChild(card);
    } else if (data[i].state == "not_up_to_date") {
      not_up_to_date.appendChild(card);
    } else if (data[i].state == "up_to_date") {
      up_to_date.appendChild(card);
    } else if (data[i].state == "finished") {
      finished.appendChild(card);
    } else if (data[i].state == "dropped") {
      dropped.appendChild(card);
    } else if (data[i].state == "up_innactive") {
      up_innactive.appendChild(card);
    }
  }
});

function update(webtoon) {
  var form = document.createElement("form");
  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "webtoon");
  input.setAttribute("value", webtoon);
  form.setAttribute("method", "post");
  form.setAttribute("action", "/update");
  form.style.display = "hidden";
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

function create_card(webtoon) {
  var div = document.createElement("div");
  div.className = "card";
  var img = document.createElement("img");
  img.src = webtoon.image;
  img.className = "card-img-top";
  var div2 = document.createElement("div");
  div2.className = "card-body";
  var title = document.createElement("p");
  title.className = "card-title";
  if (webtoon.name.length > 21) {
    webtoon.name = webtoon.name.slice(0, 15) + "...";
  }
  title.innerHTML = webtoon.name;
  var chapter = document.createElement("div");
  chapter.className = "chapter";
  var last_chapter = document.createElement("p");
  last_chapter.className = "last-chapter";
  last_chapter.innerHTML =
    "Last:" +
    webtoon.last_chapter_read +
    "/" +
    webtoon.chapter_list[0].chapter.split(" ")[1];
  chapter.appendChild(last_chapter);
  var card_state = document.createElement("p");
  card_state.className = "card-state";
  card_state.innerHTML = webtoon.state;
  chapter.appendChild(card_state);
  var chapter_list = document.createElement("select");
  chapter_list.className = "chapter-list";
  chapter_list.id = "chapter-list";
  for (var j = 0; j < webtoon.chapter_list.length; j++) {
    var option = document.createElement("option");
    option.value = webtoon.chapter_list[j].chapter;
    option.innerHTML = webtoon.chapter_list[j].chapter;
    var chiffres = webtoon.chapter_list[j].chapter.split(" ")[1].match(/\d+/g);
    if (chiffres != null) {
      if (chiffres[0] == webtoon.last_chapter_read) {
        option.selected = true;
      }
    }
    chapter_list.appendChild(option);
  }
  chapter.appendChild(chapter_list);
  var button = document.createElement("button");
  button.className = "btn btn-primary";
  button.innerHTML = "ok";
  button.onclick = function () {
    send_update_request(webtoon.url);
  };
  chapter.appendChild(button);
  div2.appendChild(title);
  div2.appendChild(chapter);
  div.appendChild(img);
  div.appendChild(div2);
  return div;
}

function send_update_request(url) {
  var selected_chapter = $("#chapter-list").val();
  console.log(selected_chapter, url);
}
