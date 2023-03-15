import React from "react";
import * as animationData from "../LoadingScreen.json";
import Lottie from "lottie-react";

function FullScreenLoading() {
  return (
    <div className="fixed z-50 flex items-center justify-center w-screen h-full top-[0%] left-[0%] mt-[0px] bg-white">
      <Lottie
        animationData={animationData}
        height={200}
        loop={true}
        width={200}
      />
    </div>
  );
}

export default FullScreenLoading;
