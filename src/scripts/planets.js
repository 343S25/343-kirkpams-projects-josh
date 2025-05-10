async function getPlanets() {
  const template = document.getElementById("columns");
  let count = 1;
  for (let planet of planets) {
    let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${planet}_(planet)`;

    let data = await fetch(url);
    let json = await data.json();
    const column = template.content.cloneNode(true);
    let title = planet;
    let img = json.thumbnail.source;
    let text = json.description;
    let extract = json.extract_html;
    /*Later on get the extract from the api here */
    let cardImage = column.querySelector("img");
    cardImage.src = img;
    cardImage.alt = title;
    cardImage.setAttribute("loading", "lazy");
    column.querySelector("h2").textContent = planet;
    column.querySelector("p").textContent = text;
    const gridPlace = document.getElementById("grid-place2");
    let columns = localStorage.getItem("planets");
    let arr = columns == null ? [] : JSON.parse(columns);
    let obj = {
      title: title,
      img: { src: img, alt: planet },
      text: text,
      extract: extract
    };
    arr.push(obj);
    localStorage.setItem("planets", JSON.stringify(arr));
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

function loadPlanets() {
  const template = document.getElementById("columns");
  let objs = JSON.parse(localStorage.getItem("planets"));
  for (const obj of objs) {
    const column = template.content.cloneNode(true);
    const image = column.querySelector("img");
    const title = column.querySelector("h2");
    const p = column.querySelector("p");
    image.src = obj.img.src;
    image.alt = obj.img.alt;
    image.setAttribute("loading", "lazy");
    title.textContent = obj.title;
    p.textContent = obj.text;
    const gridPlace = document.getElementById("grid-place2");
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
    const grid = document.getElementById("grid-place2");
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
  console.log(cards.length);
  // for each card we add an event listener for the modal
  cards.forEach((card) => {
    console.log(card);
    card.addEventListener('click', (e) => {
      const modalLabel = document.getElementById("modalLabel");
      const modalBody = document.querySelector(".modal-body");
      modalLabel.textContent = card.querySelector("h2").textContent;

      let dummy = document.createElement("div");
      let obj = JSON.parse(localStorage.getItem("planets")).filter(planet => planet.title == modalLabel.textContent)[0];
      dummy.innerHTML = obj.extract;
      let element = dummy.children[0];
      // gets rid of children
      modalBody.replaceChildren();
      modalBody.append(element);
      myModal.show();
    });
  });


  const favoriteButton = document.getElementById("favorite-1");
  const modalLabel = document.getElementById("modalLabel");
  favoriteButton.addEventListener('click', (e) => {
    let planet = JSON.parse(localStorage.getItem("planets")).filter(planet => planet.title == modalLabel.textContent)[0];
    let contents = localStorage.getItem("favorites");
    let arr = contents == null ? [] : JSON.parse(contents);
    arr.push(planet);
    localStorage.setItem("favorites", JSON.stringify(arr));
  });
}

async function main() {
  let value = localStorage.getItem("planets");
  // I want to hide the search button it's requiring it but it's dumb
  document.querySelectorAll("button")[1].style.display = 'none';
  value == null ? await getPlanets() : loadPlanets();

  eventListeners();
}

(function() {
  main();
})();
