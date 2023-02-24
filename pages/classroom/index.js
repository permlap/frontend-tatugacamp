import Image from "next/image";
import React, { useState } from "react";
import {
  FiHome,
  FiGrid,
  FiSettings,
  FiHelpCircle,
  FiSearch,
} from "react-icons/fi";
import { GrScorecard } from "react-icons/gr";
import SearchAutoComplete from "../../components/search/searchAutoComplete";

function Index() {
  const [isClick, setIsClick] = useState(0);
  const classrooms = [
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "English for comunication",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤษ",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
    {
      title: "ภาษาอังกฤาเพื่อการสื่อสาร",
      level: "ม.3/5",
      description: "รหัสวิชา 554215",
    },
  ];
  const sideMenus = [
    {
      title: "หน้าหลัก",
      icon: <FiHome />,
    },
    {
      title: "ดูผลคะแนน",
      icon: <GrScorecard />,
    },
    {
      title: "เครื่องมือ",
      icon: <FiGrid />,
    },
    {
      title: "ตั้งค่า",
      icon: <FiSettings />,
    },
    {
      title: "ช่วนเหลือ",
      icon: <FiHelpCircle />,
    },
  ];

  const classroomTitle = [
    {
      title: "English class",
    },
    {
      title: "Thai class",
    },
  ];
  return (
    <div className="bg-slate-200 w-full h-full font-Kanit">
      <div className="flex w-full h-full ">
        <div className="bg-white w-80 h-full rounded-tr-md rounded-br-md fixed ">
          <ul className="list-none pl-0">
            <li className="mt-5">
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-slate-500 rounded-full"></div>
                <div className="mt-2">
                  <span>welcome Permlap</span>
                </div>
              </div>
            </li>
            <li>
              <ul className="list-none pl-5 flex flex-col gap-y-3 mt-10">
                {sideMenus.map((list, index) => {
                  return (
                    <li className={`${index === 4 && " bottom-5 absolute"}`}>
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
                  );
                })}
              </ul>
            </li>
          </ul>
        </div>
        <div className="flex justify-end items-center w-full h-full ">
          <div className="bg-white w-3/4 h-max m-5 rounded-md flex flex-col justify-start items-center pb-14 ">
            <header className="mt-5">
              <div className="flex justify-center items-center gap-x-2 ">
                <SearchAutoComplete
                  activityPosts={classroomTitle}
                  searchFor={"ค้นหาห้องเรียน"}
                />
              </div>
            </header>
            <div className=" w-full mt-20 flex  relative">
              <div className="w-[30rem] ml-20">
                <span className="text-7xl font-Kanit tracking-wider leading-snug">
                  สร้างห้องเรียนของคุณได้ที่นี้
                </span>
              </div>
              <div className=" w-96 h-96 absolute right-40 -top-20">
                <Image
                  src="/arrayAround/Brave.png"
                  layout="fill"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="mt-20 w-full flex justify-center items-center font-Kanit ">
              <div className="flex gap-x-2 justify-center items-center">
                <span className="text-xl font-bold text-[#2C7CD1] ">
                  กดเพื่อ
                </span>
                <button
                  className="bg-[#EDBA02] border-2 border-transparent border-solid text-md px-5 py-2 rounded-lg 
                  font-bold font-Kanit text-white cursor-pointer
                active:border-black hover:scale-110 transition duration-150 ease-in-out"
                >
                  สร้าง
                </button>
                <span className="text-xl font-bold text-[#2C7CD1]">
                  ห้องเรียน
                </span>
              </div>
            </div>
            <main className="w-[90%] grid grid-cols-4 gap-5 mt-14">
              {classrooms.map((list) => {
                return (
                  <div className="w-64 h-max pb-3 border-2 border-solid rounded-3xl overflow-hidden relative">
                    <div className="text-right pt-5">
                      <span className="text-gray-700 font-light text-md mr-2 ">
                        A FEW SECONDS
                      </span>
                      <div className="w-full bg-gray-400 h-[1.5px] absolute top-16"></div>
                      <div className="w-14 h-14 relative rounded-full overflow-hidden ml-5">
                        <Image
                          src="https://storage.googleapis.com/tatugacamp.com/UserId%3A63f84bd31ecabb5499898f1c-UUID%3A35e8fd8d-d6c7-414f-84d2-e8b15e77d96c-DATE%3A1677217747662-121461397_1776318822509483_5475911820922048867_n.jpg"
                          layout="fill"
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col mt-5 ml-5">
                      <span className="text-lg text-gray-600 font-light">
                        {list.level}
                      </span>
                      <span className="font-bold text-3xl text-[#EDBA02]">
                        {list.title}
                      </span>
                      <span>{list.description}</span>
                    </div>
                    <div className="flex justify-center items-center ">
                      <button
                        className="w-3/4  h-9 mt-2 rounded-lg bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
                      >
                        <div></div>
                        <span>เข้าชั้นเรียน</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
