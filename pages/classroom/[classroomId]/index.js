import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import SidebarClassroom from "../../../components/sidebar/sidebarClassroom";
import { GetOneClassroom, GetUser } from "../../../service/service";
import {
  FiHome,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
  FiArrowLeftCircle,
} from "react-icons/fi";
import Head from "next/head";
import Loading from "../../../components/loading/loading";
import FullScreenLoading from "../../../components/loading/FullScreenLoading";
import { Popover, Transition } from "@headlessui/react";
import Layout from "../../../layouts/classroomLayout";
function Index() {
  const router = useRouter();
  const user = useQuery(["user"], () => GetUser());
  const classroom = useQuery(["classroom"], () =>
    GetOneClassroom({ params: router.query.classroomId })
  );
  console.log(classroom?.data?.response?.data.statusCode === 401);
  const classroomCode =
    classroom.data?.data?.classroomCode.slice(0, 3) +
    "-" +
    classroom.data?.data?.classroomCode.slice(3);
  useEffect(() => {
    if (user.data === "Unauthorized") {
      router.push("/auth/signIn");
    }
  }, []);
  // for passing data to sidebar
  const sideMenus = [
    {
      title: "ห้องเรียน",
      icon: "👨‍🏫",
      url: `#`,
    },
    {
      title: "คะแนน",
      icon: "🌟",
      url: "#",
    },
    {
      title: "เครื่องมือ",
      icon: "🧰",
      url: "#",
    },
    {
      title: "ตั้งค่า",
      icon: "🔧",
      url: "#",
    },
    {
      title: "Go back",
      icon: <FiArrowLeftCircle />,
      url: `/classroom`,
    },
  ];
  if (classroom?.data?.response?.data.statusCode === 400) {
    return (
      <div className="flex w-full h-screen justify-center items-center font-sans">
        <h1>404 - Page Not Found😢</h1>
      </div>
    );
  }
  useEffect(() => {
    if (classroom?.data?.response?.data.statusCode === 401) {
      router.push("/auth/signIn");
    }
  }, []);

  if (classroom.isLoading) {
    return <FullScreenLoading />;
  }
  return (
    <>
      <Head>
        <title>classroom - {classroom.data?.data?.title}</title>
      </Head>
      <div className="flex">
        <Layout user={user} sideMenus={sideMenus} />
        <div className="w-full flex flex-col items-center">
          <div className="w-max bg-transparent mt-10 flex gap-x-4 items-center justify-center ">
            <span className="font-Kanit font-semibold text-2xl text-[#2C7CD1]">
              Code รหัสห้องเรียน
            </span>
            <Popover className="relative flex items-center justify-center">
              {({ open }) => (
                <>
                  <Popover.Button className="bg-transparent border-none">
                    <div
                      aria-label="ขยายเพื่อดูรหัสห้องเรียน"
                      className={`
                      w-max p-3 bg-[#EDBA02] rounded-xl cursor-pointer
             hover:scale-110 transition duration-200 ease-in-out`}
                    >
                      <span className="font-sans font-bold text-2xl text-white">
                        {classroomCode}
                      </span>
                    </div>
                  </Popover.Button>
                  <Popover.Panel>
                    {({ close }) => (
                      <div
                        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto
                      bg-white/10 backdrop-blur-sm"
                        onClick={() => close()}
                      >
                        <div
                          className="w-max p-3 h-max fixed right-0 left-0 top-0 bottom-0 m-auto bg-[#EDBA02] rounded-xl cursor-pointer
            hover:scale-110 transition duration-200 ease-in-out"
                        >
                          <span className="font-sans font-bold text-9xl text-white">
                            {classroomCode}
                          </span>
                        </div>
                      </div>
                    )}
                  </Popover.Panel>
                </>
              )}
            </Popover>
          </div>
          <div>main</div>
        </div>
      </div>
    </>
  );
}

export default Index;
