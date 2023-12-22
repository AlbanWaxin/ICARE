console.log(data);
const innactive = document.getElementsByClassName("innactive")[0];
const not_up_to_date = document.getElementsByClassName("not_up_to_date")[0];
const up_to_date = document.getElementsByClassName("up_to_date")[0];
const up_innactive = document.getElementsByClassName("up_innactive")[0];
const finished = document.getElementsByClassName("finished")[0];
const dropped = document.getElementsByClassName("dropped")[0];

$(document).ready(function () {
  for (var i = 0; i < data.length; i++) {
    let card = create_card(data[i], i);
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

const log_out = document.getElementById("log-out");

function update(chapter, webtoon) {
  var form = document.createElement("form");
  var input = document.createElement("input");
  var input2 = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "webtoon");
  input.setAttribute("value", webtoon);
  input2.setAttribute("type", "hidden");
  input2.setAttribute("name", "chapter");
  input2.setAttribute("value", chapter);
  form.setAttribute("method", "post");
  form.setAttribute("action", "/update_chapter");
  form.style.display = "hidden";
  form.appendChild(input);
  form.appendChild(input2);
  document.body.appendChild(form);
  form.submit();
  //reload the page
  //location.reload();
}

function create_card(webtoon, id) {
  //Create all the components
  var card_holder = document.createElement("div");
  var card = document.createElement("div");
  var content_div = document.createElement("div");
  var left_div = document.createElement("div");
  var img = document.createElement("img");
  var right_div = document.createElement("div");
  var rd_content = document.createElement("div");
  var title_link = document.createElement("a");
  var title = document.createElement("h5");
  var last_state_div = document.createElement("div");
  var last_chapter = document.createElement("small");
  var card_state = document.createElement("span");
  var list_but = document.createElement("div");
  var chapter_list = document.createElement("select");
  var button = document.createElement("button");
  var button_div = document.createElement("div");
  var button1_div = document.createElement("div");
  var button1 = document.createElement("button");
  var button2_div = document.createElement("div");
  var button2 = document.createElement("button");

  //Give them classes for styling purposes
  card_holder.className = "col-lg-3 col-md-12 col-12 mb-4";
  card.className = "card custom-card";
  content_div.className = "row p-0 no-gutters";
  left_div.className = "col-md-4 pe-0 img-custom";
  img.className = "card-img";
  right_div.className = "col-md-8 ps-0";
  rd_content.className = "card-body";
  title_link.className = "text-decoration-none";
  title.className = "card-title";
  last_state_div.className = "d-flex justify-content-between";
  last_chapter.className = "text-white";
  let base_color = "";
  switch (webtoon.state) {
    case "innactive":
      card_state.className = "badge rounded-pill text-bg-dark";
      base_color = "dark";
      break;
    case "not_up_to_date":
      card_state.className = "badge rounded-pill text-bg-primary";
      base_color = "primary";
      break;
    case "up_to_date":
      card_state.className = "badge rounded-pill text-bg-secondary";
      base_color = "secondary";
      break;
    case "finished":
      card_state.className = "badge rounded-pill text-bg-success";
      base_color = "success";
      break;
    case "dropped":
      card_state.className = "badge rounded-pill text-bg-danger";
      base_color = "danger";
      break;
    case "up_innactive":
      card_state.className = "badge rounded-pill text-bg-warning";
      base_color = "warning";
      break;
  }
  list_but.className = "col-md-12 d-flex justify-content-end pt-2";
  chapter_list.className = "custom-select mb-2 mt-2 me-2";
  button.className = "btn btn-outline-primary";
  button_div.className = "row mt-0";
  button1_div.className = "col-md-6 pe-0 ";
  button1.className = "btn btn-secondary m-0 p-0 no-border-radius-right";
  button2_div.className = "col-md-6 ps-0";
  if (webtoon.state == "finished") {
    button2.className =
      "btn btn-success m-0 p-0 no-border-radius-left text-center";
  }
  if (webtoon.state == "dropped") {
    button2.className =
      "btn btn-warning m-0 p-0 no-border-radius-left text-center";
  }
  if (webtoon.state != "finished" && webtoon.state != "dropped") {
    button2.className =
      "btn btn-danger m-0 p-0 no-border-radius-left text-center";
  }
  // Elements Login

  // Image
  img.src = webtoon.image;

  // Title
  title.id = "title" + id;
  title_link.href = webtoon.url;
  title_link.target = "_blank";
  let l = 50;
  if (webtoon.name.length > l) {
    webtoon.name = webtoon.name.slice(0, l) + "...";
  }
  title.innerHTML = webtoon.name;

  // Last chapter
  last_chapter.innerHTML =
    "Last: " +
    webtoon.last_chapter_read +
    "/" +
    webtoon.chapter_list[0].chapter.split(" ")[1];

  // State
  card_state.id = "id" + id;
  card_state.innerHTML = webtoon.state.split("_").join(" ");
  card_state.addEventListener("click", function () {
    set_finished(webtoon.url, id);
  });
  card_state.addEventListener("mouseover", function () {
    card_state.className = "badge rounded-pill text-bg-success";
    card_state.innerHTML = "Finished?";
  });
  card_state.addEventListener("mouseout", function () {
    card_state.className = "badge rounded-pill text-bg-" + base_color;
    card_state.innerHTML = webtoon.state.split("_").join(" ");
  });

  // Selector
  chapter_list.id = "chapter-list" + id;
  for (var j = 0; j < webtoon.chapter_list.length; j++) {
    var option = document.createElement("option");
    option.value = webtoon.chapter_list[j].chapter;
    option.innerHTML = webtoon.chapter_list[j].chapter;
    var chiffres = webtoon.chapter_list[j].chapter.split(" ")[1].match(/\d+/g);
    if (chiffres != null) {
      if (webtoon.last_chapter_read == "0") {
        option.selected = true;
      } else if (chiffres[0] == webtoon.last_chapter_read) {
        option.selected = true;
      }
    }
    chapter_list.appendChild(option);
  }

  // Button
  button.innerHTML = "Up";
  button.onclick = function () {
    send_update_request(webtoon.url, id);
  };

  // Button1
  button1.innerHTML = "Read";
  button1.onclick = function () {
    window.open(webtoon.url);
  };

  // Button2
  if (webtoon.state == "finished") {
    button2.innerHTML = "Unfinish";
    button2.onclick = function () {
      set_unfinished(webtoon.url, id);
    };
  } else if (webtoon.state == "dropped") {
    button2.innerHTML = "Undrop";
    button2.onclick = function () {
      set_undrop(webtoon.url, id);
    };
  } else {
    button2.innerHTML = "Drop";
    button2.onclick = function () {
      set_dropped(webtoon.url, id);
    };
  }

  // Hierarchy
  card_holder.appendChild(card);
  card.appendChild(content_div);
  card.appendChild(button_div);
  content_div.appendChild(left_div);
  content_div.appendChild(right_div);
  left_div.appendChild(img);
  right_div.appendChild(rd_content);
  rd_content.appendChild(title_link);
  title_link.appendChild(title);
  rd_content.appendChild(last_state_div);
  rd_content.appendChild(list_but);
  list_but.appendChild(chapter_list);
  list_but.appendChild(button);
  last_state_div.appendChild(last_chapter);
  last_state_div.appendChild(card_state);
  button_div.appendChild(button1_div);
  button_div.appendChild(button2_div);
  button1_div.appendChild(button1);
  button2_div.appendChild(button2);
  return card_holder;
}

function send_update_request(url, id) {
  var selected_chapter = $("#chapter-list" + id).val();
  update(selected_chapter, url);
}

function set_finished(url, id) {
  var selected_webtoon = $("#title" + id)[0].innerHTML;
  console.log(selected_webtoon, url);
  var form = document.createElement("form");
  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "webtoon");
  input.setAttribute("value", url);
  form.setAttribute("method", "post");
  form.setAttribute("action", "/set_finished");
  form.style.display = "hidden";
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

function set_unfinished(url, id) {
  var selected_webtoon = $("#title" + id)[0].innerHTML;
  console.log(selected_webtoon, url);
  var form = document.createElement("form");
  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "webtoon");
  input.setAttribute("value", url);
  form.setAttribute("method", "post");
  form.setAttribute("action", "/set_unfinished");
  form.style.display = "hidden";
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

function set_dropped(url, id) {
  var selected_webtoon = $("#title" + id)[0].innerHTML;
  console.log(selected_webtoon, url);
  var form = document.createElement("form");
  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "webtoon");
  input.setAttribute("value", url);
  form.setAttribute("method", "post");
  form.setAttribute("action", "/set_dropped");
  form.style.display = "hidden";
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

function set_undrop(url, id) {
  var selected_webtoon = $("#title" + id)[0].innerHTML;
  console.log(selected_webtoon, url);
  var form = document.createElement("form");
  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "webtoon");
  input.setAttribute("value", url);
  form.setAttribute("method", "post");
  form.setAttribute("action", "/set_undrop");
  form.style.display = "hidden";
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
