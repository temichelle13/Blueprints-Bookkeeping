(function () {
  var t = localStorage.getItem("theme");
  if (t === "light") document.documentElement.classList.add("light");

  function load(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  load(
    "https://chimpstatic.com/mcjs-connected/js/users/759d861480fdc1e0a17ad3a26/d1018325ba4b9577f2298b828.js",
  );

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  load("https://www.googletagmanager.com/gtm.js?id=GTM-5T5S2TFG");

  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", "G-XYLJ9XZ2SL");
  load("https://www.googletagmanager.com/gtag/js?id=G-XYLJ9XZ2SL");
})();
