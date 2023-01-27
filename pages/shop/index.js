import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Index({}) {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  return (
    <div>
      <div>
        {hasWindow && (
          <ReactPlayer controls url="https://vimeo.com/792099002"></ReactPlayer>
        )}
      </div>
    </div>
  );
}

export default Index;
