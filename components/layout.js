import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Lottie from "lottie-react";
import { useRouter } from "next/router";
import * as animationData from "../components/LoadingScreen.json";
function Layout({ children, unLoading }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //check whether there is any loading from the borwser
  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = (url) => url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);
  return (
    <>
      <main>
        {loading && !unLoading && (
          <div className="fixed z-50 flex items-center justify-center w-screen h-full top-[0%] left-[0%] mt-[0px] bg-white">
            <Lottie
              animationData={animationData}
              height={200}
              loop={true}
              width={200}
            />
          </div>
        )}
        <Navbar />
        <section>{children}</section>
      </main>
    </>
  );
}

export default Layout;
