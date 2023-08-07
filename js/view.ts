import { fetchResultsType, favoritesType } from "./types";
import { emptyStar, fillStar } from "./icons";

// DOCUMENT SELECTORS
const allCharactersList = document.querySelector(".characters-all")!;
const favoritesCharactersList = document.querySelector(
  ".characters-favorites"
)!;
const topCharactersList = document.querySelector(".characters-top")!;

//RENDER HTML

export function renderHtml(data: fetchResultsType["data"]) {
  // Render all characters list
  renderList(data, allCharactersList, "list");

  // Render only favorite characters list
  const onlyFavoritesFilter = data.filter(
    (element) => element.isFavorite === true
  );
  renderList(onlyFavoritesFilter, favoritesCharactersList, "list");

  // Render top3 character cards
  const onlyTopThreeFilter = data
    .sort((a, b) => b.films.length - a.films.length)
    .slice(0, 3);
  renderList(onlyTopThreeFilter, topCharactersList, "card");
}

//RENDER LIST OF FETCHED ITEMS

/**
 * Render array of data in UI
 * @data array od data
 * @htmlElement parent html element to inject html
 * @type type of rendered element
 */
function renderList(
  data: fetchResultsType["data"],
  htmlElement: Element,
  type: "list" | "card"
) {
  const htmlToInject = data
    .map(
      (element) => `
      <li data-id=${element._id}>
      <img src="${element.imageUrl}" alt="${element.name}">
  
      <span>${element.name}</span>
  
      ${
        type === "list"
          ? `<span>${"TV"}</span>`
          : `<span>TV Shows:</span><span>${element.tvShows.length}</span>`
      }
  
      ${
        type === "list"
          ? `<span>${element.films.length}</span>`
          : `<span>Films:</span><span>${element.films.length}</span>`
      }
      
      ${element.isFavorite ? fillStar : emptyStar}
      </li>`
    )
    .join(" ");

  htmlElement.insertAdjacentHTML("afterbegin", htmlToInject);
  htmlElement.classList.add("favorite-toggle")
}
