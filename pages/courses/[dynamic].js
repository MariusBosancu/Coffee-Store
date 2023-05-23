import { useRouter } from "next/router";
import Head from "next/head";
const DynamicRoute = () => {
    const router = useRouter();
    const query = router.query.dynamic;
    return <>
        <Head><title>{query}</title></Head>
        <h1>I am dynamic route , {query}</h1>
    </>

}
export default DynamicRoute;