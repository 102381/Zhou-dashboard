const saved = localStorage.getItem("theme");
if (saved === "light") {
  document.documentElement.setAttribute("class", "");
} else {
  document.documentElement.setAttribute("class", "dark");
}
