import Head from "next/head";
import Image from "next/image";
import React, { useContext } from "react";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { fetchCoffeStores } from "../lib/coffee-stores";
// import coffeStoresData from "../data/coffee-stores.json";
import { useEffect } from "react";
import useTrackLocation from "../hooks/use-track-location";
// import { useState } from "react";
import { ACTION_TYPES, StoreContext } from "@/store/store-context";
import { stringify } from "querystring";

export async function getStaticProps() {
  //server side
  //daca nu aveam importat deja , faceam fetch(coffestores)

  if (
    !process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY &&
    !process.env.NEXT_PUBLIC_AIRTABLE_API_KEY &&
    !process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY &&
    !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  ) {
    return {
      redirect: {
        destination: "/problem",
        permanent: false,
      },
    };
  }
  const coffeStoreCode = await fetchCoffeStores();

  return {
    props: {
      coffestores: coffeStoreCode,
    },
  };
}

export default function Home(props: {
  coffestores: { name: any; imgUrl: any; id: any }[];
}) {
  //client side

  const {
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
    //latLong,
  } = useTrackLocation();
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;
  //const [coffeeStoresByLoc , setCoffeeStoresByLoc] = useState('');
  useEffect(() => {
    async function setCoffeStoresByLocation() {
      if (latLong) {
        try {
          const fetchedCoffeStores = await fetchCoffeStores(latLong, 30);
          //setCoffeeStoresByLoc(fetchedCoffeStores);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: fetchedCoffeStores,
            },
          });
        } catch (error) {
          //set error
          console.log({ error });
        }
      }
    }
    setCoffeStoresByLocation();
  }, [latLong, dispatch]);

  const handleonBannerBtnClick = () => {
    handleTrackLocation();
  };

  // const {prefix,width,height,suffix} = getURL();
  // const url = `${prefix}${width}x${height}${suffix}`;
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleonBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong : {locationErrorMsg}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>
        {coffeeStores.length > 0 ? (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}>Stores near me</h2>
              <div className={styles.cardLayout}>
                {coffeeStores.map(
                  (coffestores: { name: any; imgUrl: any; id: any }) => {
                    return (
                      <Card
                        name={coffestores.name}
                        imgUrl={
                          coffestores.imgUrl ||
                          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        }
                        href={`/coffee-store/${coffestores.id}`} // `` intre astea poti pune un string care contine variabile
                        className={styles.card}
                        key={coffestores.id}
                      />
                    );
                  }
                )}
              </div>
            </div>
          </>
        ) : props.coffestores.length > 0 ? (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}>Bucuresti stores</h2>
              <div className={styles.cardLayout}>
                {props.coffestores.map(
                  (coffestores: { name: any; imgUrl: any; id: any }) => {
                    return (
                      <Card
                        name={coffestores.name}
                        imgUrl={
                          coffestores.imgUrl ||
                          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        }
                        href={`/coffee-store/${coffestores.id}`} // `` intre astea poti pune un string care contine variabile
                        className={styles.card}
                        key={coffestores.id}
                      />
                    );
                  }
                )}
              </div>
            </div>
          </>
        ) : (
          <p></p>
        )}
      </main>
    </div>
  );
}
