import Image from "next/image";
import React, { useRef, useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { BsFacebook } from "react-icons/bs";
import { menuGrammar } from "../data/menuGrammar";
import { useRouter } from "next/router";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
function SideMenuBar({ trigger, handleCloseMenu }) {
  const [isClickMain, setIsClickMain] = useState(0);
  const [isClickList, setIsClickList] = useState(0);
  const router = useRouter();

  //handle click from main list
  const handleClickMain = (index, slug) => {
    setIsClickMain((prev) => (prev = index));
    setIsClickList(0);
    router.push(`/grammar/${slug}`, undefined, { scroll: false });
  };

  //handle click from childern list
  const handleClickList = (index, slug) => {
    setIsClickList((prev) => (prev = index));

    router.push(`/grammar/${slug}`, undefined, { scroll: false });
  };

  return (
    <div
      className={`md:w-max md:h-screen bg-white drop-shadow-md rounded-none md:rounded-r-2xl 
      md:sticky top-0 fixed z-10 w-screen h-screen mt-0 md:mt-0  md:block  ${
        trigger ? "block" : "hidden"
      }`}
    >
      {/* desktop point of view */}
      <ul className="pl-4 list-none font-sans">
        <li>
          <Link href="/">
            <ul
              role="button"
              className="list-none pl-3  justify-start gap-x-4 items-center relative top-4 hidden md:flex
           px-9 py-3 w-max h-max bg-white rounded-3xl hover:bg-orange-300 group mr-5 cursor-pointer"
            >
              <li className="relative w-14 h-14 rounded-full overflow-hidden ">
                <Image
                  src="/TaTuga camp.png"
                  priority
                  className="w-full h-full object-contain"
                  layout="fill"
                />
              </li>
              <li
                className="MoreSugar text-xl text-[#2C7CD1] group-hover:text-white 
            after:content-['BETA'] after:font-Inter after:text-xs after:text-slate-700 after:bg-slate-300 after:rounded-md after:p-1 after:ml-3"
              >
                TaTuga camp
              </li>
            </ul>
          </Link>
        </li>

        <li className="mt-20 md:mt-10 overflow-auto h-96 scrollbar">
          <ul className="grid gap-y-3 list-none">
            <li className="w-full h-full">
              <button
                onClick={() => router.push(`/`)}
                className="border-0 cursor-pointer text-center flex w-full justify-start gap-x-3 items-center
               bg-white hover:bg-blue-200 rounded-md 
                font-Inter text-base font-semibold p-1 px-3"
              >
                <AiFillHome size={25} />
                <p
                  className={`first-letter:uppercase active:text-red-700  font-bold`}
                >
                  Homepage
                </p>
              </button>
            </li>
            {menuGrammar.map((menu, index) => {
              return (
                <li className="w-full h-full" key={index}>
                  <button
                    onClick={() => {
                      handleClickMain(index, menu.slug);
                    }}
                    className="border-0 cursor-pointer text-center flex w-full justify-between items-center bg-white hover:bg-blue-200 rounded-md  font-Inter text-base font-semibold p-1 px-3"
                  >
                    <p
                      className={`first-letter:uppercase ${
                        index === isClickMain && "text-red-700 font-bold"
                      }`}
                    >
                      {menu.title}
                    </p>
                    {menu.lists && (
                      <div>
                        {index === isClickMain ? (
                          <FiChevronDown size="1.5rem" />
                        ) : (
                          <FiChevronRight size="1.5rem" />
                        )}
                      </div>
                    )}
                  </button>
                  {index === isClickMain && (
                    <ul className="list-none  grid ">
                      {menu?.lists?.map((list, index) => {
                        return (
                          <li key={index}>
                            <button
                              onClick={() => {
                                handleClickList(index, list.slug);
                                handleCloseMenu(false);
                              }}
                              className="font-Inter text-base border-0 bg-transparent
                           hover:font-semibold text-gray-500 hover:text-gray-900
                           text-left"
                            >
                              <p
                                className={`${
                                  index === isClickList &&
                                  "text-blue-600 font-bold"
                                }`}
                              >
                                {list.list}
                              </p>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
            <li className="relative">
              <button
                className="mt-5 border-0 text-center flex w-full gap-x-3 items-center bg-white  
              font-Inter text-base font-semibold p-1 px-3
              before:content-[''] before:w-full before:h-[0.5px] before:top-3 before:right-0  before:bg-gray-400 before:absolute "
              >
                <p>Community</p>
                <BsFacebook color="blue" size="1.5rem" />
              </button>
            </li>
            <li>
              <button
                className=" border-0 text-center flex w-full justify-between items-center bg-white  
              font-Inter text-base font-semibold p-1 px-3"
              >
                <p>Feedback</p>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default SideMenuBar;
