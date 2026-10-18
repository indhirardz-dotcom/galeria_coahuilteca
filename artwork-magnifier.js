(() => {
  const selector = [
    ".work:not(.shipping-card) .work-image",
    ".product .product-image",
    ".work-figure:not(.work-detail)",
    ".card-media",
    ".hero-media",
    ".visual-story figure:not(.process-photo)",
    ".detail-strip figure:first-child",
    ".serie-imagen",
    "#trazos-san-miguel-collection a[href*='/trazos-san-miguel']",
    "#trazos-san-miguel-collection a[href*='/fermigrante']"
  ].join(",");

  function enhance(element) {
    if (!element || !element.matches || !element.matches(selector)) return;
    element.classList.add("artwork-magnifier");
    const image = element.querySelector("img");
    if (image && image.style.transform) {
      element.style.setProperty("--artwork-base-transform", image.style.transform);
      image.style.removeProperty("transform");
    }
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(selector).forEach(enhance);
    if (root.matches && root.matches(selector)) enhance(root);
  }

  scan(document);
  new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === 1) scan(node);
    }));
  }).observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    const element = event.target.closest && event.target.closest(selector);
    if (!element) return;
    enhance(element);
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    element.style.setProperty("--artwork-zoom-x", x + "%");
    element.style.setProperty("--artwork-zoom-y", y + "%");
  }, { passive: true });

  document.addEventListener("pointerout", event => {
    const element = event.target.closest && event.target.closest(selector);
    if (!element || (event.relatedTarget && element.contains(event.relatedTarget))) return;
    element.style.removeProperty("--artwork-zoom-x");
    element.style.removeProperty("--artwork-zoom-y");
  });
})();
