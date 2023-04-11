import React, { useEffect, useState } from "react";
import Layout from "../../../../layouts/classroomLayout";
import { useQuery } from "react-query";
import { GetUser } from "../../../../service/user";
import { FiArrowLeftCircle, FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";
import Unauthorized from "../../../../components/error/unauthorized";
import FullScreenLoading from "../../../../components/loading/FullScreenLoading";
import { GetOneClassroom } from "../../../../service/classroom";
import { Popover } from "@headlessui/react";
import Lottie from "lottie-react";
import * as ClassroomAnimation from "../../../../components/90714-online-learning.json";
import UpdateClass from "../../../../components/form/updateClass";
import Image from "next/image";
import CreateAssignment from "../../../../components/form/createAssignment";
import {
  GetAllAssignments,
  GetAssignmentProgress,
} from "../../../../service/assignment";
import { GetAllStudents } from "../../../../service/students";
import ShowAssignment from "../../../../components/form/showAssignment";
function Assignment() {
  const router = useRouter();
  const user = useQuery(["user"], () => GetUser());
  const [triggerAssignment, setTriggerAssignment] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [passAssianment, setPassAssignment] = useState();
  const classroom = useQuery(
    ["classroom"],
    () => GetOneClassroom({ params: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  const assignments = useQuery(
    ["assignments"],
    () => GetAllAssignments({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );

  const students = useQuery(
    ["students"],
    () => GetAllStudents({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );

  //check whether there is authorrized acccess or not
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      router.push("/auth/signIn");
    }
    if (user.data === "Unauthorized") {
      router.push("/auth/signIn");
    }
    if (user.isFetching === false) {
      if (!user.data) {
        router.push("/auth/signIn");
      }
    }
    if (router.isReady) {
      classroom.refetch();
      user.refetch();
      assignments.refetch();
      students.refetch();
    }
  }, [router.isReady, user.data === "Unauthorized"]);

  const sideMenus = [
    {
      title: "โรงเรียน",
      icon: "🏫",
      url: `/classroom/teacher`,
    },
    {
      title: "ห้องเรียน",
      icon: "👨‍🏫",
      url: `/classroom/teacher/${router.query.classroomId}`,
    },
    {
      title: "มอบหมายงาน",
      icon: "🎒",
      url: `#`,
    },
    {
      title: "timer",
      icon: "⏲️",
      url: `/teacher-tools/timer`,
    },

    {
      title: "หน้าหลัก",
      icon: <FiArrowLeftCircle />,
      url: `/`,
    },
  ];

  if (!router.isReady) {
    return <FullScreenLoading />;
  }
  //if no user data return unauthorization page
  if (!user.data) {
    return <Unauthorized user={user} />;
  }

  const classroomCode =
    classroom.data?.data?.classroomCode.slice(0, 3) +
    "-" +
    classroom.data?.data?.classroomCode.slice(3);

  //covert date
  const date = new Date(classroom.data?.data?.createAt);

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  //style animationLottie
  const style = {
    height: 280,
  };

  return (
    <div className="w-full pb-96  ">
      <Layout sideMenus={sideMenus} user={user} />
      <div className="pt-36">
        <header className="w-full flex items-center justify-center ">
          <div
            className="max-w-7xl w-full rounded-3xl  flex  flex-col-reverse md:flex-row md:gap-x-4 z-10
             bg-blue-200 md:h-52 lg:h-40 
          items-center justify-start relative  "
          >
            <Popover>
              {({ open }) => (
                <>
                  <Popover.Button
                    className="absolute top-4 left-3 text-2xl text-gray-500 cursor-pointer
border-none flex items-center justify-center hover:animate-spin bg-transparent animate-none 	"
                  >
                    <div className="flex items-center justify-center">
                      <FiSettings />
                    </div>
                  </Popover.Button>
                  <Popover.Panel>
                    {({ close }) => (
                      <UpdateClass
                        close={close}
                        classroom={classroom?.data?.data}
                        refetch={classroom.refetch}
                      />
                    )}
                  </Popover.Panel>
                </>
              )}
            </Popover>

            <div
              className="flex flex-col items-center justify-center gap-y-3 static  md:absolute top-[5rem] right-[2rem] z-10 
            p-2 "
            >
              <span className="font-Kanit font-semibold text-2xl bg-transparent md:bg-white rounded-md px-4 drop-shadow-md  text-gray-800">
                Code รหัสห้องเรียน
              </span>

              <Popover className="relative flex items-center justify-center">
                {({ open }) => (
                  <>
                    <Popover.Button className="bg-transparent border-none active:border-none ">
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
                          className="w-full h-full fixed  overflow-hidden right-0 left-0 top-0 bottom-0 m-auto
                      bg-white/30 backdrop-blur-md"
                          onClick={() => close()}
                        >
                          <div
                            className="w-5/6 md:w-max p-3 h-max fixed right-0 text-center left-0 top-0 bottom-0 m-auto bg-[#EDBA02] rounded-xl cursor-pointer
            hover:scale-110 transition duration-200 ease-in-out"
                          >
                            <span className="font-sans font-bold  text-3xl md:text-9xl xl:text-[15rem] text-white md:px-40">
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

            {/* text in header */}
            <div className="font-Kanit text-2xl font-light md:ml-10 m-2 md:w-80 lg:w-full  md:h-max md:block flex flex-col items-center justify-center">
              <div className="flex md:block items-center justify-center w-full flex-col">
                <span className="mr-2 md:block hidden">Welcome to</span>
                <div className="mr-2 md:hidden block">Welcome to</div>
                <span className="text-4xl font-semibold text-center md:text-left uppercase">
                  {classroom.data?.data?.title}
                </span>
              </div>
              <div className="mt-2  md:flex">
                <span className="font-Kanit font-light text-base mr-5 ">
                  {classroom.data?.data?.description}
                </span>
                <span className="font-Kanit font-normal px-2 tracking-wider text-white text-base bg-[#EDBA02] p-1 rounded-xl">
                  {classroom.data?.data?.level}
                </span>
                <span className="text-sm ml-5 uppercase hidden  md:block">
                  create at {formattedDate}
                </span>
                <div className="text-sm ml-5 uppercase md:hidden block mt-2">
                  create at {formattedDate}
                </div>
              </div>
            </div>
            <div className="absolute right-0 -top-20 hidden md:block  ">
              <Lottie animationData={ClassroomAnimation} style={style} />
            </div>
          </div>
        </header>
        <main className="w-full  py-5  mt-10 flex flex-col items-center justify-center relative">
          <div
            className="bg-white w-[28rem] h-20 rounded-full drop-shadow-md flex items-center 
          justify-start gap-2 "
          >
            <div className="w-10 h-10 relative ml-5 rounded-full overflow-hidden">
              <Image src={user?.data?.data?.picture} layout="fill" />
            </div>
            <button
              onClick={() => setTriggerAssignment(true)}
              className="w-80 border-none py-2 rounded-full bg-blue-100 text-center font-Poppins text-sm hover:bg-[#2C7CD1] hover:text-white
text-black transition duration-150 cursor-pointer"
            >
              <div>create your assignment</div>
            </button>
          </div>

          <div
            className={` top-0 right-0 left-0 bottom-0 m-auto righ z-40 ${
              triggerAssignment === false ? "hidden" : "fixed"
            }`}
          >
            <CreateAssignment
              assignments={assignments}
              setTriggerAssignment={setTriggerAssignment}
              students={students}
            />
          </div>
          <div
            className={` top-0 right-0 left-0 bottom-0 m-auto righ z-40 ${
              showAssignment === false ? "hidden" : "fixed"
            }`}
          >
            <ShowAssignment
              setShowAssignment={setShowAssignment}
              passAssianment={passAssianment}
              classroomId={router?.query?.classroomId}
              students={students}
              assignments={assignments}
              setTriggerAssignment={setTriggerAssignment}
            />
          </div>
          {/* assignments are here */}
          <div className=" w-full max-w-7xl mt-5 gap-5 grid items-center justify-center ">
            {assignments?.data?.map((assignment, index) => {
              //covert date
              const date = new Date(assignment.deadline);
              const formattedDate = date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  onClick={() => {
                    setPassAssignment(assignment);
                    setShowAssignment(true);
                  }}
                  key={index}
                  className={`w-[35rem] h-36 px-10 py-5 drop-shadow-md  bg-white  hover:scale-105 cursor-pointer overflow-hidden
                 duration-150 transition relative
               rounded-lg flex flex-col gap-10 border-2 border-solid`}
                >
                  <div className="flex ">
                    <div className="flex">
                      <div
                        className={`flex flex-col gap-2 w-3/4 font-Poppins text-black `}
                      >
                        <span className=" font text-xl font-bold">
                          {assignment.title}
                        </span>
                        <div className="relative">
                          <div className="w-96  h-[0.5px]  mb-2 bg-blue-800 rounded-full "></div>

                          <div
                            className="h-24 overflow-hidden fade-mask"
                            dangerouslySetInnerHTML={{
                              __html: assignment?.description,
                            }}
                          />
                          <div className="w-96 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              style={{ width: assignment.progress.progress }}
                              className={` bg-blue-800 h-2 `}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        className="w-20 h-20 rounded-xl bg-white flex items-center font-semibold leading-4
                    justify-center font-Poppins flex-col text-xs"
                      >
                        <span className="text-3xl">{assignment?.day}</span>
                        <span>{assignment?.month}</span>
                      </div>
                    </div>
                    <div className="relative">
                      {assignment.maxScore && (
                        <div className="flex items-center justify-center flex-col">
                          <div
                            className="w-20 h-20 bg-[#EDBA02] rounded-full text-white text-4xl
                        font-Poppins font-bold flex items-center justify-center"
                          >
                            {assignment.maxScore}
                          </div>
                          <div className="font-Poppins font-semibold">
                            score
                          </div>
                        </div>
                      )}
                      <div className="font-Poppins gap-1 text-sm flex w-max absolute bottom-0 -left-12">
                        <span>กำหนดส่ง</span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Assignment;
