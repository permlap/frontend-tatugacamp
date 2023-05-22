import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  DeleteAssignment,
  DeleteStudentWork,
  ReviewStudentWork,
  ReviewStudentWorkNoWork,
  ViewAllAssignOnStudent,
} from "../../../../../../service/assignment.js";
import { FiSettings } from "react-icons/fi";
import { Box, Skeleton, TextField } from "@mui/material";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Image from "next/image";
import "lightbox.js-react/dist/index.css";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import { GetAssignment } from "../../../../../../service/assignment";
import { useRouter } from "next/router";
import { GetAllStudents } from "../../../../../../service/students";
import UpdateAssignment from "../../../../../../components/form/updateAssignment.js";
import Unauthorized from "../../../../../../components/error/unauthorized.js";
import { GetUser } from "../../../../../../service/user.js";
import { BiRefresh } from "react-icons/bi";
import Head from "next/head.js";
function Index() {
  const router = useRouter();
  const [triggerUpdateAssignment, setTriggerUpdateAssignment] = useState(false);
  const user = useQuery(["user"], () => GetUser());
  const assignment = useQuery(
    ["assignment"],
    () => GetAssignment({ assignmentId: router.query.assignmentId }),
    {
      enabled: false,
    }
  );
  const students = useQuery(["students"], () => {
    GetAllStudents({ classroomId: router.query.classroomId });
  });
  const studentOnAssignments = useQuery(
    ["studentOnAssignments"],
    () =>
      ViewAllAssignOnStudent({
        assignmentId: assignment.data.data.id,
        classroomId: router.query.classroomId,
      }),
    {
      enabled: assignment.isSuccess,
    }
  );
  const [activeMenu, setActiveMenu] = useState(0);
  const [teacherReview, setTeacherReview] = useState({
    comment: "",
    score: "",
  });
  const [currentStudentWork, setCurrentStudentWork] = useState();
  const [images, setImages] = useState([]);
  const menus = [
    {
      title: "assignment",
    },
    {
      title: "ตรวจงาน",
    },
  ];

  useEffect(() => {
    initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_KEY, "individual");
  }, []);

  // refetch studentOnAssinment when  there is new assignment?.data?.data?
  useEffect(() => {
    students.refetch();
    assignment.refetch();
  }, [router.isReady]);

  // convert date format
  const date = new Date(assignment?.data?.data?.deadline);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  //handle show update assignmnet compponent
  const handleClickUpdateAssignment = () => {
    setTriggerUpdateAssignment(true);
  };
  const handleDelteStudentWork = async () => {
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
        const deleteStudentWork = await DeleteStudentWork({
          assignmentId: assignment?.data?.data?.id,
          studentId: currentStudentWork.id,
        });
        studentOnAssignments.refetch();
        Swal.fire("Deleted!", deleteStudentWork?.data, "success");
      }
    });
  };

  //handle click to delete assignment
  const handleDeleteAssignment = () => {
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
        const deleteAssignment = await DeleteAssignment({
          assignmentId: assignment?.data?.data?.id,
        });

        Swal.fire("Deleted!", deleteAssignment?.data, "success");
        router.push({
          pathname: `/classroom/teacher/${router.query.classroomId}/assignment`,
        });
      }
    });
  };

  //handle trigger menu
  const handleMenuTrigger = (index) => {
    if (index === 1) {
      studentOnAssignments.refetch();
    }
    setActiveMenu(index);
  };

  //handle select student's work
  const handleSelectWork = (student) => {
    if (student.studentWork) {
      setImages(() => {
        let pictures = [];
        if (!student?.studentWork?.picture) {
          pictures.push({ src: "", alt: "student's work" });
        } else if (student.studentWork.picture) {
          const arrayPictures = student.studentWork.picture.split(", ");
          for (const arrayPicture of arrayPictures) {
            pictures.push({ src: arrayPicture, alt: "student's work" });
          }

          return pictures;
        }
      });
    } else if (!student.studentWork) {
      setImages(null);
    }

    setCurrentStudentWork(student);
    setTeacherReview((prev) => {
      return {
        ...prev,
        comment: !student?.studentWork?.comment
          ? ""
          : student?.studentWork?.comment,
        score: !student?.studentWork?.score ? "" : student?.studentWork?.score,
      };
    });
  };
  const handleReviewWork = async (e) => {
    try {
      e.preventDefault();

      if (currentStudentWork.status === "have-work") {
        const reviewWork = await ReviewStudentWork({
          studentId: currentStudentWork.id,
          assignmentId: assignment?.data?.data?.id,
          comment: teacherReview.comment,
          score: teacherReview.score,
        });

        studentOnAssignments.refetch();
        Swal.fire("success", "ตรวจงานเรียบร้อย", "success");
      } else if (currentStudentWork.status === "no-work") {
        const reviewWork = await ReviewStudentWorkNoWork({
          studentId: currentStudentWork.id,
          assignmentId: assignment?.data?.data?.id,
          comment: teacherReview.comment,
          score: teacherReview.score,
        });
        studentOnAssignments.refetch();
        setCurrentStudentWork(reviewWork.data);

        Swal.fire("success", "ตรวจงานเรียบร้อย", "success");
      }
    } catch (err) {
      console.log(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.error?.message?.toString(),
        "error"
      );
    }
  };

  const handleOnChangeReviewWork = (e) => {
    const { name, value } = e.target;
    setTeacherReview((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  if (!user.data || user.isError) {
    return <Unauthorized user={user} />;
  }

  return (
    <div className="bg-white w-full font-Kanit relative">
      <Head>
        <title>assignment - {assignment?.data?.data?.title}</title>
      </Head>
      {triggerUpdateAssignment ? (
        <UpdateAssignment
          students={students}
          assignment={assignment}
          setTriggerUpdateAssignment={setTriggerUpdateAssignment}
          studentOnAssignments={studentOnAssignments}
        />
      ) : (
        <div className="h-screen ">
          {/* menu bars */}

          <div className=" w-full  absolute top-4 right-0 left-0 m-auto  rounded-xl flex  justify-center gap-9">
            {menus.map((menu, index) => {
              return (
                <div
                  onClick={() => handleMenuTrigger(index)}
                  key={index}
                  className=" hover:font-bold w-max hover:cursor-pointer text-xl font-Kanit 
                font-normal flex items-center  group justify-center underLineHover transition duration-150"
                >
                  <span
                    className={`text-[#2C7CD1] ${
                      activeMenu === index ? "font-bold" : "font-normal"
                    }`}
                  >
                    {menu.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center w-full h-full">
            <button
              onClick={() =>
                router.push({
                  pathname: `/classroom/teacher/${router.query.classroomId}/assignment/`,
                })
              }
              className="font-Poppins z-20 hover:scale-110 transition duration-150 absolute top-2 left-2 text-white bg-blue-500 px-5 py-3 rounded-xl "
            >
              back
            </button>
            {/* assignment detail */}
            {activeMenu === 0 && (
              <div className="w-full px-10 flex flex-col justify-around  h-full ">
                <div className="flex justify-between mt-20">
                  <span className="lg:text-4xl">
                    {assignment.isLoading ? (
                      <Skeleton variant="text" />
                    ) : (
                      assignment?.data?.data?.title
                    )}
                  </span>
                  <div className="flex items-center justify-center flex-col">
                    <div
                      className="w-20 h-10 rounded-xl flex items-center justify-center
              bg-orange-400 font-Poppins font-bold text-xl text-white"
                    >
                      {assignment.isLoading ? (
                        <Skeleton variant="text" />
                      ) : (
                        assignment?.data?.data?.maxScore
                      )}
                    </div>
                    <span>คะแนนเต็ม</span>
                  </div>
                </div>

                <div className="w-full h-[2px] bg-blue-900 rounded-full"></div>
                <div className="mt-5 font-Kanit text-xl w-full h-[25rem] overflow-auto">
                  {assignment.isLoading ? (
                    <div>
                      <Skeleton variant="text" width="50%" />
                      <Skeleton variant="text" width="50%" />
                      <Skeleton variant="text" width="55%" />
                      <Skeleton variant="text" width="55%" />
                      <Skeleton variant="text" width="55%" />
                    </div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: assignment?.data?.data?.description,
                      }}
                    />
                  )}
                </div>
                <div className="flex pb-5 gap-2 items-end mt-5 justify-between">
                  <div>
                    <span>กำหนดส่ง</span>
                    <span className="text-xl ml-2 font-semibold text-red-500">
                      {formattedDate}
                    </span>
                  </div>
                  <div className="flex gap-6">
                    <div
                      onClick={handleDeleteAssignment}
                      className="text-xl text-red-600 flex items-center justify-center flex-col hover:scale-110 
                  transition duration-150 ease-in-out cursor-pointer"
                    >
                      <MdDelete />
                      <span className="text-sm">ลบงาน</span>
                    </div>
                    <div
                      onClick={handleClickUpdateAssignment}
                      className="text-xl flex flex-col items-center justify-center hover:scale-110 transition duration-150 cursor-pointer
            "
                    >
                      <FiSettings />
                      <span className="text-sm">แก้ไข</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* student's assignment */}
            {activeMenu === 1 && (
              <div className="flex items-center justify-start w-full h-full gap-5   ">
                <div className="w-[60rem] sticky flex flex-col h-full items-center justify-center ">
                  <div className="text-xl font-Kanit font-semibold flex justify-center items-center gap-2">
                    <span>สถานะการส่งงานของผู้เรียน</span>

                    <button
                      onClick={() => studentOnAssignments.refetch()}
                      className="flex cursor-pointer items-center justify-center hover:scale-110 transition duration-150
                      active:bg-orange-800
                     text-4xl bg-orange-500 w-8 h-8 rounded-full text-white"
                    >
                      <BiRefresh />
                    </button>
                  </div>
                  <ul className="w-full list-none pl-0">
                    <li className="grid grid-cols-4 mt-4 gap-2 text-xl ">
                      <div className="flex justify-center">เลขที่</div>
                      <div className="flex items-center justify-center">
                        ชื่อ
                      </div>
                      <div className="flex items-center justify-center">
                        คะแนน
                      </div>
                      <div className="flex items-center justify-start">
                        สถานะ
                      </div>
                    </li>
                    <div className="h-[32rem] w-full overflow-auto">
                      {studentOnAssignments.isLoading ||
                        (studentOnAssignments.isFetching ? (
                          <div className="flex flex-col items-center justify-start mt-5 gap-5">
                            <Skeleton
                              variant="rounded"
                              animation="wave"
                              width="80%"
                            />
                            <Skeleton
                              variant="rounded"
                              animation="wave"
                              width="80%"
                            />
                            <Skeleton
                              variant="rounded"
                              animation="wave"
                              width="80%"
                            />
                            <Skeleton
                              variant="rounded"
                              animation="wave"
                              width="80%"
                            />
                            <Skeleton
                              variant="rounded"
                              animation="wave"
                              width="80%"
                            />
                            <Skeleton
                              variant="rounded"
                              animation="wave"
                              width="80%"
                            />
                            <Skeleton
                              variant="rounded"
                              animation="wave"
                              width="80%"
                            />
                          </div>
                        ) : (
                          studentOnAssignments?.data?.data?.map(
                            (student, index) => {
                              return (
                                <li
                                  key={index}
                                  className="grid grid-cols-4 gap-2 py-2  "
                                >
                                  <div className="flex justify-center">
                                    {student.number}
                                  </div>
                                  <div className="flex items-center justify-center">
                                    {student.firstName}
                                  </div>
                                  {student?.studentWork?.score ? (
                                    <div className="flex items-center justify-center font-Kanit font-bold text-gray-700">
                                      {student.studentWork.score}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center font-Kanit font-bold text-gray-700">
                                      0
                                    </div>
                                  )}
                                  {student.status === "no-work" && (
                                    <div
                                      onClick={() => handleSelectWork(student)}
                                      className="w-max bg-red-500 py-1 px-2 rounded-lg text-white cursor-pointer 
                                      hover:scale-105 transition duration-150"
                                    >
                                      ไม่ส่งงาน
                                    </div>
                                  )}
                                  {student.status === "have-work" &&
                                    student.studentWork.score === 0 &&
                                    student.studentWork.isSummited ===
                                      false && (
                                      <div
                                        onClick={() =>
                                          handleSelectWork(student)
                                        }
                                        className=" w-max cursor-pointer hover:scale-105 transition duration-150
                                         bg-yellow-500 py-1 px-2 rounded-lg text-white"
                                      >
                                        รอการตรวจ
                                      </div>
                                    )}
                                  {student.status === "no-assign" && (
                                    <div className="w-max bg-gray-500 py-1 px-2 rounded-lg text-white">
                                      ไม่ได้มอบหมาย
                                    </div>
                                  )}
                                  {student.status === "have-work" &&
                                    student.studentWork.isSummited === true && (
                                      <div
                                        onClick={() =>
                                          handleSelectWork(student)
                                        }
                                        className="w-max bg-green-500 py-1 px-2 cursor-pointer hover:scale-105 transition duration-150 rounded-lg text-white"
                                      >
                                        ตรวจแล้ว
                                      </div>
                                    )}
                                </li>
                              );
                            }
                          )
                        ))}
                    </div>
                  </ul>
                </div>

                {/* review student work section */}
                <div className="flex flex-col w-full items-center justify-between h-full">
                  <div className="flex w-full justify-between mt-10 ">
                    <div className="flex items-center justify-center relative">
                      <div className="text-3xl font-Kanit flex">
                        <span>งานของผู้เรียน</span>
                        {currentStudentWork?.status === "have-work" && (
                          <div
                            onClick={handleDelteStudentWork}
                            className="flex items-center justify-center text-red-500 cursor-pointer
                        hover:text-red-800 transition duration-150"
                          >
                            <MdDelete />
                          </div>
                        )}
                      </div>
                      <div className="w-96 h-[2px] bg-blue-700 absolute left-0 bottom-2"></div>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                      <div className="text-2xl">
                        {currentStudentWork?.number}
                      </div>
                      <div className="text-2xl">
                        {currentStudentWork?.firstName}
                      </div>
                      <div className="w-16 h-16 relative rounded-full overflow-hidden bg-blue-100 mr-4">
                        <Image
                          src={currentStudentWork?.picture}
                          layout="fill"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="">
                    {currentStudentWork && images && images !== null ? (
                      <SlideshowLightbox
                        downloadImages={true}
                        lightboxIdentifier="lightbox1"
                        showThumbnails={true}
                        framework="next"
                        images={images}
                        theme="day"
                        className={`container grid ${
                          images.length === 1 ? "grid-cols-1" : "grid-cols-3"
                        } w-[40rem] mx-auto h-full items-center gap-2 place-items-center
                         `}
                      >
                        {images.map((image, index) => {
                          return (
                            <Image
                              key={index}
                              src={image.src}
                              alt="student's work"
                              width={240}
                              height={160}
                              className="object-cover"
                              data-lightboxjs="lightbox1"
                              quality={80}
                              placeholder="blur"
                              blurDataURL="/logo/TaTuga camp.png"
                            />
                          );
                        })}
                      </SlideshowLightbox>
                    ) : (
                      <div
                        className="w-full h-72 flex items-center justify-center font-Kanit
                      font-bold text-5xl text-gray-300"
                      >
                        {currentStudentWork?.status === "no-work" &&
                          "ผู้เรียนยังไม่ส่งงาน"}
                        {currentStudentWork?.status === "have-work" &&
                          "ผู้เรียนยังไม่ส่งงาน"}
                        {!currentStudentWork && "โปรดเลือกงาน"}
                      </div>
                    )}
                  </div>
                  {currentStudentWork?.studentWork?.body && (
                    <div className="w-full  h-max mt-5 flex items-start  relative ">
                      <div className="w-6 left-[5.2rem] top-1 overflow-hidden  inline-block absolute ">
                        <div className=" h-10  bg-blue-100 -rotate-45 transform origin-top-right"></div>
                      </div>

                      <div className="w-max max-w-2xl ml-5 bg-blue-100 rounded-lg h-max relative overflow-auto p-2">
                        <div className="text-md ml-4 font-bold">
                          {currentStudentWork?.firstName}
                        </div>

                        <div
                          className="pl-4"
                          dangerouslySetInnerHTML={{
                            __html: currentStudentWork?.studentWork?.body,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {teacherReview.comment && (
                    <div className=" w-full  h-max mt-5 flex items-start justify-end   relative ">
                      <div className="w-max max-w-xl pr-10 mr-5 bg-blue-100 rounded-lg h-full relative  p-2">
                        <div className="text-md ml-4 font-bold">teacher</div>
                        <div
                          className="pl-4 "
                          style={{
                            wordWrap: "break-word",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: teacherReview.comment,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleReviewWork}
                    className="w-full flex justify-center gap-5 mt-10 pb-10"
                  >
                    <Box width="50%">
                      <TextField
                        name="comment"
                        onChange={handleOnChangeReviewWork}
                        fullWidth
                        value={teacherReview.comment}
                        label="comment"
                      />
                    </Box>
                    <Box width="20%" className="relative ">
                      <TextField
                        fullWidth
                        label="คะแนน"
                        type="number"
                        name="score"
                        value={teacherReview.score}
                        onChange={handleOnChangeReviewWork}
                      />
                      <span className="font-Poppins absolute top-4 right-5">
                        /{assignment?.data?.data?.maxScore}
                      </span>
                    </Box>
                    <button
                      className="w-20  h-9 mt-2 rounded-full bg-[#2C7CD1] hover:bg-red-500 tranti duration-150
                       text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
                    >
                      ส่ง
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;
