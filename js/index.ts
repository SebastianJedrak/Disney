//FETCH DATA FROM API

async function getData() {
  const url = `https://api.disneyapi.dev/character?pageSize=100`;
  
  try {
    // Fetch
    const fetchJson = await fetch(url);
    if (!fetchJson.ok)
      throw new Error(`${fetchJson.status}: Something goes wrong`);
    const data = await fetchJson.json();
    console.log(data);
    return data;

  } catch (err) {
    // Error Handle
    console.log(err.message);

  }
}

getData()