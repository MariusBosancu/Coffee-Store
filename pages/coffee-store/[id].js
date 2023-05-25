import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
//import coffeeStoresData from "../../data/coffee-stores.json"
import styles from "../../styles/coffee-store.module.css";
import fetchCoffeStores from "../../lib/coffee-stores";
import { StoreContext } from "../../store/store-context";
import { useContext, useEffect, useState } from "react";
import { fetcher, isEmpty } from "../../utils/index";
import useSWR from "swr";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeStores = await fetchCoffeStores();
  const findCoffeeStoreById = coffeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id; //dynamic id
  });
  return {
    props: {
      coffeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}
const getAPI = () => {
  return `https://capco92-test.ratiopartners.co.uk/api/sitecore/Intelligences/ESGarticles?currentpage=1&type=`;
};

export async function getStaticPaths() {
  const coffeeStoresData = await fetchCoffeStores();
  const paths = coffeeStoresData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeStore || {});
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, locality, address } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          locality: locality || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
    //in loc de try ul de sus , putem folosi {data,err} = useSWR('/api/path' , fetcher) //cauta data in catch si o actualizeaza cu una noua
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeStore)) {
      if (coffeeStores.length > 0) {
        const CoffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        setCoffeeStore(CoffeeStoreFromContext);
        handleCreateCoffeeStore(CoffeeStoreFromContext);
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeStore); //aici
    }
  }, [id, initialProps.coffeStore, coffeeStores]);

  const { address = "", name = "", imgUrl = "", locality = "" } = coffeeStore;
  const [votingCount, setVotingCount] = useState(0);
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (router.isFallback) {
    return <div>Loading...</div>; //daca nu-l gaseste in static path , merge in static props si il cauta
  }

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/updateCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }

    try {
      const alo2 = await fetch(
        "https://capco92-test.ratiopartners.co.uk/api/sitecore/Intelligences/ESGarticles?currentpage=1&type="
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
      console.log(alo2);
      const { title, name } = initialProps.coffeStore;
      const response2 = await fetch(
        "https://capco92-test.ratiopartners.co.uk/api/sitecore/Intelligences/ESGarticles?currentpage=1&type=",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, name }),
        }
      );
      console.log(response2);
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong by SWR</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/" legacyBehavior>
              <a>Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={{ name } || "altImage"}
          ></Image>
        </div>
        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {locality && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="icon"
              />
              <p className={styles.text}>{locality}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
