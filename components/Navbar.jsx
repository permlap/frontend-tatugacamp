import * as React from "react";
import Link from "next/link";
import Logo from "./svg/Logo";
import { Button } from "@mui/material";
import Listmenu from "./svg/Listmenu";
import Script from "next/script";
import TaTugaLogo from "../public/TaTuga camp.png";
import Image from "next/image";
import { useState } from "react";
import Lottie from "react-lottie";
import * as animationData from "../components/LoadingScreen.json";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useScrollDirection from "../hooks/useScrollDirection";
import SideMenuBar from "./grammar/sideMenuBar";
function Navbar() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const scrollDirection = useScrollDirection();

  //defining animaion for loading
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

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
  });
  const [trigger, setTrigger] = useState(false);
  const onClick = () => {
    setTrigger((preTrigger) => !preTrigger);
  };

  return (
    <nav className="w-full h-max fixed md:sticky top-0 z-50 font-Inter">
      <Script
        type="module"
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
      ></Script>
      <Script
        noModule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
      ></Script>

      {/* Phone point of view */}
      <ul className="md:hidden absolute  flex w-screen h-20 z-50  text-white bg-transparent justify-between list-none pl-0  content-center items-center">
        <Button onClick={onClick} className="w-[50px] h-[50px] rounded-full">
          <li className="w-[50px] h-[50px] bg-[#EDBA02] active:bg-[#2C7CD1] flex items-center justify-center rounded-full text-white">
            <Listmenu />
          </li>
        </Button>
        <li className="mr-2 px-4 py-2 rounded-md bg-[#2C7CD1] flex items-center gap-x-2 text-[20px] ">
          <div>
            <a
              className="no-underline text-white"
              href="fb://page/107002408742438"
            >
              <ion-icon name="logo-facebook"></ion-icon>
            </a>
          </div>

          <div>
            <a
              className="no-underline text-white"
              href="http://instagram.com/_u/tatugacamp/"
            >
              <ion-icon name="logo-instagram"></ion-icon>
            </a>
          </div>
          <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
            <Link href="/">
              <Image
                src={TaTugaLogo}
                width={35}
                height={35}
                alt="TaTuga camp logo"
              />
            </Link>
          </div>
        </li>
      </ul>

      <div
        className={` bg-[#EDBA02] absolute md:hidden  w-full h-screen pt-36 z-10 top-0 duration-200 transition-all  ${
          trigger
            ? `translate-y-0 opacity-100 visible`
            : ` -translate-y-full opacity-50 invisible`
        } `}
      >
        <ul className="list-none font-medium flex justify-center items-center flex-col gap-y-5 pl-0">
          <Link href="/">
            <li
              onClick={onClick}
              className="w-max bg-white rounded-md py-4 px-10 active:bg-[#2C7CD1] active:text-white"
            >
              Home page
            </li>
          </Link>
          <Link href="/about-us">
            <li
              onClick={onClick}
              className="w-max bg-white rounded-md py-4 px-10 active:bg-[#2C7CD1] active:text-white"
            >
              About us
            </li>
          </Link>
          <Link href="/grammar/basic-grammar">
            <li className="w-max bg-white rounded-md py-4 px-10 active:bg-[#2C7CD1] active:text-white">
              Grammar
            </li>
          </Link>
        </ul>
      </div>

      {/* Full screen */}

      <ul
        className={`hidden md:flex sticky list-none justify-end pl-0 content-center w-full drop-shadow-md h-max 
          bg-white gap-x-8  py-5 font-normal items-center text-black transition-all duration-500 ${
            scrollDirection === "up" ? "translate-y-0" : "-translate-y-28"
          }`}
      >
        <li className="mr-auto">
          <Link href="/">
            <Button className="flex items-center pt-4 pr-4">
              <Logo />
            </Button>
          </Link>
        </li>
        <li className="">
          <Link href="/about-us">
            <button className="focus:outline-none text-base font-Inter font-normal  border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]">
              <span>About us</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/grammar/basic-grammar">
            <button className=" focus:outline-none text-base font-Inter font-normal border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]">
              <span>Grammar</span>
            </button>
          </Link>
        </li>
        <li></li>
      </ul>
      {loading && (
        <div className="fixed z-50 flex items-center justify-center w-screen h-full top-[0%] left-[0%] mt-[0px] bg-white">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
