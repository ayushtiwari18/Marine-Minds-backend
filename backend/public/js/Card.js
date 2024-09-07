// Function to initialize card scrolling
function initializeCardScrolling() {
  const cardSection = document.querySelector("#Card-Section"); // Ensure this ID matches the card section in your HTML
  const cardContainer = cardSection.querySelector(".card-container"); // Select the card container

  // Check if the elements exist before proceeding
  if (!cardSection || !cardContainer) {
    console.error("Required elements are not found in the DOM.");
    return;
  }

  const scrollSpeed = 5; // Adjust scroll speed for faster or slower scrolling
  let isAutoScrolling = true;
  let scrollAnimationFrame;

  // Clone cards to create a seamless loop
  const cards = Array.from(cardContainer.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    cardContainer.appendChild(clone);
  });

  // Function to auto-scroll the cards
  function autoScroll() {
    if (!isAutoScrolling) return;

    cardContainer.scrollLeft += scrollSpeed;

    // Reset scroll position when reaching the end of the first set of cards
    if (cardContainer.scrollLeft >= cardContainer.scrollWidth / 2) {
      cardContainer.scrollLeft = 0;
    }

    scrollAnimationFrame = requestAnimationFrame(autoScroll);
  }

  // Function to start auto-scrolling
  function startAutoScroll() {
    if (!isAutoScrolling) {
      isAutoScrolling = true;
      autoScroll();
    }
  }

  // Function to stop auto-scrolling
  function stopAutoScroll() {
    isAutoScrolling = false;
    cancelAnimationFrame(scrollAnimationFrame);
  }

  // Event listeners for hover functionality
  cardContainer.addEventListener("mouseenter", stopAutoScroll);
  cardContainer.addEventListener("mouseleave", startAutoScroll);

  // Start auto-scrolling
  startAutoScroll();
}

// Load sections and initialize specific functionalities once they are loaded
document.addEventListener("DOMContentLoaded", () => {
  loadSection("Card-Section", "/Card/Card.html", initializeCardScrolling); // Make sure the ID matches and the correct path to Card.html is set
});
