(function () {
  const spinner = document.querySelector(".spinner-wrapper");
  window.addEventListener("load", (e) => {
    setTimeout(() => {
      spinner.style.opacity = "0";
      setTimeout(() => {
        spinner.style.display = "none";
      }, 2000);
    }, 1000);
  });
})();
