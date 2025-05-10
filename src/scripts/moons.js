async function getMoons() {
  const template = document.getElementById("columns-2");
  for (let moon of moons) {
    let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${moon}_(moon)`;

    let data = await fetch(url);
    let json = await data.json();
    const column = template.content.cloneNode(true);
    let title = moon;
    let extract = json.extract_html;
    let img =
      json.thumbnail == null
        ? "./imgs/moon.jpg"
        : json.thumbnail.source;
    let text =
      json.description == null
        ? "no description for this moon"
        : json.description;
    /*Later on get the extract from the api here */
    let cardImage = column.querySelector("img");
    cardImage.src = img;
    cardImage.alt = title;
    cardImage.setAttribute("loading", "lazy");
    column.querySelector("h2").textContent = moon;
    column.querySelector("p").textContent = text;
    const gridPlace = document.getElementById("grid-place");
    let columns = localStorage.getItem("moons");
    let arr = columns == null ? [] : JSON.parse(columns);
    let obj = {
      title: moon,
      img: { src: img, alt: moon },
      text: text,
      extract: extract
    };
    arr.push(obj);
    localStorage.setItem("moons", JSON.stringify(arr));
    gridPlace.append(column);
  }

  const spinner = document.querySelector(".spinner-wrapper");
  setTimeout(() => {
    spinner.style.opacity = "0";
    setTimeout(() => {
      spinner.style.display = "none";
    }, 2000);
  }, 1000);
}

function loadMoons(objectString) {
  let arr = JSON.parse(objectString);
  const template = document.getElementById("columns-2");
  const gridPlace = document.getElementById("grid-place");
  for (let moon of arr) {
    const column = template.content.cloneNode(true);
    const cardImage = column.querySelector("img");
    cardImage.src = moon.img.src;
    cardImage.alt = moon.img.alt;
    cardImage.setAttribute("loading", "lazy");
    column.querySelector("h2").textContent = moon.title;
    column.querySelector("p").textContent = moon.text;
    gridPlace.append(column);
  }
  const spinner = document.querySelector(".spinner-wrapper");
  setTimeout(() => {
    spinner.style.opacity = "0";
    setTimeout(() => {
      spinner.style.display = "none";
    }, 2000);
  }, 1000);
}

function eventListeners() {
  const searchbar = document.getElementById("search-box");
  searchbar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const grid = document.getElementById("grid-place");
    const cols = grid.querySelectorAll(".col");
    if (searchTerm === "") {
      for (const col of cols) {
        col.style.display = "block";
      }
    } else {
      for (const col of cols) {
        const itemText = col
          .querySelector("h2")
          .textContent.toLowerCase();
        if (itemText.includes(searchTerm)) {
          col.style.display = "block";
        } else {
          col.style.display = "none";
        }
      }
    }
  });
  const myModal = new bootstrap.Modal('#modal', {
    keyboard: false
  });

  const cards = document.querySelectorAll(".card");
  // for each card we add an event listener for the modal
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const modalLabel = document.getElementById("modalLabel-2");
      const modalBody = document.querySelector(".modal-body");
      modalLabel.textContent = card.querySelector("h2").textContent;

      let dummy = document.createElement("div");
      let obj = JSON.parse(localStorage.getItem("moons")).filter(moon => moon.title == modalLabel.textContent)[0];
      dummy.innerHTML = obj.extract;
      let element = dummy.children[0];
      // gets rid of children
      modalBody.replaceChildren();
      modalBody.append(element);
      myModal.show();
    });
  });

  const favoriteButton = document.getElementById("favorite-2");
  const modalLabel = document.getElementById("modalLabel-2");
  favoriteButton.addEventListener('click', (e) => {
    let moon = JSON.parse(localStorage.getItem("moons")).filter(planet => planet.title == modalLabel.textContent)[0];
    let contents = localStorage.getItem("favorites");
    let arr = contents == null ? [] : JSON.parse(contents);
    arr.push(moon);
    localStorage.setItem("favorites", JSON.stringify(arr));
  });

}
async function main() {
  let value = localStorage.getItem("moons");
  value == null ? await getMoons() : loadMoons(value);
  document.querySelectorAll("button")[1].style.display = 'none';
  eventListeners();
}

(function() {
  main();
})();
