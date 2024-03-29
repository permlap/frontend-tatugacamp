import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Editor } from "@tinymce/tinymce-react";
import { IoCaretBackOutline, IoDocumentText } from "react-icons/io5";
import { Box, Skeleton, TextField } from "@mui/material";
import {
  GetMyWork,
  SummitWork,
} from "../../../../../../service/student/assignment";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import Image from "next/image";
import "lightbox.js-react/dist/index.css";
import { CiFaceFrown } from "react-icons/ci";
import Swal from "sweetalert2";
import SendIcon from "@mui/icons-material/Send";
import {
  GetComments,
  PostComment,
} from "../../../../../../service/student/comment";
import Head from "next/head";
import { GetStudent } from "../../../../../../service/student/student";
import Loading from "../../../../../../components/loading/loading";
import { BsFillChatDotsFill, BsImageFill } from "react-icons/bs";
import { FcVideoFile } from "react-icons/fc";
import { FaFileAudio, FaRegFilePdf } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { MdOutlineInventory2 } from "react-icons/md";
import { AiOutlineCloudUpload, AiOutlinePlus } from "react-icons/ai";
import { useSpring, animated } from "@react-spring/web";
import { FiRefreshCw } from "react-icons/fi";

function Index() {
  const router = useRouter();
  const [springs, api] = useSpring(() => ({
    from: { y: 400 },
  }));
  const menus = [
    { title: "ส่งงาน", translate: "translate-x-1" },
    { title: "งานของคุณ", translate: "translate-x-28" },
    { title: "คอมเมนต์", translate: "translate-x-52" },
  ];
  const [teacher, setTeacher] = useState();
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
  const [studentWork, setStudnetWork] = useState();
  const [assignment, setAssignment] = useState();
  const [deadline, setDeadline] = useState();
  const [fileSize, setFilesSize] = useState(0);
  const [classroom, setClassroom] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [studentSummit, setStudentSummit] = useState({
    body: "",
  });
  const [triggerMenu, setTriggerMenu] = useState(false);
  const comments = useQuery(
    ["comments"],
    () =>
      GetComments({
        assignmentId: assignment.id,
        studentId: router.query.studentId,
      }),
    {
      enabled: false,
    }
  );
  const student = useQuery(
    ["student"],
    () => GetStudent({ studentId: router.query.studentId }),
    {
      enabled: false,
    }
  );

  const fetchStudentWork = useQuery(["student-work"], () =>
    GetMyWork({
      studentId: router.query.studentId,
      assignmentId: assignment.id,
    }).then((res) => {
      setStudnetWork(() => {
        let pictures = [];
        let files = [];
        if (res.data.status === "have-work") {
          if (res.data.picture) {
            const arrayPictures = res.data.picture.split(", ");
            for (const arrayPicture of arrayPictures) {
              const fileType = get_url_extension(arrayPicture);
              if (
                fileType === "jpg" ||
                fileType === "jpeg" ||
                fileType === "png" ||
                fileType === "HEIC" ||
                fileType === "JPEG" ||
                fileType === "PNG" ||
                fileType === "JPG" ||
                fileType === "heic"
              ) {
                pictures.push({ src: arrayPicture, alt: "student's work" });
              } else {
                files.push({ fileType: fileType, url: arrayPicture });
              }
            }
            return { ...res.data, picture: pictures, files: files };
          } else if (!res.data.picture) {
            return res.data;
          }
        } else if (res.data.status === "no-work") {
          return res.data;
        }
      });
      return res;
    })
  );

  const handleSummitWork = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      Swal.fire({
        title: "ยืนยันการส่งงาน",
        text: "คุณยังไม่ได้แนบไฟล์งาน แน่ใจใช่ไหมว่าจะส่ง?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const formFiles = new FormData();
            selectedFiles.forEach((file) => {
              formFiles.append("files", file);
            });
            formFiles.append("body", studentSummit.body);
            formFiles.getAll("body");
            const summitWork = await SummitWork({
              formFiles,
              studentId: router.query.studentId,
              assignmentId: assignment.id,
            });

            fetchStudentWork.refetch();
            Swal.fire("success", "ส่งงานแล้ว", "success");
          } catch (err) {
            if (
              err?.props?.response?.data?.error.message ===
              "student's already summit their work"
            ) {
              Swal.fire(
                "error",
                "นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม",
                "error"
              );
            } else {
              Swal.fire("error", err?.props?.response?.data?.message, "error");
            }
            console.log(err);
          }
        }
      });
    } else if (selectedFiles.length > 0) {
      Swal.fire({
        title: "ยืนยันการส่งงาน",
        text: "นักเรียนแน่ใจหรือไม่ว่าจะส่งงาน? เนื่องจากส่งงานแล้วจะไม่สามารถลบงานได้ต้องติดต่อครูผู้สอน",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoading(() => true);
            const formFiles = new FormData();
            selectedFiles.forEach((file) => {
              formFiles.append("files", file);
            });
            formFiles.append("body", studentSummit.body);
            formFiles.getAll("body");
            const summitWork = await SummitWork({
              formFiles,
              studentId: router.query.studentId,
              assignmentId: assignment.id,
            });
            setLoading(() => false);
            fetchStudentWork.refetch();
            Swal.fire("success", "ส่งงานแล้ว", "success");
          } catch (err) {
            setLoading(() => false);
            if (
              err?.props?.response?.data?.error.message ===
              "student's already summit their work"
            ) {
              Swal.fire(
                "error",
                "นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม",
                "error"
              );
            } else {
              Swal.fire("error", err?.props?.response?.data?.message, "error");
            }
            console.log(err);
          }
        }
      });
    }
  };
  //set files to array
  const handleFileEvent = (e) => {
    const newFiles = Array.prototype.slice.call(e.target.files);
    let totalSize = 0;

    // Combine the existing selected files with the newly selected files
    const updatedSelectedFiles = [...selectedFiles, ...newFiles];

    for (let i = 0; i < updatedSelectedFiles.length; i++) {
      totalSize += updatedSelectedFiles[i].size;
    }

    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    setFilesSize(totalSizeInMB);

    setSelectedFiles(updatedSelectedFiles);
  };

  useEffect(() => {
    if (router.isReady) {
      student.refetch();
      comments.refetch();
    }
  }, [router.isReady]);

  useEffect(() => {
    setTeacher(() => {
      const teacher = localStorage.getItem("teacher");
      return JSON.parse(teacher);
    });
    setClassroom(() => {
      const classroom = localStorage.getItem("classroom-student");
      const classroomConverted = JSON.parse(classroom);
      return classroomConverted;
    });
    initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_KEY, "individual");
    const studentWork = localStorage.getItem("assignment");
    setAssignment(() => {
      const assignment = localStorage.getItem("assignment");
      const convertAssignment = JSON.parse(assignment);
      setDeadline(() => {
        const date = new Date(convertAssignment.assignment.deadline);
        const formattedDate = date.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return formattedDate;
      });
      return convertAssignment.assignment;
    });
    setTimeout(() => {
      fetchStudentWork.refetch();
    }, 500);
  }, []);

  const handleSumitComment = async (e) => {
    try {
      e.preventDefault();
      await PostComment({
        assignmentId: assignment.id,
        studentId: router.query.studentId,
        body: studentSummit.body,
      });
      setStudentSummit((prev) => {
        return {
          ...prev,
          body: "",
        };
      });
      comments.refetch();
    } catch (err) {
      Swal.fire("error", err?.props?.response?.data?.message, "error");
    }
  };

  // check file type
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  const handleOpenTrigerMenu = () => {
    document.body.style.overflow = "hidden";
    setTriggerMenu(() => true);
    api.start({
      from: {
        y: 400,
      },
      to: {
        y: 0,
      },
    });
  };

  const handleCloseTrigerMenu = () => {
    document.body.style.overflow = "auto";
    setTriggerMenu(() => false);
    setActiveMenu(() => 4);
    api.start({
      from: {
        y: 0,
      },
      to: {
        y: 400,
      },
    });
  };

  return (
    <div
      className="  w-full h-full font-Kanit relative pb-96 bg-no-repeat bg-cover bg-top 
    bg-[url('https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png')]  "
    >
      <Head>
        <title>students - assignment</title>
      </Head>
      <nav className="w-full fixed z-10 top-5 flex justify-between items-center ">
        <button
          aria-label="button go back to classroom"
          onClick={() => {
            setLoading(true);
            router.push({
              pathname: `/classroom/student/${router.query.studentId}`,
              query: {
                classroomId: router.query.classroomId,
              },
            });
          }}
          className="w-10 h-10  bg-orange-500  ring-2 ring-white rounded-lg mt-2 ml-5 cursor-pointer group
        flex items-center justify-center active:scale-110 hover:scale-110 transition duration-150"
        >
          <div className="text-2xl text-white flex items-center justify-center group-hover:scale-110 transition duration-150 ">
            <RiArrowGoBackFill />
          </div>
        </button>
        <div
          className="w-40 md:w-60 bg-white h-14 md:h-20 border-b-2 border-t-2 border-r-0
         border-blue-500 rounded-l-2xl flex flex-col py-2 pl-2 md:pl-10 gap-0 truncate font-Kanit  border-l-2 border-solid"
        >
          <span className="font-semibold text-blue-500 md:text-2xl truncate">
            {classroom?.title}
          </span>
          <span className="text-xs md:text-sm truncate">
            {classroom?.level}
          </span>
          <span className="text-xs md:text-sm  truncate">
            {classroom?.description}
          </span>
        </div>
      </nav>
      <main className="w-full flex flex-col items-center justify-start pt-28 md:pt-40 gap-2">
        <div className="w-60 md:w-96 lg:w-3/4 flex gap-2 items-center justify-center mb-5">
          <div className="  text-center w-60 md:w-96 lg:w-3/4">
            <span className="font-Kanit text-2xl  break-words  font-bold text-black ">
              {assignment?.title}
            </span>
          </div>
        </div>
        <div
          className="w-10/12 relative max-w-2xl mt-10 grid gap-2 p-4 rounded-lg ring-2 ring-blue-500 
          bg-white  "
        >
          <div className="absolute w-full  flex flex-col -top-6 items-center justify-center">
            {student?.data?.data?.picture ? (
              <div className="w-28   h-28 ring-4 ring-white rounded-full overflow-hidden relative bg-orange-400">
                <Image
                  src={student?.data?.data?.picture}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full overflow-hidden relative bg-blue-400 flex items-center justify-center">
                <div className="font-Kanit font-bold text-2xl uppercase text-center text-white ">
                  {student?.data?.data?.firstName.charAt(0)}
                </div>
              </div>
            )}
            <span className="font-Kanit font-medium text-lg mt-1">
              เลขที่ {student?.data?.data?.number}{" "}
              {student?.data?.data?.firstName} {student?.data?.data?.lastName}
            </span>
          </div>
          <table className="mt-28">
            <tbody>
              <tr>
                <td className="w-40 text-center">มอบหมายโดย</td>
                <td className="flex gap-2 justify-start items-center">
                  <span className="font-semibold text-blue-500 text-lg">
                    ครู {teacher?.firstName} {teacher?.lastName}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="w-20 text-center">กำหนดส่ง</td>
                <td>
                  {fetchStudentWork.isLoading || loading ? (
                    <Skeleton variant="rounded" width="100%" height={20} />
                  ) : (
                    <div className="col-span-2 font-semibold">{deadline}</div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-20 text-center">คะแนน</td>
                <td>
                  {fetchStudentWork.isLoading || loading ? (
                    <Skeleton variant="rounded" width="100%" height={20} />
                  ) : (
                    <div className="text-lg">
                      <span>{!studentWork?.score ? 0 : studentWork.score}</span>
                      <span>/</span>
                      <span>{assignment?.maxScore}</span>
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-20 text-center">สถานะ</td>
                <td>
                  {studentWork?.status === "no-work" && (
                    <div
                      className="w-max px-2 h-4 bg-red-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
                    >
                      <span className="flex items-center justify-center font-Kanit text-white flex-col">
                        <div className="text-sm">
                          <span>ไม่ส่งงาน</span>
                        </div>
                      </span>
                    </div>
                  )}
                  {studentWork?.status === "have-work" &&
                    studentWork.isSummited === false && (
                      <div
                        className="w-max px-2 h-4 bg-yellow-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
                      >
                        <span className="flex items-center justify-center font-Kanit text-white flex-col">
                          <div className="text-sm">
                            <span>รอตรวจ</span>
                          </div>
                        </span>
                      </div>
                    )}
                  {studentWork?.status === "have-work" &&
                    studentWork.isSummited === true && (
                      <div
                        className="w-max px-2 h-4 bg-green-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
                      >
                        <span className="flex items-center justify-center font-Kanit text-white flex-col">
                          <div className="text-sm">
                            <span>ตรวจแล้ว</span>
                          </div>
                        </span>
                      </div>
                    )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="h-max w-full  lg:text-lg rounded-md max-w-4xl overflow-x-auto">
            <div
              className=" p-5  text-black font-Kanit"
              dangerouslySetInnerHTML={{
                __html: assignment?.description,
              }}
            />
          </div>
        </div>
      </main>
      <animated.div
        style={{ ...springs }}
        className={`w-full z-20  ${
          triggerMenu ? "h-screen" : "h-min"
        }    fixed bottom-0 flex   items-end`}
      >
        <div className="bg-white w-full h-[30rem] flex-col flex justify-start items-center relative">
          <div className=" w-full  flex justify-around md:justify-center md:gap-20 items-start relative">
            <button
              onClick={() => {
                if (triggerMenu === false) {
                  handleOpenTrigerMenu();
                  setActiveMenu(() => 1);
                } else if (triggerMenu === true) {
                  setActiveMenu(() => 1);
                }
              }}
              className="flex flex-col  relative -top-5 font-Kanit font-semibold text-blue-600 justify-center items-center"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-xl drop-shadow-md text-white flex items-center justify-center text-3xl">
                <MdOutlineInventory2 />
              </div>
              <span>งานของฉัน</span>
            </button>
            <button
              onClick={() => {
                if (triggerMenu === false) {
                  handleOpenTrigerMenu();
                  setActiveMenu(() => 0);
                } else if (triggerMenu === true) {
                  setActiveMenu(() => 0);
                }
              }}
              className="flex relative -top-7 flex-col font-Kanit font-semibold text-blue-600 justify-center items-center"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full drop-shadow-md text-white flex items-center justify-center text-3xl">
                <AiOutlinePlus />
              </div>
              <span>ส่งงาน</span>
            </button>
            <button
              onClick={() => {
                if (triggerMenu === false) {
                  handleOpenTrigerMenu();
                  setActiveMenu(() => 2);
                } else if (triggerMenu === true) {
                  setActiveMenu(() => 2);
                }
              }}
              className="flex flex-col  relative -top-5 font-Kanit font-semibold text-blue-600 justify-center items-center"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-xl drop-shadow-md text-white flex items-center justify-center text-3xl">
                <BsFillChatDotsFill />
              </div>
              <span>คอมเมนต์</span>
            </button>
          </div>
          {activeMenu === 4 && <div className=""></div>}
          {activeMenu === 0 && (
            <form
              onSubmit={handleSummitWork}
              className="w-11/12 max-w-3xl h-full  flex flex-col gap-2 items-center justify-top"
            >
              <span className="text-sm text-red-500 w-8/12 text-center">
                สามารส่งไฟล์ mp4, mp3, docx, pdf,jpge, png ได้แล้ว ขนาดไม่เกิน
                100 MB
              </span>
              {fetchStudentWork.isLoading ? (
                <Skeleton variant="rounded" width="100%" height={300} />
              ) : loading ? (
                <div>
                  <Loading />
                </div>
              ) : (
                <label htmlFor="dropzone-file" className="w-max">
                  <div
                    className="w-28 h-10 hover:scale-105 transition duration-150
                   bg-white drop-shadow-xl ring-2 text-black text-3xl flex justify-center items-center rounded-2xl"
                  >
                    <AiOutlineCloudUpload />
                  </div>

                  <input
                    id="dropzone-file"
                    onChange={handleFileEvent}
                    name="files"
                    aria-label="upload image"
                    type="file"
                    multiple="multiple"
                    accept="
application/pdf,
    image/jpeg,
    image/png,
    image/gif,
    application/msword,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
    video/mp4,
    audio/mpeg"
                    className="text-sm text-grey-500 hidden 
            file:mr-5 md:file:w-40 file:w-40 w-max file:py-2
            file:rounded-full file:border-0
            file:text-sm file:font-Kanit file:font-normal file:text-white
             bg-white rounded-full
            file:bg-blue-400 file:drop-shadow-lg
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                  />
                </label>
              )}
              <div className="flex gap-2">
                <span>ไฟล์ที่คุณเลือกมีขนาด</span>
                <span>{fileSize}MB</span>
              </div>
              {selectedFiles.length > 0 && (
                <div className="relative">
                  <div
                    onClick={() => {
                      setFilesSize(() => 0);
                      setSelectedFiles(() => []);
                    }}
                    className=" absolute -top-2 z-20 -right-2 "
                  >
                    <div className="flex justify-center items-center w-5 h-5 text-white bg-blue-500 rounded-full p-2">
                      <FiRefreshCw />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 place-items-center gap-5 relative h-32  overflow-y-auto ring-2 p-3 rounded-xl">
                    {selectedFiles.map((file) => {
                      if (
                        file.type === "image/jpeg" ||
                        file.type === "" ||
                        file.type === "image/png"
                      )
                        return (
                          <div className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                            <div className="flex items-center justify-center text-green-700">
                              <BsImageFill />
                            </div>
                            <span className="w-20 truncate">{file.name}</span>
                          </div>
                        );
                      if (
                        file.type === "video/mp4" ||
                        file.type === "video/quicktime"
                      )
                        return (
                          <div className="w-full  px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                            <div className="flex items-center justify-center text-green-700">
                              <FcVideoFile />
                            </div>
                            <span className="w-20 truncate">{file.name}</span>
                          </div>
                        );
                      if (
                        file.type === "audio/mpeg" ||
                        file.type === "audio/mp3"
                      )
                        return (
                          <div className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                            <div className="flex items-center justify-center text-red-700">
                              <FaFileAudio />
                            </div>
                            <span className="w-20 truncate">{file.name}</span>
                          </div>
                        );
                      if (file.type === "application/pdf")
                        return (
                          <div className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                            <div className="flex items-center justify-center text-gray-700">
                              <FaRegFilePdf />
                            </div>
                            <span className="w-20 truncate">{file.name}</span>
                          </div>
                        );
                      if (
                        file.type ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      )
                        return (
                          <div className="w-full px-1 flex justify-center items-center gap-2 h-10 bg-white ring-2 ring-blue-500 rounded-xl">
                            <div className="flex items-center justify-center text-blue-700">
                              <IoDocumentText />
                            </div>
                            <span className="w-20 truncate">{file.name}</span>
                          </div>
                        );
                    })}
                  </div>
                </div>
              )}
              {loading ? (
                <div
                  className="w-40 h-10 mt-5   bg-gray-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
                >
                  โปรดรอสักครู่
                </div>
              ) : fileSize > 100 ? (
                <div
                  className="w-40 h-10 mt-5  bg-red-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
                >
                  ขนาดไฟล์เกิน
                </div>
              ) : selectedFiles.length > 0 ? (
                <button
                  type="submit"
                  className="w-40 h-10 mt-5  bg-green-500 drop-shadow-md text-white rounded-xl
       flex items-center justify-center"
                >
                  ส่งงาน
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-40 h-10 mt-5  bg-red-500 drop-shadow-md text-white rounded-xl
   flex items-center justify-center"
                >
                  ส่งงานโดยไม่แนบไฟล์
                </button>
              )}
            </form>
          )}

          {activeMenu === 1 && (
            <div className="w-11/12 max-w-3xl  flex flex-col gap-2 items-center justify-top">
              {studentWork.status === "no-work" ? (
                <div className="font-Kanit text-2xl text-red-400 font-light h-20 flex items-center justify-center gap-2">
                  <span>คุณยังไม่ส่งงาน</span>
                  <div className="flex items-center justify-center ">
                    <CiFaceFrown />
                  </div>
                </div>
              ) : (
                <div className="w-full h-80 overflow-auto ring-2 rounded-2xl  flex flex-col   gap-5 mt-5">
                  {studentWork.picture && (
                    <SlideshowLightbox
                      downloadImages={true}
                      lightboxIdentifier="lightbox1"
                      showThumbnails={true}
                      framework="next"
                      images={studentWork.picture}
                      theme="day"
                      className={`container grid w-full  h-max items-center place-items-center
                       ${
                         studentWork?.picture.length === 1
                           ? "grid-cols-1"
                           : "grid-cols-2 md:grid-cols-3 "
                       }  gap-2  `}
                    >
                      {studentWork?.picture?.map((image, index) => {
                        return (
                          <Image
                            key={index}
                            src={image.src}
                            alt={image.alt}
                            width={240}
                            height={160}
                            className="object-cover "
                            data-lightboxjs="lightbox1"
                            quality={80}
                            placeholder="blur"
                            blurDataURL="/logo/TaTuga camp.png"
                          />
                        );
                      })}
                    </SlideshowLightbox>
                  )}
                  <div className="flex flex-col gap-5 justify-start items-center">
                    {studentWork?.files?.length > 0 &&
                      studentWork?.files.map((file, index) => {
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
                        if (
                          file.fileType === "mp4" ||
                          file.fileType === "mov" ||
                          file.fileType === "MOV"
                        ) {
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
              )}
            </div>
          )}
          {activeMenu === 2 && (
            <form
              onSubmit={handleSumitComment}
              className="w-11/12 max-w-3xl h-full mt-1 flex flex-col gap-2"
            >
              <div className="w-full h-44 overflow-auto">
                {studentWork?.body && (
                  <div className="w-11/12 flex justify-start">
                    <div className="w-full max-w-5xl pr-6 h-max p-2 rounded-lg bg-blue-50 flex">
                      <span className="font-semibold">นักเรียน:</span>
                      <div
                        style={{
                          wordWrap: "break-word",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                        className="h-max w-full  overflow-hidden ml-2"
                        dangerouslySetInnerHTML={{
                          __html: studentWork?.body,
                        }}
                      />
                    </div>
                  </div>
                )}
                {comments?.data?.data?.map((comment) => {
                  if (comment.user) {
                    return (
                      <div className=" w-full h-max mt-5 flex items-start justify-start relative ">
                        <div className="flex gap-2 ml-2">
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
                          <div className="w-full max-w-[15rem] md:max-w-md h-max pr-10  bg-green-100 rounded-3xl relative  p-2">
                            <div className="text-md ml-4 font-bold first-letter:uppercase">
                              {comment.user.firstName}
                              {comment.user?.lastName}
                            </div>
                            <div
                              className="pl-4 "
                              style={{
                                wordWrap: "break-word",
                                maxHeight: "200px",
                                overflowY: "auto",
                              }}
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
                        <div className="flex gap-2 ml-2">
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
                          <div
                            className="w-full max-w-[15rem] md:max-w-md pr-10 
                       bg-blue-100 rounded-3xl h-full relative  p-2"
                          >
                            <div className="text-md ml-4 font-bold first-letter:uppercase">
                              {comment.student.firstName}
                              {comment.student?.lastName}
                            </div>
                            <div
                              className="pl-4 "
                              style={{
                                wordWrap: "break-word",
                                overflowY: "auto",
                              }}
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
              </div>
              {fetchStudentWork.isLoading || loading ? (
                <Skeleton variant="rounded" width="100%" height={300} />
              ) : (
                <div className="h-28 w-full ">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                    textareaName="body"
                    init={{
                      link_context_toolbar: true,
                      height: "100%",
                      width: "100%",
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar: "",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                    }}
                    initialValue=""
                    value={studentSummit.body}
                    onEditorChange={(newText) => {
                      setStudentSummit((prevState) => {
                        return {
                          ...prevState,
                          body: newText,
                        };
                      });
                    }}
                  />
                </div>
              )}
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-20 h-10 bg-green-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
                >
                  <SendIcon />
                </button>
              </div>
            </form>
          )}
        </div>
        {triggerMenu && (
          <div
            onClick={handleCloseTrigerMenu}
            className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-20 bg-black/30 "
          ></div>
        )}
      </animated.div>
    </div>
  );
}

export default Index;
