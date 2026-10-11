"use strict";

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsObserver = "IntersectionObserver" in window;

if (!reducedMotion && supportsObserver) {
  document.documentElement.classList.add("js-reveal");

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px 28px 0px" });

  document.querySelectorAll(".project-card, .section, .contact-section").forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

const internalLinks = [...document.querySelectorAll('a[href^="#"]')];

internalLinks.forEach(link => {
  const hash = link.getAttribute("href");
  if (!hash || hash === "#") return;
  link.addEventListener("click", event => {
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
    if (history.replaceState) history.replaceState(null, "", hash);
  });
});

if (supportsObserver) {
  const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
  const navSections = navLinks
    .map(link => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.getAttribute("href") === "#" + entry.target.id) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-24% 0px -64% 0px" });

  navSections.forEach(section => navObserver.observe(section));
}
