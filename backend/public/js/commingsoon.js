// Create bubbles
for (let i = 0; i < 20; i++) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.width = `${Math.random() * 30 + 10}px`;
  bubble.style.height = bubble.style.width;
  bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
  bubble.style.animationDelay = `${Math.random() * 5}s`;
  document.body.appendChild(bubble);
}

// Fact rotation
const facts = document.querySelectorAll(".fact");
let currentFact = 0;

function rotateFacts() {
  facts[currentFact].classList.remove("active");
  currentFact = (currentFact + 1) % facts.length;
  facts[currentFact].classList.add("active");
}

setInterval(rotateFacts, 5000);
