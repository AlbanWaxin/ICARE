function toggleMode() {
  // Select the element(s) that you want to apply the mode change to
  const elements = document.querySelectorAll(".mode-switchable");

  // Check the current mode of the selected element(s)
  const currentMode = elements[0].classList.contains("night-mode")
    ? "night"
    : "light";

  // Toggle the mode
  if (currentMode === "light") {
    // Change to night mode
    elements.forEach((element) => {
      element.classList.remove("light-mode");
      element.classList.add("night-mode");
    });
  } else {
    // Change to light mode
    elements.forEach((element) => {
      element.classList.remove("night-mode");
      element.classList.add("light-mode");
    });
  }
}

// Call the toggleMode() function when the mode switch is triggered
const modeSwitchButton = document.getElementById("mode-switch-button");
modeSwitchButton.addEventListener("click", toggleMode);
