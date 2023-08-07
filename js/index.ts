import { fetchResultsType, favoritesType } from "./types";
import { renderHtml } from "./view";

//FETCH FROM LOCAL STORAGE
if (!JSON.parse(localStorage.getItem("favorites")!))
  localStorage.setItem("favorites", "[]");
let favorites: favoritesType = JSON.parse(localStorage.getItem("favorites")!);

//FETCH DATA FROM API
let transformedData: fetchResultsType["data"];

async function getData() {
  const url = `https://api.disneyapi.dev/character?pageSize=100`;

  try {
    // Fetch
    const fetchJson = await fetch(url);
    if (!fetchJson.ok)
      throw new Error(`${fetchJson.status}: Something goes wrong`);
    //data transformation
    const data: fetchResultsType = await fetchJson.json();
    transformedData = dataFavoritesConcat(data);

    //render html
    renderHtml(transformedData);

    //add listeners
    favoriteControl();
    searchControl();
  } catch (err) {
    // Error Handle
    console.error(err.message);
  }
}

getData();

//CONCAT FAVORITES WITH FETCHED DATA

function dataFavoritesConcat(data: fetchResultsType) {
  //Filter out results without any film
  const noFilmFilter = data.data.filter(
    (element) => element.films.length !== 0
  );

  //Concat fetched data with favorite
  const resultsFavoriteConcat = noFilmFilter.map((element) => {
    // Match fetched data with favorite
    let isOnFavoriteList: boolean;
    if (favorites) {
      isOnFavoriteList = favorites.some(
        (favoriteElement) => favoriteElement.id === element._id
      );
    } else {
      isOnFavoriteList = false;
    }

    return { ...element, isFavorite: isOnFavoriteList };
  });

  return resultsFavoriteConcat;
}

// CONTROL FAVORITES

function favoriteControl() {
  const favoriteElement = document.querySelectorAll(".favorite-toggle");

  favoriteElement?.forEach((element) =>
    element.addEventListener("click", (event) => {
      const target = event.target as Element;
      const starElement = target.closest(".star");
      if (!starElement) return;

      //Target selectors
      const targetListItem = target.closest("tr")!;
      const targetId = Number(targetListItem.dataset.id);
      const allTargetElementsId = document.querySelectorAll(
        `[data-id="${targetId}"]`
      );

      //Favorite selectors
      const favoriteElement = favorites?.find(
        (element) => element.id === targetId
      );
      const favoritesCharactersList = document.querySelector(
        ".characters-favorites"
      )!;

      // Remove from favorites
      if (favoriteElement) {
        // update local storage
        favorites.splice(favorites.indexOf(favoriteElement), 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        // change icon
        allTargetElementsId.forEach((element) => {
          const starChild = element.querySelector(".star")!;
          starChild.classList.remove("fill-star");
          starChild.classList.add("empty-star");
        });

        // update ui
        favoritesCharactersList.querySelector(
          `[data-id="${targetId}"]`
        )!.outerHTML = "";
      }

      // Add to favorites
      if (!favoriteElement) {
        // update local storage
        favorites.push({ id: targetId, favorite: true });
        localStorage.setItem("favorites", JSON.stringify(favorites));

        // change icon
        allTargetElementsId.forEach((element) => {
          const starChild = element.querySelector(".star")!;
          starChild.classList.remove("empty-star");
          starChild.classList.add("fill-star");
        });

        // update ui
        favoritesCharactersList.insertAdjacentHTML(
          "afterbegin",
          targetListItem.outerHTML
        );
      }
    })
  );
}

// SEARCH
const searchBar = document.querySelector(".search-bar");
function searchControl() {
  searchBar!.addEventListener("input", (event) => {
    //Selectors
    const target = event.target! as HTMLInputElement;
    const inputValue = target.value.toLowerCase();
    document.querySelectorAll(".characters-search")!.forEach((element) =>
      element.querySelectorAll("tr").forEach((element) => {
        //Output data
        if (!element.dataset.name!.includes(inputValue)) {
          element.classList.add("hidden");
        }
        if (element.dataset.name!.includes(inputValue)) {
          element.classList.remove("hidden");
        }
      })
    );
  });
}
