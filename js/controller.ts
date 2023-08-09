import { fetchResultsType } from "./types";
import { renderCard, renderError, renderHtml } from "./view";
import { favorites, getData } from "./model";

let transformedData: fetchResultsType["data"];

renderPage();

async function renderPage() {
  try {
    //Fetch data from api
    transformedData = await getData();

    //Home route
    if (window.location.pathname === "/") {
      //render html
      renderHtml(transformedData);

      //add listeners
      favoriteControl();
      searchControl();
      tooltipControl();
    }

    //Favorites route
    if (window.location.pathname === "/favorites.html") {
      renderFavorites(transformedData);
      favoriteControl();
    }
  } catch (err: any) {
    // Error Handle
    console.error(err.message);
    renderError(err.message);
  }
}


// SELECTORS
const favoriteElement = document.querySelectorAll(".favorite-toggle");
const favoritesCharactersList = document.querySelector(
  ".characters-favorites"
)!;
const allCharactersList = document.querySelector(".characters-all")!;
const searchCharacters = document.querySelectorAll(".characters-search")!;

// CONTROL FAVORITES

function favoriteControl() {
  favoriteElement!.forEach((element) =>
    element.addEventListener("click", (event) => {
      const target = event.target as Element;
      const starElement = target.closest(".star");
      if (!starElement) return;

      //Target selectors
      const targetListItem = target.closest(".item")! as HTMLElement;
      const targetId = Number(targetListItem.dataset.id);
      const allTargetElementsId = document.querySelectorAll(
        `[data-id="${targetId}"]`
      );

      //Favorite selectors
      const favoriteElement = favorites?.find(
        (element) => element.id === targetId
      );

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
        favoritesCharactersList
          .querySelector(`[data-id="${targetId}"]`)!
          .remove();
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
        const itemToInject =
          targetListItem.nodeName === "TR"
            ? targetListItem.outerHTML
            : Array.from(
                (allCharactersList!.lastChild! as HTMLElement).children
              ).find((element) => {
                const node = element as HTMLElement;
                return Number(node.dataset.id) === targetId;
              })!.outerHTML;

        favoritesCharactersList.insertAdjacentHTML("beforeend", itemToInject);
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
    searchCharacters.forEach((element) =>
      element.querySelectorAll("tr").forEach((element, i) => {
        if (i === 0) return;
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

// TOOLTIP
function tooltipControl() {
  // Hoover
  searchCharacters.forEach((element) =>
    element.addEventListener("mouseover", (event) => {
      const target = event.target as Element;
      const tvElement = target.closest(".tv-icon");
      if (!tvElement) return;

      tvElement.querySelector(".tooltip")!.classList.remove("hidden");
    })
  );

  // Leave
  searchCharacters.forEach((element) =>
    element.addEventListener("mouseout", (event) => {
      const target = event.target as Element;
      const tvElement = target.closest(".tv-icon");
      if (!tvElement) return;

      tvElement.querySelector(".tooltip")!.classList.add("hidden");
    })
  );
}

// RENDER FAVORITE ROUTE

function renderFavorites(data: fetchResultsType["data"]) {
  const rootElement = document.querySelector(".favorite-favorite-characters")!;
  const onlyFavoritesFilter = data.filter(
    (element) => element.isFavorite === true
  );
  renderCard(onlyFavoritesFilter, rootElement);
}
