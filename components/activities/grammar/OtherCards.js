import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Heart from "../../svg/Heart";
import Link from "next/link";
import { urlFor } from "../../../sanity";

function OtherCards(props) {
  const router = useRouter();

  function handleIdPush() {
    router.push(`/grammar/${props.slug.current}`);
  }

  return (
    <div
      onClick={handleIdPush}
      key={props.id}
      className=" w-[14.188rem] h-[18.16rem] flex flex-col justify-center items-center
        md:w-[20.563rem] lg:w-[22.563rem] md:h-max shadow-md pb-0 lg:pb-3 hover:opacity-80 
        transition hover:cursor-pointer overflow-hidden bg-white  rounded-3xl  duration-300 ease-in-out "
    >
      <div className="w-full bg-[#EDBA02] h-3/4 md:h-52 relative">
        <Image
          src={urlFor(props.image).url()}
          alt={props.title}
          layout="fill"
          className=" w-full h-full object-contain hover:scale-125 ease-in-out transition duration-300"
          placeholder="blur"
          blurDataURL="LURfXxtP.8RRtRoLofWq?^aMMxo|"
        />
      </div>
      <div className="font-Inter font-bold text-lg mt-0 md:text-2xl md:mt-2">
        <span>{props.title}</span>
      </div>
      <div className="font-light w-3/4 mr-auto ml-auto mt-0 font-Kanit md:mt-2 text-sm md:text-md">
        <span>{props.description}</span>
      </div>
      <div className="w-full font-black font-Inter text-md md:text-xl gap-x-2 md:gap-x-4 mt-2 text-[#F55E00] flex justify-center items-center ">
        <Heart />
        <div>{`${props.likes ? props.likes : 0}`}</div>
      </div>
    </div>
  );
}

export default OtherCards;
