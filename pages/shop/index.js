import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { sanityClient } from "../../sanity";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Index({ data }) {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  return <div></div>;
}

export default Index;

export const getServerSideProps = async (ctx) => {
  const query = `*[_type == "post"]{
    slug
  }`;
  const data = await sanityClient.fetch(query);
  return {
    props: {
      data,
    },
  };
};
