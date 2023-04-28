import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GetUser } from "../../../../../service/user";
import { FiArrowLeftCircle, FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";
import Unauthorized from "../../../../../components/error/unauthorized";
import FullScreenLoading from "../../../../../components/loading/FullScreenLoading";
import { GetOneClassroom } from "../../../../../service/classroom";
import Image from "next/image";
import CreateAssignment from "../../../../../components/form/createAssignment";
import { GetAllAssignments } from "../../../../../service/assignment";
import { GetAllStudents } from "../../../../../service/students";
import ShowAssignment from "../../../../../components/form/showAssignment";
import Layout from "../../../../../layouts/classroomLayout";
function Assignment() {
  const router = useRouter();
  const user = useQuery(["user"], () => GetUser());
  const [triggerAssignment, setTriggerAssignment] = useState(false);

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
    <div className="w-full pb-96   ">
      <Layout
        user={user}
        sideMenus={sideMenus}
        classroom={classroom}
        students={students}
      />
      <div className="">
        <main className="w-full  py-5  mt-10 flex flex-col items-center justify-center relative">
          <div
            className="bg-white w-[28rem] h-20 rounded-full drop-shadow-md flex items-center 
          justify-start gap-2 "
          >
            <div className="w-10 h-10 relative ml-5 rounded-full overflow-hidden">
              <Image src={user?.data?.data?.picture} layout="fill" />
            </div>
            <button
              onClick={() => {
                setTriggerAssignment(true);
                document.body.style.overflow = "hidden";
              }}
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
                    router.push({
                      pathname: `/classroom/teacher/${router.query.classroomId}/assignment/${assignment.id}`,
                    });
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
                        <span className=" font text-xl font-bold w-max">
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
