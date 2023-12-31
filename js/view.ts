import { fetchResultsType } from "./types";

// DOCUMENT SELECTORS
const allCharactersList = document.querySelector(".characters-all")!;
const favoritesCharactersList = document.querySelector(
  ".characters-favorites"
)!;
const topCharactersList = document.querySelector(".characters-top")!;
const mainContainer = document.querySelector(".main-section");

//RENDER HTML

export function renderHtml(data: fetchResultsType["data"]) {
  // Render all characters list
  renderList(data, allCharactersList);

  // Render only favorite characters list
  const onlyFavoritesFilter = data.filter(
    (element) => element.isFavorite === true
  );
  renderList(onlyFavoritesFilter, favoritesCharactersList);

  // Render top3 character cards
  const onlyTopThreeFilter = data
    .sort((a, b) => b.films.length - a.films.length)
    .slice(0, 3);
  renderCard(onlyTopThreeFilter, topCharactersList);

  // Render search info
  renderSearchCount(data);
}

//RENDER LIST OF FETCHED ITEMS
export function renderList(
  data: fetchResultsType["data"],
  htmlElement: Element
) {
  const htmlToInject = data
    .map(
      (element) =>
        ` <tr class="item " data-id=${
          element._id
        } data-name="${element.name.toLowerCase()}" >

        <td><img class="img-thumbnail" src="${element.imageUrl}" alt="${
          element.name
        }"></td>

      <td class="table-name">
      <span class="table-title">${element.name}</span> 
      <span class="${element.tvShows.length > 0 && "tv-icon"}">
      <ul class="tooltip hidden"><li>TV Shows:</li>${element.tvShows
        .map((element) => `<l1>- ${element}</l1> `)
        .join("\r\n")}</ul>
      </span>
      </td>

      <td>  <span>${element.films.length}</span></td>

      <td><span class="star ${
        element.isFavorite ? "fill-star" : "empty-star"
      }"></span></td> 

     </tr>`
    )
    .join(" ");

  htmlElement.insertAdjacentHTML("beforeend", htmlToInject);
  htmlElement.classList.add("favorite-toggle");
}

//RENDER LIST OF CARDS
export function renderCard(
  data: fetchResultsType["data"],
  htmlElement: Element
) {
  const htmlToInject = data
    .map(
      (element) =>
        ` <li class="item card  img-card" data-id=${
          element._id
        } style="background-image: url(${element.imageUrl})">

         
<div class="content-card">  
<div class="row-container align-center-container">   
<h5>${element.name}</h5>
<span class="star ${
          element.isFavorite ? "fill-star" : "empty-star"
        }"></span></div>

<p><span>Films:</span>
<span>${element.films.length}</span></p>

<p><span>TV Shows:</span>
<span>${element.tvShows.length}</span></p></div>
        

      </li>
   `
    )
    .join(" ");

  htmlElement.insertAdjacentHTML("afterbegin", htmlToInject);
  htmlElement.classList.add("favorite-toggle");
}

//RENDER SEARCH INFO
function renderSearchCount(data: fetchResultsType["data"]) {
  const htmlToInject = `<h5>Search within a List of ${data.length} Characters with own Films</h5>`;

  document
    .querySelector(".search-container")!
    .insertAdjacentHTML("afterbegin", htmlToInject);
}

//ERROR HANDLING
export function renderError(error: Error) {
  mainContainer!.innerHTML = `<div class="error-text"><h2>${error}</h2><h3>Service might be unavailable, please try again later or check the <a href="https://disneyapi.dev/" target="_blank">API</a></h3></div> status`;
}
