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
  }[];
};

type favoritesType = {
  id: number;
  favorite: boolean;
};

//FETCH DATA FROM API

async function getData() {
  const url = `https://api.disneyapi.dev/character?pageSize=100`;

  try {
    // Fetch
    const fetchJson = await fetch(url);
    if (!fetchJson.ok)
      throw new Error(`${fetchJson.status}: Something goes wrong`);
    const data: fetchResultsType = await fetchJson.json();
    console.log(data.data);
    return data;
  } catch (err) {
    // Error Handle
    console.log(err.message);
  }
}

getData();

//CONCAT FAVORITES WITH FETCHED DATA

function dataFavoritesConcat(data: fetchResultsType) {
  const resultsFavoriteConcat = data;
}

//RENDER LIST OF FETCHED ITEMS

function renderList(
  data: fetchResultsType,
  //Type to add
  htmlElement
) {
  const htmlToInject = ``;

  htmlElement.insertAdjacentHTML("afterbegin", htmlToInject);
}
