import React, { useEffect } from "react";
import Layout from "../../../../../layouts/classroomLayout";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { FiArrowLeftCircle } from "react-icons/fi";
import { GetAllStudents } from "../../../../../service/students";
import {
  DeleteAttendance,
  GetAllAttendance,
} from "../../../../../service/attendance";
import Unauthorized from "../../../../../components/error/unauthorized";
import { DeleteForever } from "@mui/icons-material";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import UpdateAttendance from "../../../../../components/form/updateAttendance";
import { Popover } from "@headlessui/react";
import { BiMessageAltError } from "react-icons/bi";
import { DownloadExcelAttendance } from "../../../../../service/dowloadFile";
import { SiMicrosoftexcel } from "react-icons/si";
import { Skeleton } from "@mui/material";

function Index() {
  const router = useRouter();
  const user = useQuery(["user"], () => GetUser());
  const attendances = useQuery(
    ["attendance"],
    () => GetAllAttendance({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  useEffect(() => {
    attendances.refetch();
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
      url: `#`,
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

  const handleDeleteAttendance = async ({ groupId }) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteAttendance = await DeleteAttendance({ groupId });
          Swal.fire("Deleted!", groupId, "success");
          attendances.refetch();
        } catch (err) {
          console.log(err);
          Swal.fire("Error!", "something went wrong", "error");
        }
      }
    });
  };

  const handleDownloadFile = async () => {
    try {
      await DownloadExcelAttendance({ classroomId: router.query.classroomId });
      Swal.fire(
        "ดาวโหลดสำเร็จ",
        "ดาวโหลดไฟล์รายงานผลเข้าเรียนเรียบร้อย",
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

  return (
    <div className="bg-blue-50">
      <Layout sideMenus={sideMenus}>
        <div className="w-full h-full mt-10 flex flex-col justify-center items-center pb-10">
          <button
            className="w-max px-5 flex gap-1 mb-2 hover:scale-105 transition duration-150 active:bg-blue-800 bg-blue-500 font-Poppins font-semibold text-white rounded-lg py-2"
            onClick={handleDownloadFile}
          >
            dowload
            <div>
              <SiMicrosoftexcel />
            </div>
          </button>
          <div className=" h-[40rem]  flex flex-col  w-[80rem] bg-white rounded-md font-Kanit overflow-auto relative">
            <div className="grid grid-cols-12 place-items-center py-3 bg-white w-max sticky z-10  top-0 drop-shadow-md ">
              <div className="col-span-1 w-20 flex items-center justify-center mr-5">
                เลขที่
              </div>
              <div className="col-span-2 w-60 text-center items-center justify-center flex">
                <span className="text-center">รายชื่อ</span>
              </div>
              <div className="col-span-9 flex w-full gap-5 ">
                {attendances?.data?.data.map((item, index) => {
                  if (index === 0) {
                    return (
                      <div
                        key={index}
                        className="col-span-9 flex w-full gap-5 "
                      >
                        {item.data.map((status) => {
                          const date = new Date(status.date);
                          const formattedDate = date.toLocaleDateString(
                            "th-TH",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          );

                          return (
                            <div
                              onClick={() =>
                                handleDeleteAttendance({
                                  groupId: status.groupId,
                                })
                              }
                              key={status.groupId}
                              className="w-20 ring-2 ring-black rounded-lg ring-offset-2  h-8 flex items-center justify-center group cursor-pointer "
                            >
                              <div className="w-20 text-sm flex items-center justify-center py-1 rounded-lg text-black">
                                <span className="block group-hover:hidden">
                                  {formattedDate}
                                </span>
                                <div
                                  className="group-hover:visible invisible h-0 w-0 flex items-center text-black group-hover:text-red-500 
                                justify-center group-hover:w-5 group-hover:scale-150 transition duration-150"
                                >
                                  <MdDelete />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            {attendances.isLoading ? (
              <div className="flex flex-col gap-5 items-center">
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
                <div className="w-full flex justify-center items-center gap-5">
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="text" width="80%" height={40} />
                </div>
              </div>
            ) : (
              attendances?.data?.data.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 place-items-center mt-2 w-max "
                  >
                    <div className="col-span-1 w-20 flex items-center justify-center mr-5">
                      {item.student.number}
                    </div>
                    <div className="col-span-2 w-60 text-left flex ">
                      <span className="text-left">
                        {item.student.firstName} {item.student.lastName}
                      </span>
                    </div>
                    <div className="col-span-9 flex w-full gap-5 ">
                      {item.data.map((status) => {
                        return (
                          <Popover key={status.id}>
                            {({ open }) => (
                              <div>
                                <Popover.Button
                                  onClick={() => {
                                    document.body.style.overflow = "hidden";
                                  }}
                                >
                                  <div className="w-20 flex items-center justify-center ">
                                    {status.present && (
                                      <div className="bg-green-600 w-20 flex items-center justify-center py-1 rounded-lg text-white">
                                        มาเรียน
                                      </div>
                                    )}
                                    {status.absent && (
                                      <div className="bg-red-600 w-20 flex items-center justify-center py-1 rounded-lg text-white">
                                        ขาด
                                      </div>
                                    )}
                                    {status.holiday && (
                                      <div className="bg-yellow-500 w-20 flex items-center justify-center py-1 rounded-lg text-white">
                                        ลา
                                      </div>
                                    )}
                                    {!status.holiday &&
                                      !status.absent &&
                                      !status.present && (
                                        <div className="bg-gray-600 w-20 flex items-center justify-center py-1 rounded-lg text-white">
                                          ไม่มีข้อมูล
                                        </div>
                                      )}
                                  </div>
                                </Popover.Button>
                                <Popover.Panel>
                                  {({ close }) => (
                                    <UpdateAttendance
                                      attendances={attendances}
                                      close={close}
                                      student={item.student}
                                      attendanceData={status}
                                    />
                                  )}
                                </Popover.Panel>
                              </div>
                            )}
                          </Popover>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

            {attendances?.data?.data?.length === 0 && (
              <div className="w-full flex items-center justify-center h-full text-8xl">
                <span>ไม่มีข้อมูล</span>
                <div className="text-red-400">
                  <BiMessageAltError />
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Index;
