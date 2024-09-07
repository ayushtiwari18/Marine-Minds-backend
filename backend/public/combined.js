// Utility function to load HTML content into a specified element
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

// Initialize the scroll sound functionality
function initializeScrollSound() {
  const scrollSound = document.getElementById("scroll-sound");
  let lastScrollTop = 0;
  let isPlaying = false;

  function playScrollSound() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(lastScrollTop - st) <= 5) return;

    if (!isPlaying) {
      scrollSound.play().catch((error) => {
        console.error("Sound playback failed:", error);
      });
      isPlaying = true;

      scrollSound.addEventListener(
        "ended",
        () => {
          isPlaying = false;
        },
        { once: true }
      );
    }

    lastScrollTop = st <= 0 ? 0 : st;
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  window.addEventListener("scroll", debounce(playScrollSound, 150));
}

// Initialize FAQ toggle functionality
function initializeFAQs() {
  const faqSection = document.getElementById("FAQs-section");
  if (!faqSection) return;

  const faqs = faqSection.querySelectorAll("[data-faq]");

  faqs.forEach((faq) => {
    const question = faq.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      faqs.forEach((otherFaq) => {
        if (otherFaq !== faq && otherFaq.classList.contains("open")) {
          otherFaq.classList.remove("open");
        }
      });

      faq.classList.toggle("open");
    });
  });
}

// Initialize card scrolling functionality
function initializeCardScrolling() {
  const cardSection = document.querySelector("#Card-Section");
  if (!cardSection) return;

  const cardContainer = cardSection.querySelector(".card-container");
  if (!cardContainer) return;

  const scrollSpeed = 5;
  let isAutoScrolling = true;
  let scrollAnimationFrame;

  const cards = Array.from(cardContainer.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    cardContainer.appendChild(clone);
  });

  function autoScroll() {
    if (!isAutoScrolling) return;

    cardContainer.scrollLeft += scrollSpeed;
    if (cardContainer.scrollLeft >= cardContainer.scrollWidth / 2) {
      cardContainer.scrollLeft = 0;
    }

    scrollAnimationFrame = requestAnimationFrame(autoScroll);
  }

  function startAutoScroll() {
    if (!isAutoScrolling) {
      isAutoScrolling = true;
      autoScroll();
    }
  }

  function stopAutoScroll() {
    isAutoScrolling = false;
    cancelAnimationFrame(scrollAnimationFrame);
  }

  cardContainer.addEventListener("mouseenter", stopAutoScroll);
  cardContainer.addEventListener("mouseleave", startAutoScroll);
  startAutoScroll();
}

// Newsletter Subscription
function subscribe() {
  const email = document.getElementById("email").value;
  const message = document.getElementById("confirmation-message");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailPattern.test(email)) {
    message.textContent = "Thank you for subscribing!";
    message.style.color = "green";
  } else {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "red";
  }
  message.style.display = "block"; // Show message after checking
}

// Back to Top Button
window.onscroll = function () {
  const backToTop = document.querySelector(".back-to-top");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Show flash messages
function showFlashMessage(message) {
  const flashMessage = document.getElementById("flash-message");
  if (!flashMessage) return;

  flashMessage.textContent = message;
  flashMessage.style.display = "block";
  setTimeout(() => {
    flashMessage.style.display = "none";
  }, 3000);
}

// Initialize contact form submission
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showFlashMessage("Your form has been submitted successfully.");
  });
}

// Select all images within the carousel
const carouselImages = document.querySelectorAll(".carousel-inner img");
let currentImageIndex = 0;

// Function to move to the next image
function nextImage() {
  // Remove the 'active' class from the current image
  carouselImages[currentImageIndex].classList.remove("active-img");

  // Increment the index to move to the next image, wrapping around when it reaches the end
  currentImageIndex = (currentImageIndex + 1) % carouselImages.length;

  // Add the 'active' class to the new current image
  carouselImages[currentImageIndex].classList.add("active-img");
}

// Set an interval to automatically change the image every 5 seconds
setInterval(nextImage, 5000);

// Load all sections and initialize functionalities
document.addEventListener("DOMContentLoaded", () => {
  loadSection("Hero-section", "/Hero Section/hero.html");
  loadSection("Vedio-section", "/Vedio Player/Vedio.html");
  loadSection("Card-Section", "/Card/Card.html", initializeCardScrolling);
  loadSection("hall-of-fame-section", "/Hall Of Fame/hallOfFame.html");
  loadSection("FAQs-section", "/FAQs/FAQs.html", initializeFAQs);
  loadSection("Footer-section", "/Footer/footer.html", () => {
    initializeContactForm();
    subscribe(); // Initialize newsletter subscription
    scrollToTop(); // Initialize scroll to top button
  });

  initializeScrollSound();
});
