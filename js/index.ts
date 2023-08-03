// TYPES

type fetchResultsType = {
  info: {
    count: number;
    totalPages: number;
    previousPage: null | number;
    nextPage: null | number;
  };
  data: {
    _id: number;
    films: string[];
    shortFilms: string[];
    tvShows: string[];
    videoGames: string[];
    parkAttractions: string[];
    allies: string[];
    enemies: string[];
    sourceUrl: string;
    name: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    __v: number;
    isFavorite?: boolean;
  }[];
};

type favoritesType = {
  id: number;
  favorite: boolean;
}[];

//FETCH FROM LOCAL STORAGE
const favorites: favoritesType = JSON.parse(localStorage.getItem("favorites")!);

// DOCUMENT SELECTORS
const allCharactersList = document.querySelector(".characters-all")!;

//FETCH DATA FROM API

async function getData() {
  const url = `https://api.disneyapi.dev/character?pageSize=100`;

  try {
    // Fetch
    const fetchJson = await fetch(url);
    if (!fetchJson.ok)
      throw new Error(`${fetchJson.status}: Something goes wrong`);
    //data transformation
    const data: fetchResultsType = await fetchJson.json();
    const transformedData = dataFavoritesConcat(data);

    console.log(transformedData);
    //render html
    renderList(transformedData, allCharactersList);
  } catch (err) {
    // Error Handle
    console.log(err.message);
  }
}

getData();

//CONCAT FAVORITES WITH FETCHED DATA

function dataFavoritesConcat(data: fetchResultsType) {
  //Filter out results without any film
  const noFilmFilter = data.data.filter(
    (element) => element.films.length === 0
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

//RENDER LIST OF FETCHED ITEMS

function renderList(data: fetchResultsType["data"], htmlElement: Element) {
  const htmlToInject = data
    .map((element) => `<li>${element.name}</li>`)
    .join(" ");

  htmlElement.insertAdjacentHTML("afterbegin", htmlToInject);
}
