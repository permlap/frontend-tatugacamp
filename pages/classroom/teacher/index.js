import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import CreateClass from "../../../components/form/createClass";
import { Popover } from "@headlessui/react";
import { useMutation, useQuery } from "react-query";
import { DeleteClassroom, GetAllClassrooms } from "../../../service/classroom";
import Lottie from "lottie-react";
import Head from "next/head";
import { useRouter } from "next/router";
import * as teacherAnimation from "../../../components/98349-teacher-in-classroom.json";
import { GetUser, GetUserCookie } from "../../../service/user";
import Unauthorized from "../../../components/error/unauthorized";
import { Skeleton } from "@mui/material";
import Layout from "../../../layouts/schoolLayout";
import { parseCookies } from "nookies";
import Swal from "sweetalert2";
import FeedbackSankbar from "../../../components/feedback/snackbar";
import { sideMenusEnglish, sideMenusThai } from "../../../data/menubarsSchool";
import { BiNews } from "react-icons/bi";
import { sanityClient } from "../../../sanity";
import { myPortableTextComponents } from "../../../data/portableContent";
import { PortableText } from "@portabletext/react";

function Index({ error, user, whatsNews }) {
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === "Thai") {
      return sideMenusThai;
    } else if (user?.language === "English") {
      return sideMenusEnglish;
    }
  });
  const router = useRouter();
  const [classroomState, setClassroomState] = useState();
  const [isViewNews, setIsViewNews] = useState(false);
  const classrooms = useQuery(["classrooms"], () =>
    GetAllClassrooms().then((res) => {
      setClassroomState((prev) => (prev = res?.data));
    })
  );

  const deleteClassroom = useMutation(async (classroomid) => {
    const deleting = await DeleteClassroom(classroomid);
    classrooms.refetch();
  });

  useEffect(() => {
    if (user) {
      Swal.fire({
        title: "ร่วมสนับสนุนเว็บไซต์ของทุกท่าน!",
        html:
          "<span>เนื่องจากขณะนี้มีผู้ใช้งานจำนวนมาก เกินที่ทางเราประเมินไว้ครับ</span>" +
          "<br/>" +
          "<span>ส่งผลให้ค่าใช้จ่ายในการเช่า Server และ Database สูงมาก และเกินกำลังสำหรับทางเรา พอสมควร เนื่องจากผู้พัฒนาเว็บไซต์เป็นเพียงกลุ่มนักศึกษาครุศาสตร์ สาขาภาษาอังกฤษ ที่เพิ่งจบใหม่ จึงไม่สามารถหารายได้มาจ่ายในส่วนของค่าใช้จ่ายเหล่านี้ได้ พวกเราจึงขอเปิดรับการสนับสนุนจากคุณครูทุกท่าน เพื่อซัพพอร์ตให้เราสามารถพัฒนาเว็บไซต์ดี ๆ และเป็นประโยชน์ต่อคุณครู นักศึกษาฝึกสอน อาจารย์ และการศึกษาไทยต่อไปครับ </span>",

        width: "80%",

        imageUrl:
          "https://storage.googleapis.com/tatugacamp.com/donation/donation.png",
        imageWidth: 300,
        imageHeight: 400,
        imageAlt: "Custom image",
      });
      const viewNews = localStorage.getItem("IsViewNews");
      if (viewNews === whatsNews[0]._id) {
        setIsViewNews(() => true);
      } else {
        setIsViewNews(() => false);
      }
    }
  }, []);
  //handle open make sure to delete classroom
  const handleOpenClasssDeleted = (index) => {
    const newItems = classroomState.map((item, i) => {
      if (i === index) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });
    setClassroomState(newItems);
  };

  //handle make sure to cancel deleting classroom
  const handleCloseClasssDeleted = (index) => {
    const newItems = classroomState.map((item, i) => {
      if (i === index) {
        return { ...item, selected: false };
      } else {
        return { ...item, selected: false };
      }
    });
    setClassroomState(newItems);
  };

  const style = {
    height: 500,
  };
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }

  const handleReadNews = () => {
    localStorage.setItem("IsViewNews", whatsNews[0]._id);
    setIsViewNews(() => true);
  };

  return (
    <div className="bg-white lg:w-full lg:h-full md:h-screen font-Kanit">
      <Head>
        <meta property="og:title" content={`TaTuga class`} />
        <meta
          property="og:description"
          content="ห้องเรีัยน tatuga จาก tatuga camp"
        />
        <meta property="og:image" content="/thumnail/thumnail.jpg" />
        <meta property="og:image:secure_url" content="/thumnail/thumnail.jpg" />
        <meta name="twitter:image:src" content="/thumnail/thumnail.jpg" />
        <meta
          name="keywords"
          content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for 
            learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ,
             การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, `}
        />
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="ห้องเรียนจาก Tatuga camp ที่จะพาคุณครูไปสู่การบริหารห้องเรียนอย่างสะดวกและสนุก กับ tatuga class"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`Teacher class`}</title>
      </Head>

      <div
        className={`flex  w-full  bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover ${
          classroomState?.[0] ? "h-full pb-60 md:pb-80 lg:pb-0" : "h-screen"
        } `}
      >
        <Layout user={user} sideMenus={sideMenus} />
        <FeedbackSankbar language={user.language} />

        <Popover>
          {({ open }) => (
            <div className="fixed bottom-20 z-20 right-7 flex justify-center items-end flex-col ">
              <Popover.Panel>
                {({ close }) => {
                  return (
                    <div
                      className=" bg-gradient-to-r  from-slate-50 to-blue-100 mb-2 p-5
             w-max max-w-3xl h-max max-h-96 rounded-xl overflow-y-auto"
                    >
                      <ul className="list-none pl-0">
                        {whatsNews.map((news) => {
                          const date = new Date(news._createdAt);
                          const options = {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          };

                          if (user.language === "Thai") {
                            options.hour12 = false;
                            options.hourCycle = "h23";
                          }

                          const formattedDate = date.toLocaleDateString(
                            user.language === "Thai" ? "th-TH" : "en-US",
                            options
                          );
                          return (
                            <li
                              key={news._id}
                              className="w-full max-w-2xl mt-2 h-max  flex flex-col"
                            >
                              <h4 className="">{formattedDate}</h4>
                              <PortableText
                                value={
                                  user.language === "Thai"
                                    ? news.NewsThai
                                    : user.language === "English" &&
                                      news.NewsEnglish
                                }
                                components={myPortableTextComponents}
                              />
                              <div className="w-full h-[2px] mt-2 bg-orange-400"></div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }}
              </Popover.Panel>
              <Popover.Button
                onClick={handleReadNews}
                className="flex justify-center items-center gap-2 group hover:ring-2 active:ring-4 hover:bg-slate-200 bg-white p-3 rounded-xl drop-shadow-md"
              >
                <div className="relative flex items-center justify-center">
                  {!isViewNews && (
                    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-sky-400 opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </div>

                <span>
                  {user.language === "Thai" && "มีอะไรใหม่?"}
                  {user.language === "English" && "What's news?"}
                </span>
                <div className="text-xl flex items-center justify-center">
                  <BiNews />
                </div>
              </Popover.Button>
            </div>
          )}
        </Popover>
        <div
          className={`flex justify-center items-center md:items-start    lg:items-center  w-full h-full`}
        >
          <div className="xl:w-full  h-max m-5  flex flex-col  justify-center items-center pb-14 ">
            <header className="mt-28 md:mt-2  rounded-lg   p-5 md:px-10 xl:px-20 w-max  relative     ">
              <div className=" w-full md:block flex items-center justify-center    bg-transparent">
                <div
                  className="xl:w-[35rem] w-40   md:w-96 p-20 flex flex-col items-center justify-center
                   text-left leading-[3.5rem] md:mt-32 lg:mt-20   md:ml-28 md:pl-10 py-5 rounded-lg 
                  h-10 md:h-max z-10 relative "
                >
                  <div
                    className="xl:text-6xl text-xl w-60 md:w-96 lg:w-[30rem] mt-20 md:mt-0   md:text-left md:text-2xl font-semibold  
                  font-Kanit tracking-wider  "
                  >
                    <span className="md:text-8xl text-5xl hover:text-[#2C7CD1] text-black duration-150 transition">
                      {user.language === "Thai" && "สร้าง"}
                      {user.language === "English" && "Create"}
                    </span>
                    <span>
                      {user.language === "Thai" && "ห้องเรียนของคุณได้ที่นี่"}
                      {user.language === "English" && " your classroom here!"}
                    </span>
                  </div>
                </div>
                <div className="absolute md:-top-20 lg:-top-20 lg:-left-36 ">
                  <Lottie animationData={teacherAnimation} style={style} />
                </div>
              </div>
              <div>
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <div className="lg:mt-20 md:mt-5 mt-20 w-full flex justify-center items-center  font-Kanit ">
                        <div className="flex gap-x-2 justify-center items-center ">
                          <span className="text-xl md:text-2xl font-bold text-[#2C7CD1] ">
                            {user.language === "Thai" && "กดเพื่อ"}
                            {user.language === "English" && "click to"}
                          </span>
                          <Popover.Button
                            className={`
                ${open ? "" : "text-opacity-90"}
            bg-[#EDBA02] border-2 border-transparent border-solid text-md px-5 py-2 rounded-lg 
                font-bold font-Kanit text-white cursor-pointer
              active:border-black hover:scale-110 transition md:text-2xl duration-150 ease-in-out"`}
                          >
                            <span>
                              {user.language === "Thai" && "สร้าง"}
                              {user.language === "English" && "CREATE"}
                            </span>
                          </Popover.Button>
                          <span className="text-xl  md:text-2xl  font-bold text-[#2C7CD1]">
                            {user.language === "Thai" && "ห้องเรียน"}
                            {user.language === "English" && "classroom"}
                          </span>
                        </div>
                      </div>
                      <Popover.Panel>
                        {({ close }) => (
                          <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ z-20">
                            <CreateClass
                              language={user.language}
                              close={close}
                              refetch={classrooms.refetch}
                            />
                          </div>
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>
            </header>

            {/* classrooms are here  */}
            <main
              className={`w-full h-max lg:pb-40 flex-col  
              md:flex-row md:flex-wrap items-start justify-center 
            lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-5 gap-5 mt-14 
            ${classroomState?.[0] ? "flex" : "hidden"} `}
            >
              {classrooms.isLoading ||
                (classrooms.isFetching && (
                  <div className=" gap-10 grid grid-cols-4 ">
                    <Skeleton variant="rectangular" width={320} height={210} />
                    <Skeleton variant="rectangular" width={320} height={210} />
                    <Skeleton variant="rectangular" width={320} height={210} />
                    <Skeleton variant="rectangular" width={320} height={210} />
                  </div>
                ))}
              {classroomState?.map((classroom, index) => {
                return (
                  <div
                    key={index}
                    className=" h-48  w-full  md:w-60 md:h-max lg:w-60 xl:w-80 md:pb-3  border-2 border-solid 
                    rounded-3xl overflow-hidden relative bg-white flex flex-col md:block items-start justify-center "
                  >
                    <div className="text-right mt-2 ">
                      <div className="text-3xl absolute right-4 top-3">
                        {!classroom.selected && (
                          <div
                            onClick={() => handleOpenClasssDeleted(index)}
                            role="button"
                            className="text-gray-700   hover:text-red-500 
                        cursor-pointer flex"
                          >
                            <MdDelete />
                          </div>
                        )}
                        {classroom.selected && (
                          <div className="flex gap-x-4">
                            <div
                              role="button"
                              onClick={() => {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: "You won't be able to revert this!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: "Yes, delete it!",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    deleteClassroom.mutate(classroom.id);
                                    Swal.fire(
                                      "Deleted!",
                                      "Your classroom has been deleted.",
                                      "success"
                                    );
                                  }
                                  handleCloseClasssDeleted(index);
                                });
                              }}
                              className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
                            >
                              <FcCheckmark />
                            </div>
                            <div
                              role="button"
                              onClick={() => {
                                handleCloseClasssDeleted(index);
                              }}
                              className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
                            >
                              <FcCancel />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col mt-0 pl-10 md:pl-5 md:mt-2 lg:mt-5 mb-10 ">
                      <span className="text-lg text-gray-600 font-light">
                        {classroom.level}
                      </span>
                      <span className="font-bold text-3xl  text-[#EDBA02]">
                        {classroom.title}
                      </span>
                      <span>{classroom.description}</span>
                    </div>
                    <div className="flex justify-center items-center  w-full lg:mt-5 ">
                      <button
                        onClick={() => {
                          localStorage.setItem("classroomId", classroom.id);
                          router.push({
                            pathname: `/classroom/teacher/${classroom.id}`,
                          });
                        }}
                        className="w-3/4 absolute md:relative bottom-2  h-9 mt-2 rounded-lg bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
                      >
                        <span>
                          {user.language === "Thai" && "🚪เข้าชั้นเรียน"}
                          {user.language === "English" && "Join"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;
  const querySanity = `*[_type == "whatsNews"]`;
  const whatsNews = await sanityClient.fetch(querySanity);

  const sortDateWhatsNews = whatsNews.sort(
    (a, b) => new Date(b._createdAt) - new Date(a._createdAt)
  );
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
          whatsNews: sortDateWhatsNews,
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
          whatsNews: sortDateWhatsNews,
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
