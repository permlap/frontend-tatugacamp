import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  FiHome,
  FiGrid,
  FiSettings,
  FiHelpCircle,
  FiChevronsLeft,
} from "react-icons/fi";
import { GrScorecard } from "react-icons/gr";
function SidebarClassroom({ user }) {
  const [isClick, setIsClick] = useState(0);
  const sideMenus = [
    {
      title: "ห้องเรียน",
      icon: <FiHome />,
      url: "#",
    },
    {
      title: "เครื่องมือ",
      icon: <FiGrid />,
      url: "#",
    },
    {
      title: "ตั้งค่า",
      icon: <FiSettings />,
      url: "#",
    },
    {
      title: "กลับสู่หน้าหลัก",
      icon: <FiChevronsLeft />,
      url: "/",
    },
  ];

  return (
    <div className="bg-white w-80 h-full rounded-tr-md rounded-br-md fixed ">
      <ul className="list-none pl-0">
        <li className="mt-12">
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 bg-blue-500 rounded-full relative flex justify-center items-center overflow-hidden 
      "
            >
              {user?.data?.data?.picture ? (
                <Image
                  src={user?.data?.data?.picture}
                  layout="fill"
                  className="object-contain"
                  alt={`profile of ${user?.data?.data?.firstName}`}
                />
              ) : (
                <span className="text-3xl font-Kanit font-semibold text-white">
                  {user?.data?.data?.firstName.charAt(0)}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-col items-center justify-center">
              <span>welcome {user?.data?.data?.firstName}</span>
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
