async function getPlanets() {
  const template = document.getElementById("columns");
  for (let planet of planets) {
    let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${planet}_(planet)`;

    let data = await fetch(url);
    let json = await data.json();
    const column = template.content.cloneNode(true);
    let title = planet;
    let img = json.thumbnail.source;
    let text = json.description;
    /*Later on get the extract from the api here */
    let cardImage = column.querySelector("#card-image");
    cardImage.src = img;
    cardImage.alt = title;
    column.querySelector("#card-h2").textContent = planet;
    column.querySelector("#card-p").textContent = text;
    const gridPlace = document.getElementById("grid-place");
    gridPlace.append(column);
  }
}

(function () {
  getPlanets();
})();
