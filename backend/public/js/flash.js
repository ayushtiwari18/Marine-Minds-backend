function showFlashMessage(gameName) {
  const flashMessage = document.getElementById("flash-message");
  flashMessage.textContent = `You have selected the ${gameName} game.`;
  flashMessage.style.display = "block";
  setTimeout(function () {
    flashMessage.style.display = "none";
  }, 3000);
}
