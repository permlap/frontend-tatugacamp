import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

function Index() {
  const [posts, setPosts] = useState();

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => axios("/api/handle-posts").then((res) => res),
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen mt-0 bg-black flex justify-center items-center">
        <div className=" text-white">loading</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen mt-0 bg-black flex justify-center items-center">
        <div className=" text-white">error</div>
      </div>
    );
  }
  const eachPost = data.data.posts.map((list) => {
    return <span key={list._id}>{list.title}</span>;
  });

  return (
    <div className="w-full h-screen mt-0 bg-black flex justify-center items-center">
      <div className=" text-white">{eachPost}</div>
    </div>
  );
}

export default Index;
