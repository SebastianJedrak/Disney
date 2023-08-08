import { fetchResultsType } from "./types";

// DOCUMENT SELECTORS
const allCharactersList = document.querySelector(".characters-all")!;
const favoritesCharactersList = document.querySelector(
  ".characters-favorites"
)!;
const topCharactersList = document.querySelector(".characters-top")!;

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
}

//RENDER LIST OF FETCHED ITEMS
export function renderList(
  data: fetchResultsType["data"],
  htmlElement: Element
) {
  const htmlToInject = data
    .map(
      (element) =>
        ` <tr class="item" data-id=${
          element._id
        } data-name="${element.name.toLowerCase()}" >

        <td><img class="img-thumbnail" src="${element.imageUrl}" alt="${
          element.name
        }"></td>

      <td>
      <span>${element.name}</span> 
      <span class="${element.tvShows.length > 0 && "tv-icon"}">
      <ul class="tooltip hidden">${element.tvShows.map(
        (element) => `<l1>${element}</l1> `
      ).join(" ")}</ul>
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

//RENDER LIST OF FETCHED ITEMS
function renderCard(data: fetchResultsType["data"], htmlElement: Element) {
  const htmlToInject = data
    .map(
      (element) =>
        ` <li class="item card" data-id=${element._id} >

          <img class="img-thumbnail" src="${element.imageUrl}" alt="${
          element.name
        }">

          <div class="row-container">   
            <h5>${element.name}</h5>
            <span class="star ${
              element.isFavorite ? "fill-star" : "empty-star"
            }"></span></div>
     
      <p><span>Films:</span>
      <span>${element.films.length}</span></p>

      <p><span>TV Shows:</span>
      <span>${element.tvShows.length}</span></p>

      </li>
   `
    )
    .join(" ");

  htmlElement.insertAdjacentHTML("afterbegin", htmlToInject);
  htmlElement.classList.add("favorite-toggle");
}
