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
import { GetUser, GetUserCookie } from "../../../../../../service/user.js";
import { BiRefresh } from "react-icons/bi";
import Head from "next/head.js";
import { GetComments, PostComment } from "../../../../../../service/comment.js";
import SendIcon from "@mui/icons-material/Send";
import { parseCookies } from "nookies";

const MAX_DECIMAL_PLACES = 2; // Maximum number of decimal places allowed

const validateScore = (value) => {
  const regex = new RegExp(`^[0-9]+(\\.[0-9]{0,${MAX_DECIMAL_PLACES}})?$`);
  return regex.test(value);
};

function Index({ error, user }) {
  const router = useRouter();
  const [triggerUpdateAssignment, setTriggerUpdateAssignment] = useState(false);
  const [comment, setComment] = useState();
  const [files, setFiles] = useState([]);
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
      titleThai: "งาน",
      titleEnglish: "assignment",
    },
    {
      titleThai: "ตรวจงาน",
      titleEnglish: "check assignment",
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
  const formattedDate = date.toLocaleDateString(
    `${
      user?.language === "Thai"
        ? "th-TH"
        : user?.language === "English" && "en-US"
    }`,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

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

  // check file type
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  //handle select student's work
  const handleSelectWork = async (student) => {
    try {
      if (student.studentWork) {
        setFiles(() => []);
        setImages(() => {
          let pictures = [];
          if (!student?.studentWork?.picture) {
            pictures.push({ src: "", alt: "student's work" });
          } else if (student.studentWork.picture) {
            const arrayPictures = student.studentWork.picture.split(", ");
            for (const arrayPicture of arrayPictures) {
              const fileType = get_url_extension(arrayPicture);
              if (
                fileType === "jpg" ||
                fileType === "jpeg" ||
                fileType === "png" ||
                fileType === "HEIC"
              ) {
                pictures.push({ src: arrayPicture, alt: "student's work" });
              } else {
                setFiles((prev) => {
                  return [
                    ...prev,
                    {
                      fileType: fileType,
                      url: arrayPicture,
                    },
                  ];
                });
              }
            }

            return pictures;
          }
        });
      } else if (!student.studentWork) {
        setFiles(() => []);
        setImages(null);
      }
      setCurrentStudentWork(student);
      setTeacherReview((prev) => {
        return {
          ...prev,
          comment: !student?.studentWork?.comment
            ? ""
            : student?.studentWork?.comment,
          score: !student?.studentWork?.score
            ? ""
            : student?.studentWork?.score,
        };
      });
      const comment = await GetComments({
        assignmentId: router.query.assignmentId,
        studentId: student.id,
      });
      setComment(() => comment.data);
    } catch (err) {
      console.log(err);
    }
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
        Swal.fire("success", "ตรวจงานเรียบร้อย", "success");
        studentOnAssignments.refetch();
        const nextStudentNumber = parseInt(currentStudentWork.number) + 1;
        // Check if the current student is the last student
        if (nextStudentNumber > studentOnAssignments.data.data.length) {
          // Set nextStudentNumber to the first student's number
          nextStudentNumber = 1;
        }
        const nextStudent = studentOnAssignments.data.data.find(
          (student) => parseInt(student.number) === nextStudentNumber
        );

        handleSelectWork(nextStudent);
      } else if (currentStudentWork.status === "no-work") {
        const reviewWork = await ReviewStudentWorkNoWork({
          studentId: currentStudentWork.id,
          assignmentId: assignment?.data?.data?.id,
          comment: teacherReview.comment,
          score: teacherReview.score,
        });
        Swal.fire("success", "ตรวจงานเรียบร้อย", "success");
        studentOnAssignments.refetch();

        const nextStudentNumber = parseInt(currentStudentWork.number) + 1;
        // Check if the current student is the last student
        if (nextStudentNumber > studentOnAssignments.data.data.length) {
          // Set nextStudentNumber to the first student's number
          nextStudentNumber = 1;
        }
        const nextStudent = studentOnAssignments.data.data.find(
          (student) => parseInt(student.number) === nextStudentNumber
        );

        handleSelectWork(nextStudent);
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

  //handle post comment for user
  const handlePostComment = async (e) => {
    try {
      e.preventDefault();
      setTeacherReview((prev) => {
        return {
          ...prev,
          comment: "",
        };
      });
      await PostComment({
        assignmentId: assignment?.data?.data?.id,
        studentId: currentStudentWork.id,
        body: teacherReview.comment,
      });
      const comment = await GetComments({
        assignmentId: assignment?.data?.data?.id,
        studentId: currentStudentWork.id,
      });
      setComment(() => comment.data);
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

    if (value === "" || (validateScore(value) && name === "score")) {
      setTeacherReview((prev) => {
        return {
          ...prev,
          score: value,
        };
      });
    } else if (name === "comment") {
      setTeacherReview((prev) => {
        return {
          ...prev,
          comment: value,
        };
      });
    }
  };
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }
  return (
    <div className="bg-white w-full font-Kanit relative">
      <Head>
        <title>assignment - {assignment?.data?.data?.title}</title>
      </Head>
      {triggerUpdateAssignment ? (
        <UpdateAssignment
          language={user.language}
          students={students}
          assignment={assignment}
          setTriggerUpdateAssignment={setTriggerUpdateAssignment}
          studentOnAssignments={studentOnAssignments}
        />
      ) : (
        <div className="h-full ">
          {/* menu bars */}

          <div className=" w-full h-20 drop-shadow-md bg-white z-10 flex sticky top-0  justify-center gap-9">
            <button
              onClick={() =>
                router.push({
                  pathname: `/classroom/teacher/${router.query.classroomId}/assignment/`,
                })
              }
              className="font-Poppins z-20 hover:scale-110 transition 
              duration-150 absolute top-3 left-2 text-white bg-blue-500 px-5 py-3 rounded-xl "
            >
              {user.language === "Thai" && "กลับ"}
              {user.language === "English" && "back"}
            </button>
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
                    {user.language === "Thai" && menu.titleThai}
                    {user.language === "English" && menu.titleEnglish}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center w-full h-full ">
            {/* assignment detail */}
            {activeMenu === 0 && (
              <div className="w-full flex flex-col mt-5 items-center justify-start h-full  ">
                <div className="w-11/12   max-h-full">
                  <div className="flex justify-between ">
                    <span className="lg:text-4xl">
                      {assignment.isLoading || assignment.isFetching ? (
                        <Skeleton variant="text" width={200} />
                      ) : (
                        assignment?.data?.data?.title
                      )}
                    </span>
                    <div className="flex items-center justify-center flex-col">
                      <div
                        className="w-max px-2 h-10 rounded-xl flex items-center justify-center
              bg-orange-400 font-Poppins font-bold text-xl text-white"
                      >
                        {assignment.isLoading || assignment.isFetching ? (
                          <Skeleton variant="text" />
                        ) : (
                          assignment?.data?.data?.maxScore.toLocaleString()
                        )}
                      </div>
                      <span>
                        {user.language === "Thai" && "คะแนนเต็ม"}
                        {user.language === "English" && "score"}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-[2px] bg-blue-900 rounded-full"></div>
                  <div className="mt-5 font-Kanit text-xl w-full max-w-screen-2xl mb-28 max-h-full overflow-y-hidden  overflow-x-auto">
                    {assignment.isLoading || assignment.isFetching ? (
                      <div>
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="55%" />
                        <Skeleton variant="text" width="55%" />
                        <Skeleton variant="text" width="55%" />
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
                </div>
                <div className="w-full  gap-2 mt-8 bg-blue-500 fixed bottom-0 ">
                  <div className="p-6 flex  items-end justify-between text-white">
                    <div>
                      <span>
                        {user.language === "Thai" && "กำหนดส่ง"}
                        {user.language === "English" && "due by"}
                      </span>
                      <span className="text-xl ml-2 font-semibold text-white hover:text-red-500">
                        {formattedDate}
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <div
                        onClick={handleDeleteAssignment}
                        className="text-xl text-white hover:text-red-600 flex items-center justify-center flex-col hover:scale-110 
                  transition duration-150 ease-in-out cursor-pointer"
                      >
                        <MdDelete />
                        <span className="text-sm">
                          {user.language === "Thai" && "ลบงาน"}
                          {user.language === "English" && "delete assignment"}
                        </span>
                      </div>
                      <div
                        onClick={handleClickUpdateAssignment}
                        className="text-xl flex flex-col items-center justify-center hover:scale-110 transition duration-150 cursor-pointer
            "
                      >
                        <FiSettings />
                        <span className="text-sm">
                          {user.language === "Thai" && "แก้ไข"}
                          {user.language === "English" && "setting"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* student's assignment */}
            {activeMenu === 1 && (
              <div className="flex items-start justify-start w-full h-full  gap-5   mt-5  ">
                <div className="lg:w-[60rem] md:w-3/4  top-10 sticky flex flex-col h-full items-center justify-center ">
                  <div className="text-xl font-Kanit font-semibold flex justify-center items-center gap-2">
                    <span>
                      {user.language === "Thai" && "สถานะการส่งงานของผู้เรียน"}
                      {user.language === "English" &&
                        "student's status on assignment"}
                    </span>

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
                      <div className="flex justify-center">
                        {user.language === "Thai" && "เลขที่"}
                        {user.language === "English" && "number"}
                      </div>
                      <div className="flex items-center justify-center">
                        {user.language === "Thai" && "ชื่อ"}
                        {user.language === "English" && "student's name"}
                      </div>
                      <div className="flex items-center justify-center">
                        {user.language === "Thai" && "คะแนน"}
                        {user.language === "English" && "score"}
                      </div>
                      <div className="flex items-center justify-start">
                        {user.language === "Thai" && "สถานะ"}
                        {user.language === "English" && "status"}
                      </div>
                    </li>
                    <div className=" md:h-screen w-full overflow-auto">
                      {studentOnAssignments.isLoading ||
                      studentOnAssignments.isFetching ? (
                        <div className="flex flex-col  items-center justify-start mt-5 gap-5">
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
                                    {user.language === "Thai" && "ไม่ส่งงาน"}
                                    {user.language === "English" && "NO WORK"}
                                  </div>
                                )}
                                {student.status === "have-work" &&
                                  student.studentWork.score === 0 &&
                                  student.studentWork.isSummited === false && (
                                    <div
                                      onClick={() => handleSelectWork(student)}
                                      className=" lg:w-max md:w-16 cursor-pointer hover:scale-105 transition duration-150
                                         bg-yellow-500 py-1 px-2 rounded-lg text-white md:text-xs lg:text-base text-center flex items-center justify-center"
                                    >
                                      {user.language === "Thai" && "รอการตรวจ"}
                                      {user.language === "English" &&
                                        "WAIT CHECK"}
                                    </div>
                                  )}
                                {student.status === "no-assign" && (
                                  <div className="w-max bg-gray-500 py-1 px-2 rounded-lg text-white">
                                    {user.language === "Thai" &&
                                      "ไม่ได้มอบหมาย"}
                                    {user.language === "English" &&
                                      "NOT ASSIGN"}
                                  </div>
                                )}
                                {student.status === "have-work" &&
                                  student.studentWork.isSummited === true && (
                                    <div
                                      onClick={() => handleSelectWork(student)}
                                      className="w-max bg-green-500 py-1 px-2 cursor-pointer hover:scale-105 transition duration-150 rounded-lg text-white"
                                    >
                                      {user.language === "Thai" && "ตรวจแล้ว"}
                                      {user.language === "English" &&
                                        "FINISH CHECK"}
                                    </div>
                                  )}
                              </li>
                            );
                          }
                        )
                      )}
                    </div>
                  </ul>
                </div>

                {/* review student work section */}
                <div className="flex flex-col lg:w-full md:w-2/4 items-center justify-between h-full ">
                  <div className="flex w-full  lg:justify-between  mt-10">
                    <div className="flex items-center md:w-5/12 lg:w-max justify-center relative ">
                      <div className="lg:text-3xl md:text-xl w-max font-Kanit flex">
                        <span>
                          {user.language === "Thai" && "งานของผู้เรียน"}
                          {user.language === "English" && "student's work"}
                        </span>
                        {currentStudentWork?.status === "have-work" && (
                          <div
                            onClick={handleDelteStudentWork}
                            className="flex items-center md:ml-1 lg:ml-5 justify-center text-red-500 cursor-pointer
                        hover:text-red-800 transition duration-150"
                          >
                            <MdDelete />
                          </div>
                        )}
                      </div>
                      <div className="w-96 h-[2px] bg-blue-700 absolute left-0 md:hidden lg:block lg:bottom-2"></div>
                    </div>

                    {currentStudentWork && (
                      <form
                        onSubmit={handleReviewWork}
                        className="lg:w-max md:w-80  flex md:justify-end lg:justify-center gap-5 "
                      >
                        <Box width="40%" className="relative ">
                          <TextField
                            fullWidth
                            label={
                              user.language === "Thai"
                                ? "คะแนน"
                                : user.language === "English" && "score"
                            }
                            type="text"
                            name="score"
                            value={teacherReview.score}
                            onChange={handleOnChangeReviewWork}
                          />
                          <span className="font-Poppins absolute lg:top-4 md:top-5  md:text-sm lg:text-base md:right-2 lg:right-5">
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
                          {user.language === "Thai" && "ส่ง"}
                          {user.language === "English" && "summit"}
                        </button>
                      </form>
                    )}
                  </div>
                  <div className="w-full flex justify-start items-center gap-2 mb-10">
                    <span>
                      {user.language === "Thai" && "เลขที่"}
                      {user.language === "English" && "number"}{" "}
                      {currentStudentWork?.number}
                    </span>
                    <span
                      className="md:text-sm lg:text-base
                    "
                    >
                      {currentStudentWork?.firstName}
                      {currentStudentWork?.lastName}
                    </span>
                    {currentStudentWork?.picture && (
                      <div className="lg:w-10 lg:h-10 md:w-8 md:h-8 bg-orange-500 rounded-full overflow-hidden relative">
                        <Image
                          src={currentStudentWork?.picture}
                          layout="fill"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className=" flex flex-col w-full gap-10 ">
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
                        } lg:w-[40rem] md:w-60 mx-auto h-full items-center gap-2 place-items-center
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
                              className="object-cover hover:scale-125 transition duration-150"
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
                        className="w-full   h-72 text-center flex items-center justify-center font-Kanit
                      font-bold text-2xl text-gray-300"
                      >
                        {currentStudentWork?.status === "no-work" &&
                          user.language === "Thai" &&
                          "ผู้เรียนยังไม่ส่งงาน"}
                        {currentStudentWork?.status === "have-work" &&
                          user.language === "Thai" &&
                          "ตรวจงานโดยผู้เรียนไม่ส่งงาน"}
                        {!currentStudentWork &&
                          user.language === "Thai" &&
                          "โปรดเลือกงาน"}
                        {currentStudentWork?.status === "no-work" &&
                          user.language === "English" &&
                          "NO student's work"}
                        {currentStudentWork?.status === "have-work" &&
                          user.language === "English" &&
                          "Finish checking without student's work"}
                        {!currentStudentWork &&
                          user.language === "English" &&
                          "Please select some student"}
                      </div>
                    )}
                    <div className="flex flex-col gap-5 justify-start items-center">
                      {files.map((file, index) => {
                        if (file.fileType === "pdf") {
                          return (
                            <div
                              key={index}
                              className="w-full flex justify-center"
                            >
                              <embed
                                src={file.url}
                                type="application/pdf"
                                frameBorder="0"
                                scrolling="auto"
                                height="500px"
                                width="80%"
                              ></embed>
                            </div>
                          );
                        }
                        if (file.fileType === "docx") {
                          return (
                            <div
                              key={index}
                              className="w-full flex  justify-center"
                            >
                              <iframe
                                width="80%"
                                height="500px"
                                src={`https://docs.google.com/gview?url=${file.url}&embedded=true`}
                              ></iframe>
                            </div>
                          );
                        }
                        if (file.fileType === "mp4") {
                          return (
                            <div
                              key={index}
                              className="w-full flex  justify-center"
                            >
                              <video controls width="80%">
                                <source src={file.url} type="video/mp4" />
                                Sorry, your browser doesn't support videos.
                              </video>
                            </div>
                          );
                        }
                        if (
                          file.fileType === "mp3" ||
                          file.fileType === "aac"
                        ) {
                          return (
                            <div
                              key={index}
                              className="w-full flex  justify-center"
                            >
                              <audio
                                src={file.url}
                                controls={true}
                                autoPlay={false}
                              />
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  {currentStudentWork?.studentWork?.body && (
                    <div className=" w-full h-max mt-5 flex items-start justify-start relative ">
                      <div className="flex gap-2 md:ml-2 lg:ml-20">
                        {currentStudentWork?.picture ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden relative">
                            <Image
                              src={currentStudentWork?.picture}
                              alt="profile"
                              layout="fill"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                            <span className="uppercase font-sans font-black text-3xl text-white">
                              {currentStudentWork?.firstName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="w-max max-w-[10rem] lg:max-w-xl pr-10  bg-blue-100 rounded-3xl h-full relative  p-2">
                          <div className="text-md ml-4 font-bold first-letter:uppercase">
                            {currentStudentWork?.firstName}
                            {currentStudentWork?.lastName}
                          </div>
                          <div
                            className="pl-4 break-words "
                            dangerouslySetInnerHTML={{
                              __html: currentStudentWork?.studentWork?.body,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {currentStudentWork?.studentWork?.comment && (
                    <div className=" w-full h-max mt-5 flex items-start justify-start relative ">
                      <div className="flex gap-2 md:ml-2 lg:ml-20 w-full ">
                        {user.picture ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden relative">
                            <Image
                              src={user.picture}
                              alt="profile"
                              layout="fill"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                            <span className="uppercase font-sans font-black text-3xl text-white">
                              {user.firstName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="w-max md:max-w-[15rem] lg:max-w-xl  pr-10  bg-green-100 rounded-3xl h-full relative  p-2">
                          <div className="text-md ml-4 font-bold first-letter:uppercase">
                            {user.firstName}
                            {user?.lastName}
                          </div>
                          <div
                            className="pl-4 break-words "
                            dangerouslySetInnerHTML={{
                              __html: currentStudentWork?.studentWork?.comment,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {comment?.map((comment) => {
                    if (comment.user) {
                      return (
                        <div className=" w-full h-max mt-5 flex items-start justify-start relative ">
                          <div className="flex gap-2 md:ml-2 lg:ml-20 w-full ">
                            {comment.user.picture ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                <Image
                                  src={comment.user.picture}
                                  alt="profile"
                                  layout="fill"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                                <span className="uppercase font-sans font-black text-3xl text-white">
                                  {comment.user.firstName.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="w-max md:max-w-[15rem] lg:max-w-xl  pr-10  bg-green-100 rounded-3xl h-full relative  p-2">
                              <div className="text-md ml-4 font-bold first-letter:uppercase">
                                {comment.user.firstName}
                                {comment.user?.lastName}
                              </div>
                              <div
                                className="pl-4 break-words "
                                dangerouslySetInnerHTML={{
                                  __html: comment.body,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    } else if (comment.student) {
                      return (
                        <div className=" w-full h-max mt-5 flex items-start justify-start relative ">
                          <div className="flex gap-2 md:ml-2 lg:ml-20">
                            {comment.student.picture ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                <Image
                                  src={comment.student.picture}
                                  alt="profile"
                                  layout="fill"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                                <span className="uppercase font-sans font-black text-3xl text-white">
                                  {comment.student.firstName.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="w-max max-w-[10rem] lg:max-w-xl pr-10  bg-blue-100 rounded-3xl h-full relative  p-2">
                              <div className="text-md ml-4 font-bold first-letter:uppercase">
                                {comment.student.firstName}
                                {comment.student?.lastName}
                              </div>
                              <div
                                className="pl-4 break-words "
                                dangerouslySetInnerHTML={{
                                  __html: comment.body,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                  {currentStudentWork && (
                    <form
                      onSubmit={handlePostComment}
                      className="w-full flex items-center justify-center gap-5 mt-10 pb-10"
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
                      <button
                        className="w-max px-5 py-2 h-max  rounded-full bg-[#2C7CD1] hover:bg-red-500 tranti duration-150
                       text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid flex items-center justify-center  focus:border-2 
              focus:border-solid"
                      >
                        <SendIcon />
                      </button>
                    </form>
                  )}
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
