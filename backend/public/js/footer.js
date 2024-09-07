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
