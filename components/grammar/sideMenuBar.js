import Image from "next/image";
import React, { useRef, useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { BsFacebook } from "react-icons/bs";
import { menuGrammar } from "../data/menuGrammar";
import { useRouter } from "next/router";
function SideMenuBar() {
  const [isClick, setIsClick] = useState(0);
  const router = useRouter();
  const handleClick = (index, slug) => {
    setIsClick(index);

    router.push(`/grammar/${slug}`, undefined, { scroll: false });
  };
  return (
    <div className="md:w-max md:h-screen bg-white drop-shadow-md rounded-r-2xl sticky top-0 ">
      <ul className="pl-4 list-none font-sans">
        <li>
          <ul
            className="list-none pl-3 flex justify-start gap-x-4 items-center relative top-4 
           px-9 py-3 w-max h-max bg-white rounded-3xl hover:bg-orange-300 group mr-5"
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
        </li>

        <li className="mt-10 overflow-auto h-96">
          <ul className="grid gap-y-3 list-none">
            {menuGrammar.map((menu, index) => {
              return (
                <li className="w-full h-full" key={index}>
                  <button
                    onClick={() => handleClick(index, menu.slug)}
                    className="border-0 cursor-pointer text-center flex w-full justify-between items-center bg-white hover:bg-blue-200 rounded-md  font-Inter text-base font-semibold p-1 px-3"
                  >
                    <p className="first-letter:uppercase">{menu.title}</p>
                    {menu.lists && (
                      <div>
                        {index === isClick ? (
                          <FiChevronDown size="1.5rem" />
                        ) : (
                          <FiChevronRight size="1.5rem" />
                        )}
                      </div>
                    )}
                  </button>
                  {index === isClick && (
                    <ul className="list-none  grid ">
                      {menu?.lists?.map((list, index) => {
                        return (
                          <li key={index}>
                            <button
                              className="font-Inter text-base border-0 bg-transparent
                           hover:font-semibold text-gray-500 hover:text-gray-900
                           text-left"
                            >
                              <p>{list.list}</p>
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