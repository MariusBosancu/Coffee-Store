import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 25,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeStores = async (
  latLong = "44.433929603479314%2C26.10284968689389",
  limit = 25
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeStores(latLong, "coffee", limit),
    options
  );
  const data = await response.json();
  // data.results.map((result,idx)=>{
  //     console.log(result.location.address)
  // })

  return data.results.map((result, idx) => {
    return {
      id: result.fsq_id,
      address: result?.location.address
        ? result.location.address
        : "Nu exista adresa",
      name: result.name,
      imgUrl: photos.length > 0 ? photos[idx] : null,
      locality: result?.location.locality
        ? result.location.locality
        : "Fara oras",
    };
  });
};
// o incercare esuata
// const getUrlForCoffeStoresPhotos=(id) =>{

//     return `https://api.foursquare.com/v3/places/${id}/photos?sort=POPULAR`;
// }
// export const fetchCoffeStoresPhotos = async (id) =>{
//     const options = {
//         method: 'GET',
//         headers: {
//             accept: 'application/json',
//             Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY_Photo,
//         },
//     };

//     return {
//         props: {
//           id: getUrlForCoffeStoresPhotos(id),
//         },
//       }
//     console.log(id);
//     const response = await fetch(getUrlForCoffeStores(id), options);

// }
