let form = document.getElementById("form");

document.getElementById("add").addEventListener("click", function () {
  let new_input = document.createElement("input");
  new_input.setAttribute("type", "text");
  new_input.setAttribute("name", "link" + (+form.children.length + 1));
  new_input.setAttribute("placeholder", "add a Link");
  new_input.setAttribute("class", "form-control form-control-lg my-2");
  new_input.setAttribute("id", +form.children.length + 1);
  form.appendChild(new_input);
});
