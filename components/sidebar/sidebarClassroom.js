import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function SidebarClassroom({ user, sideMenus, triggersidebar }) {
  const router = useRouter();
  const pathname = router.pathname; // e.g. "/classroom/setting"

  const lastRoute = pathname.split("/").pop(); // "setting"
  const [isClick, setIsClick] = useState();
  useEffect(() => {
    if (lastRoute === "setting") {
      setIsClick(1);
    } else if (lastRoute === "classroom") {
      setIsClick(0);
    } else if (lastRoute === "[classroomId]") {
      setIsClick(1);
    } else if (lastRoute === "timer") {
      setIsClick(2);
    }
  }, []);

  return (
    <div
      className={`bg-white w-[280px] h-screen rounded-tr-md block opacity-100 scale-100 drop-shadow-xl 
        transition duration-300  rounded-br-md fixed font-Kanit  top-0 left-0 z-20 
      ${triggersidebar === false && "-translate-x-96   "}`}
    >
      <ul className="list-none pl-0 flex justify-center items-center flex-col">
        <li className="mt-12">
          <div className="flex flex-col items-center justify-center ">
            <div
              className={`w-20 h-20 ${
                user?.data?.data?.picture ? "bg-transparent" : "bg-blue-500"
              } rounded-full relative flex justify-center items-center overflow-hidden `}
            >
              {user?.data?.data?.picture ? (
                <Image
                  src={user?.data?.data?.picture}
                  layout="fill"
                  className="object-cover"
                  alt={`profile of ${user?.data?.data?.firstName}`}
                />
              ) : (
                <span className="text-3xl font-Kanit font-semibold text-white">
                  {user?.data?.data?.firstName.charAt(0)}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-col items-center justify-center">
              <span>Hi, {user?.data?.data?.firstName}</span>
              <span className="text-md font-light">
                {user?.data?.data?.email}
              </span>
            </div>
          </div>
        </li>
        <li>
          <ul className="list-none pl-5 flex flex-col gap-y-3 mt-10 ">
            {sideMenus.map((list, index, array) => {
              return (
                <Link href={list?.url} key={index}>
                  <li
                    className={`${
                      index === array.length - 1 && " bottom-5 absolute"
                    }`}
                  >
                    <button
                      onClick={() => setIsClick(index)}
                      className="bg-transparent rounded-md border-none 
                 flex justify-center items-center gap-x-3 group cursor-pointer"
                    >
                      <div className="text-3xl  flex justify-center items-center text-gray-800  ">
                        {list.icon}
                      </div>
                      <span
                        className={`border-2 border-solid border-transparent group-hover:border-black
                   font-Kanit text-lg w-40 py-1 rounded-md font-semibold 
                   active:bg-[#2C7CD1] active:text-white focus:bg-[#EDBA02] ${
                     isClick === index
                       ? "bg-[#EDBA02] text-white"
                       : "bg-white text-black"
                   } `}
                      >
                        {list.title}
                      </span>
                    </button>
                  </li>
                </Link>
              );
            })}
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default SidebarClassroom;
