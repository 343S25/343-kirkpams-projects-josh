async function getMoons() {
  const template = document.getElementById("columns");
  for (let moon of moons) {
    let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${moon}_(moon)`;

    let data = await fetch(url);
    let json = await data.json();
    const column = template.content.cloneNode(true);
    let title = moon;
    let img =
      json.thumbnail == null
        ? "./imgs/moon.jpg"
        : json.thumbnail.source;
    let text =
      json.description == null
        ? "no description for this moon"
        : json.description;
    /*Later on get the extract from the api here */
    let cardImage = column.querySelector("#card-image");
    cardImage.src = img;
    cardImage.alt = title;
    column.querySelector("#card-h2").textContent = moon;
    column.querySelector("#card-p").textContent = text;
    const gridPlace = document.getElementById("grid-place");
    let columns = localStorage.getItem("moons");
    let arr = columns == null ? [] : JSON.parse(columns);
    let obj = {
      title: moon,
      img: { src: img, alt: moon },
      text: text,
    };
    arr.push(obj);
    localStorage.setItem("moons", JSON.stringify(arr));
    gridPlace.append(column);
  }
}

function loadMoons(objectString) {
  let arr = JSON.parse(objectString);
  const template = document.getElementById("columns");
  const gridPlace = document.getElementById("grid-place");
  for (let moon of arr) {
    const column = template.content.cloneNode(true);
    const cardImage = column.querySelector("#card-image");
    cardImage.src = moon.img.src;
    cardImage.alt = moon.img.alt;
    column.querySelector("#card-h2").textContent = moon.title;
    column.querySelector("#card-p").textContent = moon.text;
    gridPlace.append(column);
  }
}

(function () {
  let value = localStorage.getItem("moons");
  value == null ? getMoons() : loadMoons(value);
})();
