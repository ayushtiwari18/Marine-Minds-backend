function showFlashMessage(gameName) {
  const flashMessage = document.getElementById("flash-message");
  flashMessage.textContent = `You have selected the ${gameName} game.`;
  flashMessage.style.display = "block";
  setTimeout(function () {
    flashMessage.style.display = "none";
  }, 3000);
}

function loadSection(sectionId, filePath, callback) {
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById(sectionId).innerHTML = html;
      if (callback) callback(); // Call the callback function after content loads
    })
    .catch((error) => {
      console.error("Error loading section:", error);
    });
}

// Load sections and initialize specific functionalities once they are loaded
document.addEventListener("DOMContentLoaded", () => {
  loadSection("footer-section", "/Footer/footer.html");
});
