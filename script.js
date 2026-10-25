// Skylona Interior Studio — site behaviour
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var WHATSAPP_NUMBER = "919567747962";

  // ---- Mobile navigation ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  // ---- Header shadow on scroll ----
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Portfolio: show placeholder until a real photo exists ----
  document.querySelectorAll(".work-card img").forEach(function (img) {
    function markMissing() { img.closest(".work-card").classList.add("is-placeholder"); }
    if (img.complete && img.naturalWidth === 0) markMissing();
    img.addEventListener("error", markMissing);
  });

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // ---- Enquiry form -> WhatsApp (no backend) ----
  var form = document.getElementById("enquiry-form");
  var errorEl = document.getElementById("form-error");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.elements.name;
    var location = form.elements.location;
    var missing = [name, location].filter(function (f) { return !f.value.trim(); });

    [name, location].forEach(function (f) { f.classList.toggle("invalid", missing.indexOf(f) !== -1); });
    if (missing.length) {
      errorEl.hidden = false;
      missing[0].focus();
      return;
    }
    errorEl.hidden = true;

    var lines = [
      "Hello Skylona Interior Studio,",
      "",
      "Name: " + name.value.trim(),
      "Project location: " + location.value.trim(),
      "Service: " + form.elements.service.value
    ];
    var message = form.elements.message.value.trim();
    if (message) lines.push("Details: " + message);

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  // ---- Footer year ----
  document.getElementById("year").textContent = new Date().getFullYear();
})();
