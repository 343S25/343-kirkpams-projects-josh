const myModal = new bootstrap.Modal('#modal-3', {
  keyboard: false
});



function load(objectString) {
  let arr = JSON.parse(objectString);
  const template = document.getElementById("columns-3");
  const gridPlace = document.getElementById("grid-place-3");
  gridPlace.replaceChildren();
  for (let obj of arr) {
    const column = template.content.cloneNode(true);
    const cardImage = column.querySelector("img");
    cardImage.src = obj.img.src;
    cardImage.alt = obj.img.alt;
    cardImage.setAttribute("loading", "lazy");
    column.querySelector("h2").textContent = obj.title;
    column.querySelector("p").textContent = obj.text;
    gridPlace.append(column);
  }
  const spinner = document.querySelector(".spinner-wrapper");
  setTimeout(() => {
    spinner.style.opacity = "0";
    setTimeout(() => {
      spinner.style.display = "none";
    }, 2000);
  }, 1000);

  eventListeners();
}

function eventListeners() {
  const searchbar = document.getElementById("search-box-3");
  searchbar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const grid = document.getElementById("grid-place-3");
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
  const cards = document.querySelectorAll(".card");
  // for each card we add an event listener for the modal
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const modalLabel = document.getElementById("modalLabel-3");
      const modalBody = document.querySelector(".modal-body-3");
      modalLabel.textContent = card.querySelector("h2").textContent;

      let dummy = document.createElement("div");
      let obj = JSON.parse(localStorage.getItem("favorites")).filter(favorite => favorite.title == modalLabel.textContent)[0];
      dummy.innerHTML = obj.extract;
      let element = dummy.children[0];
      element.contentEditable = true;
      // gets rid of children
      modalBody.replaceChildren();
      modalBody.append(element);
      myModal.show();
    });
  });


}

function exportClick(ev) {
  const items = JSON.parse(localStorage.getItem("favorites"));
  const state = { items: items };
  const string = JSON.stringify(state);
  const encoded = encodeURIComponent(string);
  const dataURL = `data:application/json;charset=utf-8,${encoded}`;


  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "favorites.json";

  link.click();
}


function importClick(ev) {
  ev.preventDefault();
  const importField = document.getElementById("import-file");
  if (importField.files.length == 0) {
    alert("Please Select a File");
  } else {
    const files = importField.files;
    const reader = new FileReader();
    reader.addEventListener('load', loadedJSON);
    reader.readAsText(files[0]);
  }

}

function loadedJSON(ev) {

  const text = ev.target.result;

  const decoded = JSON.parse(text);
  const items = decoded.items;
  let favs = localStorage.getItem("favorites");
  if (favs == null) {
    localStorage.setItem("favorites", JSON.stringify(items));
    load(localStorage.getItem("favorites"));
  } else {
    let added = JSON.parse(favs).concat(items);
    localStorage.setItem("favorites", JSON.stringify(added));
    load(localStorage.getItem("favorites"));
  }
}




function noFavorites() {
  const grid = document.getElementById("grid-place-3");
  // there's always one child left over after the remove statement else runs with one
  // card left
  grid.replaceChildren();
  const h2 = document.createElement("h2");
  h2.style.display = "flex";
  h2.style.justifyContent = "center";
  h2.style.marginTop = "10rem";
  h2.textContent = "You currently have no favorites!!!☹️";
  grid.append(h2);
  const spinner = document.querySelector(".spinner-wrapper");
  setTimeout(() => {
    spinner.style.opacity = "0";
    setTimeout(() => {
      spinner.style.display = "none";
    }, 2000);
  }, 1000);
}
async function main() {
  let value = localStorage.getItem("favorites");
  value == null ? noFavorites() : load(value);
  document.querySelectorAll("button")[1].style.display = 'none';
  document.getElementById("export").addEventListener('click', exportClick);
  document.getElementById("import-form").addEventListener('submit', importClick);


  document.getElementById("remove").addEventListener('click', (e) => {
    const modalLabel = document.getElementById("modalLabel-3");
    let arr = JSON.parse(localStorage.getItem("favorites")).filter(favorite => favorite.title != modalLabel.textContent);
    if (arr.length != 0) {
      localStorage.setItem("favorites", JSON.stringify(arr));
      load(localStorage.getItem("favorites"));
      eventListeners();
      myModal.hide();
    } else {
      localStorage.removeItem("favorites");
      myModal.hide();
      noFavorites();
    }
  });

  document.getElementById("save-3").addEventListener("click", (e) => {
    const modalLabel = document.getElementById("modalLabel-3");
    let body = document.querySelector(".modal-body-3");
    let index = JSON.parse(localStorage.getItem("favorites")).findIndex(favorite => favorite.title == modalLabel.textContent);
    let text = body.children[0].outerHTML;
    let newArr = JSON.parse(localStorage.getItem("favorites"))
    newArr[index].extract = text;
    localStorage.setItem("favorites", JSON.stringify(newArr));
    myModal.hide();
  });


}

(function() {
  main();
})();
