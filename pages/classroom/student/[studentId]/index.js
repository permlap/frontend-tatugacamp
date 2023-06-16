import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  MdCardTravel,
  MdOutlineMoodBad,
  MdOutlineSick,
  MdWork,
} from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { GetAllAssignment } from "../../../../service/student/assignment";
import { Skeleton } from "@mui/material";
import { GetAttendances } from "../../../../service/student/attendance";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { BiErrorCircle, BiHappyBeaming } from "react-icons/bi";
import Head from "next/head";

function Index() {
  const [classroomCode, setClassroomCode] = useState();
  const [activeMenu, setActiveMenu] = useState(0);
  const menus = [
    {
      title: "ชิ้นงาน",
      icon: <MdWork />,
      color: "bg-yellow-400",
    },
    {
      title: "ข้อมูลการเข้าเรียน",
      icon: <HiOutlineHandRaised />,
      color: "bg-gray-400",
    },
  ];

  const router = useRouter();
  const [student, setStudnet] = useState();
  const assignments = useQuery(
    ["assignments-student"],
    () =>
      GetAllAssignment({
        studentId: student.id,
        classroomId: student.classroomId,
      }),
    {
      enabled: false,
    }
  );
  const attendances = useQuery(
    ["attendances"],
    () =>
      GetAttendances({
        studentId: student.id,
        classroomId: student.classroomId,
      }),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    setStudnet(() => {
      const student = localStorage.getItem("student");
      const studentObject = JSON.parse(student);
      return studentObject;
    });
    setClassroomCode(() => {
      const rawClassroomCode = localStorage.getItem("classroomCode");
      const classroomCode = JSON.parse(rawClassroomCode);
      return classroomCode;
    });
  }, []);

  useEffect(() => {
    if (student) {
      assignments.refetch();
      attendances.refetch();
    }
  }, [student]);
  return (
    <div
      className={`bg-[#2C7CD1] w-full  ${
        assignments?.data?.data.length > 4 ? "h-full" : "h-screen"
      }  md:h-screen md:pb-40 lg:pb-96 lg:h-full`}
    >
      <Head>
        <title>student - homepage</title>
      </Head>
      <main className="w-full h-full flex items-center justify-start flex-col pt-20 gap-3 relative">
        <div
          role="button"
          aria-label="button go back to classroom"
          onClick={() =>
            router.push({
              pathname: `/classroom/student`,
              query: {
                classroomCode: classroomCode,
              },
            })
          }
          className="w-10 h-10 bg-transparent border-2 border-solid border-white cursor-pointer rounded-lg absolute top-2 left-2
        flex items-center justify-center active:bg-orange-500 hover:scale-110 transition duration-150"
        >
          <div className="text-2xl text-white flex items-center justify-center ">
            <IoHome />
          </div>
        </div>
        <header className="flex flex-col justify-center items-center gap-5">
          {student?.picture && (
            <div className="w-28 h-28 relative rounded-2xl overflow-hidden ring-4 ring-white bg-[#EDBA02]">
              <Image
                priority={true}
                src={student?.picture}
                layout="fill"
                className="object-contain scale-125 translate-y-4"
              />
            </div>
          )}
          <div className="text-white font-Kanit font-normal flex gap-2">
            <span>เลขที่ {student?.number}</span>
          </div>
          <div className="text-white font-Kanit font-normal flex gap-2">
            <span>{student?.firstName}</span>
            <span>{student?.lastName}</span>
          </div>

          <div className="flex gap-5">
            {menus.map((menu, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setActiveMenu(() => index)}
                  className={`w-max px-2 h-10 rounded-md ${menu.color} ${
                    activeMenu === index ? "ring-2 ring-white" : "ring-0"
                  }  items-center flex justify-center hover:scale-110 
                 gap-2 transition duration-150 hover:ring-1 active:ring-2`}
                >
                  <div
                    className="w-8 h-8  bg-white/50 backdrop-blur-md rounded-md flex 
                items-center justify-center text-black"
                  >
                    {menu.icon}
                  </div>
                  <span className="text-md text-black  font-Poppins font-normal">
                    {menu.title}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {!student && (
          <div className="text-xl text-white font-Kanit">
            ไม่พบผู้เรียนโปรดกลับสู่หน้าหลัก
          </div>
        )}
        <div className="grid grid-cols-1 pb-2  gap-4 place-items-center w-full mt-8 max-w-xl	">
          {assignments.isLoading && (
            <div className="flex flex-col justify-center items-center gap-5">
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
            </div>
          )}
          {activeMenu === 0 &&
            assignments?.data?.data?.map((assignment) => {
              return (
                <button
                  key={assignment.assignment.id}
                  onClick={() => {
                    const serializedAssignment = JSON.stringify(assignment);
                    localStorage.setItem("assignment", serializedAssignment);
                    router.push({
                      pathname: `/classroom/student/${student.id}/assignment/${assignment.assignment.id}`,
                    });
                  }}
                  aria-label="open assignment"
                  className={`w-10/12 py-2 px-2 h-32 active:scale-105   drop-shadow-md  bg-white  hover:scale-105 cursor-pointer 
                 duration-150 transition relative 
               rounded-lg flex items-start justify-between  gap-2 border-2 border-solid`}
                >
                  <div className={`flex gap-2 w-full font-Poppins text-black `}>
                    <div className="w-full">
                      <div className=" overflow-hidden w-3/4 h-8 truncat  text-left">
                        <span className=" font text-xl font-bold  ">
                          {assignment?.assignment?.title}
                        </span>
                      </div>

                      <div className="relative w-full">
                        <div className="w-full  h-[0.5px] mt-1 ml-2  mb-2 bg-blue-800 rounded-full "></div>

                        <div
                          className="h-20 w-40 overflow-hidden  fade-mask ml-2"
                          dangerouslySetInnerHTML={{
                            __html: assignment?.assignment?.description,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-40  h-full flex items-center justify-center">
                    <div className=" font-Kanit flex-col font-semibold flex justify-center items-center">
                      {assignment?.student.status === "no-work" && (
                        <div className="w-20 h-20 bg-red-600 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                          <span>ไม่ส่งงาน</span>
                        </div>
                      )}
                      {assignment?.student.status === "have-work" &&
                        assignment?.student?.isSummited === false && (
                          <div className="w-20 h-20 bg-yellow-400 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                            <span>ส่งแล้ว</span>
                          </div>
                        )}
                      {assignment?.student.status === "have-work" &&
                        assignment?.student?.isSummited === true && (
                          <div className="w-20 h-20 bg-green-600 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                            <span>ตรวจแล้ว</span>
                          </div>
                        )}
                      สถานะ
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
        {activeMenu === 1 && (
          <section className="w-full h-full flex  justify-center">
            <ul className="grid pl-0 grid-cols-1 gap-5 w-full h-full py-10 max-w-3xl md:w-10/12 rounded-t-3xl lg:rounded-3xl bg-white place-items-center">
              <div className="w-full flex justify-start flex-col items-center font-Kanit ">
                <h2 className="mb-2">สถิติ</h2>
                <div className="grid grid-cols-2 gap-4 w-max md:w-full md:place-items-center place-items-start">
                  <span className="col-span-2">
                    เปอเซ็นต์การเข้าเรียน{" "}
                    {attendances?.data?.data?.statistics?.percent?.present?.toFixed(
                      2
                    )}
                    %
                  </span>
                  <span>
                    จำนวนมาเรียน{" "}
                    <span className="font-semibold text-green-500">
                      {attendances?.data?.data?.statistics?.number?.present}{" "}
                      ครั้ง
                    </span>
                  </span>
                  <span>
                    จำนวนลา{" "}
                    <span className="font-semibold text-yellow-500">
                      {attendances?.data?.data?.statistics?.number?.holiday}{" "}
                      ครั้ง
                    </span>
                  </span>
                  <span>
                    จำนวนป่วย{" "}
                    <span className="font-semibold text-blue-500">
                      {attendances?.data?.data?.statistics?.number?.sick} ครั้ง
                    </span>
                  </span>
                  <span>
                    จำนวนขาดเรียน{" "}
                    <span className="font-semibold text-red-500">
                      {attendances?.data?.data?.statistics?.number?.absent}{" "}
                      ครั้ง
                    </span>
                  </span>

                  <span className="col-span-2">
                    จำนวนคาบเรียนทั้งหมด{" "}
                    {attendances?.data?.data?.statistics?.sum} ครั้ง
                  </span>
                </div>
              </div>

              {attendances?.data?.data?.students?.map((attendance) => {
                const date = new Date(attendance.date);
                const formattedDate = date.toLocaleDateString("th-TH", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                if (attendance.present) {
                  return (
                    <li
                      key={attendance.id}
                      className="flex  items-center justify-between font-Kanit w-full md:w-3/4 rounded-md"
                    >
                      <div className="flex justify-start items-center ml-5 gap-2">
                        <div className="w-10 h-10  rounded-full bg-green-100 flex items-center justify-center">
                          <div className="flex items-center justify-center text-green-800 text-3xl">
                            <BiHappyBeaming />
                          </div>
                        </div>
                        <span className=" font-semibold text-lg">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="w-14 rounded-sm p-2 mr-5 bg-green-500 text-white">
                        <span>มาเรียน</span>
                      </div>
                    </li>
                  );
                } else if (attendance.holiday) {
                  return (
                    <li className="flex  items-center justify-between font-Kanit w-full md:w-3/4 rounded-md">
                      <div className="flex justify-start items-center ml-5 gap-2">
                        <div className="w-10 h-10  rounded-full bg-yellow-100 flex items-center justify-center">
                          <div className="flex items-center justify-center text-yellow-400 text-3xl">
                            <MdCardTravel />
                          </div>
                        </div>
                        <span className=" font-semibold text-lg">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="w-14 text-center rounded-sm p-2 mr-5 bg-yellow-500 text-white">
                        <span>ลา</span>
                      </div>
                    </li>
                  );
                } else if (attendance.sick) {
                  return (
                    <li className="flex  items-center justify-between font-Kanit w-full md:w-3/4 rounded-md">
                      <div className="flex justify-start items-center ml-5 gap-2">
                        <div className="w-10 h-10  rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="flex items-center justify-center text-blue-400 text-3xl">
                            <MdOutlineSick />
                          </div>
                        </div>
                        <span className=" font-semibold text-lg">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="w-14 text-center rounded-sm p-2 mr-5 bg-blue-500 text-white">
                        <span>ป่วย</span>
                      </div>
                    </li>
                  );
                } else if (attendance.absent) {
                  return (
                    <li className="flex  items-center justify-between font-Kanit w-full md:w-3/4 rounded-md">
                      <div className="flex justify-start items-center ml-5 gap-2">
                        <div className="w-10 h-10  rounded-full bg-red-100 flex items-center justify-center">
                          <div className="flex items-center justify-center text-red-400 text-3xl">
                            <MdOutlineMoodBad />
                          </div>
                        </div>
                        <span className=" font-semibold text-lg">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="w-14 text-center rounded-sm p-2 mr-5 bg-red-500   text-white">
                        <span>ขาด</span>
                      </div>
                    </li>
                  );
                } else {
                  return (
                    <li className="flex  items-center justify-between font-Kanit w-full md:w-3/4 rounded-md">
                      <div className="flex justify-start items-center ml-5 gap-2">
                        <div className="w-10 h-10  rounded-full bg-gray-100 flex items-center justify-center">
                          <div className="flex items-center justify-center text-gray-400 text-3xl">
                            <BiErrorCircle />
                          </div>
                        </div>
                        <span className=" font-semibold text-lg">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="w-14 text-center rounded-sm p-2 mr-5 text-sm bg-gray-500 text-white">
                        <span>ไม่มีข้อมูล</span>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default Index;
