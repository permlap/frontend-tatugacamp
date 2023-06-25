import React, { useEffect, useState } from "react";
import Layout from "../../../../../layouts/classroomLayout";
import Unauthorized from "../../../../../components/error/unauthorized";
import { useRouter } from "next/router";
import { GetUser, GetUserCookie } from "../../../../../service/user";
import { useQuery } from "react-query";
import { FiArrowLeftCircle } from "react-icons/fi";
import { GetAllStudentScores } from "../../../../../service/students";
import Head from "next/head";
import { BiMessageAltError } from "react-icons/bi";
import { Skeleton } from "@mui/material";
import { SiMicrosoftexcel } from "react-icons/si";
import { DownloadExcelScore } from "../../../../../service/dowloadFile";
import Swal from "sweetalert2";
import { parseCookies } from "nookies";
import {
  sideMenusEnglish,
  sideMenusThai,
} from "../../../../../data/menubarsScores";

function Index({ user, error }) {
  const router = useRouter();
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === "Thai") {
      return sideMenusThai();
    } else if (user?.language === "English") {
      return sideMenusEnglish();
    }
  });
  const studentsScores = useQuery(
    ["studentsScores"],
    () => GetAllStudentScores({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  //check whether there is authorrized acccess or not
  useEffect(() => {
    studentsScores.refetch();
  }, [router.isReady]);

  const handleDownloadFile = async () => {
    try {
      await DownloadExcelScore({ classroomId: router.query.classroomId });
      Swal.fire(
        "ดาวโหลดสำเร็จ",
        "ดาวโหลดไฟล์รายงานผลคะแนนเรียบร้อย",
        "success"
      );
    } catch (err) {
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      console.log(err);
    }
  };
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }
  return (
    <div className="w-full font-Kanit bg-blue-50 pb-40">
      <Head>
        <title>overall score</title>
      </Head>
      <Layout language={user.language} sideMenus={sideMenus} />
      <div className=" w-full flex flex-col items-center justify-start mt-10">
        <button
          className="w-max px-5 flex gap-1 mb-2 hover:scale-105 transition duration-150 active:bg-blue-800 bg-blue-500 font-Poppins font-semibold text-white rounded-lg py-2"
          onClick={handleDownloadFile}
        >
          dowload
          <div>
            <SiMicrosoftexcel />
          </div>
        </button>
        {studentsScores.isLoading || studentsScores.isFetching ? (
          <div className="flex flex-col gap-5 mt-5">
            <Skeleton variant="rectangular" width={700} height={40} />
            <Skeleton variant="rectangular" width={600} height={40} />
            <Skeleton variant="rectangular" width={800} height={40} />
          </div>
        ) : studentsScores?.data?.data?.assignments.length === 0 ? (
          <div className="w-full  flex items-center justify-center h-full text-3xl mt-5">
            <span>
              {user.language === "Thai" &&
                "ไม่มีข้อมูลเนื่องจากไม่ได้มอบหมายงานให้ผู้เรียน"}
              {user.language === "English" && "No data due to no assignments"}
            </span>
            <div className="text-red-400">
              <BiMessageAltError />
            </div>
          </div>
        ) : (
          <table
            className=" h-full  max-h-[40rem] flex flex-col w-80 md:w-[40rem]
              lg:w-[80rem] bg-white rounded-md font-Kanit overflow-x-auto relative"
          >
            <thead className="w-max sticky top-0 bg-white h-max py-3 z-10">
              <tr className="flex ">
                <th className="flex w-10 md:w-24  items-center justify-center sticky left-0 bg-white">
                  {user.language === "Thai" && "เลขที่"}
                  {user.language === "English" && "number"}
                </th>
                <th className="w-40 md:w-44 lg:w-60 flex items-center justify-center sticky left-10 md:left-20 bg-white">
                  {user.language === "Thai" && "รายชื่อ"}
                  {user.language === "English" && "student's name"}
                </th>

                {studentsScores?.data?.data?.assignments.map((assignment) => {
                  const date = new Date(assignment.createAt);
                  const formattedDate = date.toLocaleDateString(
                    `${
                      user.language === "Thai"
                        ? "th-TH"
                        : user.language === "English" && "en-US"
                    }`,
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  );
                  return (
                    <th key={assignment.id} className=" w-40 truncate ">
                      <div className="flex  flex-col items-center justify-center">
                        <span className="text-sm truncate w-40">
                          {assignment.title}
                        </span>
                        <span className="text-sm font-normal">
                          {user.language === "Thai" && "คะแนนเต็ม"}
                          {user.language === "English" && "scores"} {` `}
                          {assignment.maxScore}
                        </span>
                        <span className="font-normal italic">
                          ({formattedDate})
                        </span>
                      </div>
                    </th>
                  );
                })}
                <th className=" w-40">
                  {user.language === "Thai" && "คะแนนพิเศษ"}
                  {user.language === "English" && "motivative scores"}
                </th>
                <th className=" w-40">
                  {user.language === "Thai" && "รวม"}
                  {user.language === "English" && "sum"}
                </th>
                <th className=" w-40">
                  {user.language === "Thai" && "เกรด"}
                  {user.language === "English" && "grade"}
                </th>
              </tr>
            </thead>
            <tbody className="w-max">
              {studentsScores?.data?.data?.studentsScores.map((student) => {
                const totalScore =
                  student.totalPoints + student.score.totalPoints;

                return (
                  <tr
                    key={student.id}
                    className="flex hover:ring-2 hover:bg-slate-200 group "
                  >
                    <th className="w-10 md:w-24 text-center flex items-center justify-center bg-white group-hover:bg-slate-200 sticky left-0">
                      {student.number}
                    </th>
                    <td
                      className="w-40 md:w-44 lg:w-60  py-4 sticky left-16 flex 
                    items-center justify-start text-xs lg:text-sm md:text-base md:left-20'
                     bg-white group-hover:bg-slate-200 "
                    >
                      {student.firstName} {student?.lastName}
                    </td>
                    {student.studentWorks.map((studentWork, index) => {
                      return (
                        <td
                          key={index}
                          className="w-40 text-center  flex items-center justify-center"
                        >
                          {!studentWork.studentWork
                            ? "0"
                            : studentWork.studentWork.score}
                        </td>
                      );
                    })}
                    <td className=" w-40 text-center  flex items-center justify-center">
                      {student.score.totalPoints}
                    </td>
                    <td className=" w-40 text-center  flex items-center justify-center">
                      {totalScore.toFixed(2)}
                    </td>
                    <td className=" w-40 text-center  flex items-center justify-center">
                      {student.grade}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Index;
export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken && !query.access_token) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: "unauthorized",
        },
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  }
}
