import React, { useEffect } from "react";
import Layout from "../../../../../layouts/classroomLayout";
import Unauthorized from "../../../../../components/error/unauthorized";
import { useRouter } from "next/router";
import { GetUser } from "../../../../../service/user";
import { useQuery } from "react-query";
import { FiArrowLeftCircle } from "react-icons/fi";
import { GetAllStudentScores } from "../../../../../service/students";
import Head from "next/head";
import { BiMessageAltError } from "react-icons/bi";

function Index() {
  const router = useRouter();
  const user = useQuery(["user"], () => GetUser());
  const studentsScores = useQuery(
    ["studentsScores"],
    () => GetAllStudentScores({ classroomId: router.query.classroomId }),
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
      studentsScores.refetch();
    }
  }, [router.isReady]);
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
      url: `/classroom/teacher/${router.query.classroomId}/assignment`,
    },
    {
      title: "ข้อมูลการเข้าเรียน",
      icon: "🙌",
      url: `/classroom/teacher/${router.query.classroomId}/attendance`,
    },
    {
      title: "คะแนนรวม",
      icon: "🥇",
      url: `/classroom/teacher/${router.query.classroomId}/scores`,
    },

    {
      title: "หน้าหลัก",
      icon: <FiArrowLeftCircle />,
      url: `/`,
    },
  ];
  if (!user.data || user.isError) {
    return <Unauthorized user={user} />;
  }

  return (
    <div className="w-full font-Kanit bg-blue-50 pb-40">
      <Head>
        <title>overall score</title>
      </Head>
      <Layout sideMenus={sideMenus} />
      <div className=" w-full flex items-start justify-center mt-10">
        <div className="relative max-w-[80rem] w-max h-[40rem] bg-white overflow-auto border-2 border-solid rounded-lg mb-20">
          {studentsScores?.data?.data?.assignments.length === 0 ? (
            <div className="w-full  flex items-center justify-center h-full text-8xl">
              <span>ไม่มีข้อมูล</span>
              <div className="text-red-400">
                <BiMessageAltError />
              </div>
            </div>
          ) : (
            <table className="border-collapse w-max ">
              <thead className="sticky top-0 bg-white drop-shadow-lg">
                <tr className="border-b border-0 border-solid border-slate-700">
                  <th scope="col" className="px-6 py-3 w-20">
                    เลขที่
                  </th>
                  <th scope="col" className="px-6 py-3 w-60">
                    รายชื่อ
                  </th>

                  {studentsScores?.data?.data?.assignments.map((assignment) => {
                    const date = new Date(assignment.createAt);
                    const formattedDate = date.toLocaleDateString("th-TH", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    return (
                      <th
                        key={assignment.id}
                        scope="col"
                        className="px-6 py-3  "
                      >
                        <div className="flex   max-w-xs  flex-col items-center justify-center">
                          <span className="text-sm"> {assignment.title}</span>
                          <span className="text-sm font-normal">
                            คะแนนเต็ม {assignment.maxScore}
                          </span>
                          <span className="font-normal italic">
                            ({formattedDate})
                          </span>
                        </div>
                      </th>
                    );
                  })}
                  <th scope="col" className="px-6 py-3 w-28">
                    คะแนนความประพฤติ
                  </th>
                  <th scope="col" className="px-6 py-3 w-20">
                    รวม
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsScores?.data?.data?.studentsScores.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="border-b border-0 border-solid border-slate-700"
                    >
                      <th scope="row" className="px-6 py-4 text-center">
                        {student.number}
                      </th>
                      <td className="px-6 py-4">
                        {student.firstName} {student?.lastName}
                      </td>
                      {student.studentWorks.map((studentWork, index) => {
                        return (
                          <td key={index} className="px-6 py-4 text-center">
                            {!studentWork.studentWork
                              ? "0"
                              : studentWork.studentWork.score}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-center">
                        {student.score.totalPoints}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Index;
