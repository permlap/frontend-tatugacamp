import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import {
  GetUser,
  GetUserCookie,
  UpdateUserData,
  UploadProfilePicture,
} from "../../service/user";
import Swal from "sweetalert2";
import Image from "next/image";
import Loading from "../../components/loading/loading";
import { useRouter } from "next/router";
import Unauthorized from "../../components/error/unauthorized";
import Layout from "../../layouts/schoolLayout";
import { parseCookies } from "nookies";
import { HiLanguage } from "react-icons/hi2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { sideMenusEng, sideMenusThai } from "../../data/menubarsSetting";
import Head from "next/head";

const options = ["Thai", "English"];

function Setting({ userServerSide, error }) {
  const [languageValue, setLanguageValue] = React.useState(options[0]);
  const [sideMenus, setSideMenus] = useState();
  const [inputLanguageValue, setInputLanguageValue] = React.useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    school: "",
    picture: "",
    email: "",
    language: options[0],
  });
  const user = useQuery(["user"], () => GetUser());
  const [triggersidebar, setTriggerSidebar] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };

  //get trigger from child component
  const chooseMessage = (trigger) => {
    setTriggerSidebar(trigger);
  };

  //check auth wheter the sesstion is expire or not
  useEffect(() => {
    setUserData((prevState) => ({
      ...prevState,
      firstName: user?.data?.data?.firstName,
      lastName: user?.data?.data?.lastName,
      school: user?.data?.data?.school,
      phone: user?.data?.data?.phone,
      email: user?.data?.data?.email,
      picture: user?.data?.data?.picture,
    }));
    setLanguageValue(() => user?.data?.data?.language);
    if (user?.data?.data?.language === "Thai") {
      setSideMenus(() => sideMenusThai);
    } else if (user?.data?.data?.language === "English") {
      setSideMenus(() => sideMenusEng);
    }
  }, [user.isSuccess, user.isRefetching]);
  //handle summit file
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!file) {
        return Swal.fire(
          "No file chosen❗",
          "please select one image to be your avatar",
          "error"
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      setLoading((prev) => (prev = true));
      const updateProfile = await UploadProfilePicture({ formData });

      if (updateProfile?.status === 200) {
        setLoading((prev) => (prev = false));
        Swal.fire("success", "upload image is successful", "success");
        setTimeout(() => {
          user.refetch();
        }, 2000);
      }
    } catch (err) {
      setLoading((prev) => (prev = false));
      console.log(err);
      if (err.props.response.data.statusCode === 413) {
        Swal.fire(
          "error",
          "Your file is too large. We only allow image files with a maximum size of 1024x1024 pixels.",
          "error"
        );
      } else {
        Swal.fire("error", err?.props?.response?.data?.message, "error");
      }
    }
  };

  //handle change in user data form for updating
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //handle summit user's data
  const handleSubmitData = async (e) => {
    try {
      e.preventDefault();
      const userUpdate = await UpdateUserData(userData);

      if (userUpdate.status === 200) {
        user.refetch();

        Swal.fire("success", "update your profile successfully😃", "success");
      }
    } catch (err) {
      Swal.fire("error", err.props.response.data.message.toString(), "error");
    }
  };
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }

  return (
    <div className="flex font-sans">
      <Head>
        <title>setting - account</title>
      </Head>
      <Layout sideMenus={sideMenus} user={userData} trigger={chooseMessage} />
      <div
        className={`w-full h-full py-10  mt-10 md:mt-0  flex flex-col items-center md:justify-center
         bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover `}
      >
        <div
          className=" h-5/6 w-5/6 md:max-w-xl lg:max-w-3xl
         md:mt-0 bg-white md:p-10 lg:px-20 p-2 rounded-xl mt-20 border-2 border-solid "
        >
          <div className="flex flex-col items-center justify-center  md:block">
            <span className="text-4xl font-medium text-gray-800 ">
              Account setting
            </span>
            <div className="flex gap-x-5 md:gap-5 mt-5  items-center justify-center">
              {user?.data?.data?.picture ? (
                <div
                  className="relative lg:w-60 lg:h-48 md:w-40 md:h-40 w-20 h-20 rounded-md overflow-hidden 
                flex justify-center items-center"
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    <Image
                      src={user.data.data.picture}
                      layout="fill"
                      className="object-cover"
                      alt={`profile picture of ${user.data.data.firstName}`}
                    />
                  )}
                </div>
              ) : (
                <div className="w-40 h-40 bg-white rounded-md flex items-center justify-center">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="relative w-40 h-40 bg-blue-500  rounded-md overflow-hidden flex justify-center items-center">
                      <span className="text-8xl font-Kanit font-semibold text-white">
                        {user?.data?.data?.firstName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col w-3/5 md:w-full gap-y-5 ">
                <span className="md:text-xl text-sm">
                  Change your profile here
                </span>

                <form
                  onSubmit={handleSubmit}
                  className="flex md:w-max w-full  flex-col  gap-2 justify-start items-start "
                >
                  <label className="w-3/4 flex flex-col gap-1 ">
                    {user?.data?.data?.language === "Thai" && "เลือกรูปภาพ"}
                    {user?.data?.data?.language === "English" &&
                      "pick your image"}
                    <input
                      aria-label="upload profile picture"
                      onChange={handleFileInputChange}
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      className="text-sm text-grey-500
            file:mr-5 md:file:w-max file:w-20 w-full file:py-2
            file:rounded-full file:border-0
            file:text-sm file:font-medium 
            file:bg-blue-50 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                    />
                  </label>
                  <button
                    className=" md:w-28 w-20 text-center  h-max px-0 md:px-6 py-2 text-sm rounded-full border-none  bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 focus:border-solid hover:scale-110 transition duration-200
               hover:bg-red-700"
                  >
                    upload
                  </button>
                </form>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmitData}
            className=" mt-10 max-w-3xl flex flex-col items-center justify-center md:block "
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 lg:gap-x-20 gap-2">
              <div>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  First Name
                </label>
                <input
                  value={userData.firstName}
                  onChange={handleChange}
                  name="firstName"
                  className="appearance-none block w-60 md:w-40 lg:w-full bg-[#EDBA02]
                 text-black font-bold font-sans focus:bg-[#e7c95c] placeholder:text-whit  border-none
                  border-red-500 rounded py-3 px-4 mb-3 leading-tight 
                 focus:outline-none e"
                  id="grid-first-name"
                  type="text"
                  placeholder="Update your first name here"
                />
              </div>
              <div>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Last Name
                </label>
                <input
                  value={userData.lastName}
                  onChange={handleChange}
                  name="lastName"
                  className="appearance-none block w-60 md:w-40 lg:w-full
                bg-[#EDBA02] text-black font-bold font-sans focus:bg-[#e7c95c] placeholder:text-whit  border-none
                 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  placeholder="update your last name here"
                />
              </div>

              <div>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Phone number
                </label>
                <input
                  value={userData.phone}
                  onChange={handleChange}
                  name="phone"
                  className="appearance-none block w-60 md:w-40 lg:w-full
                bg-[#EDBA02] text-black font-bold font-sans focus:bg-[#e7c95c] placeholder:text-red-500 placeholder:font-normal border-none
                 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  placeholder="update your phone number here"
                />
              </div>
              <div>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  School
                </label>
                <input
                  value={userData.school}
                  onChange={handleChange}
                  name="school"
                  className="appearance-none block w-60 md:w-40 lg:w-full
                bg-[#EDBA02] text-black font-bold font-sans focus:bg-[#e7c95c] placeholder:text-red-500 placeholder:font-normal border-none
                rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  placeholder="update your school name here"
                />
              </div>
            </div>

            <div className="w-full h-[1px] bg-black mt-10"></div>
            <div className="mt-5 w-full flex flex-col justify-center items-center">
              <div className="w-full flex flex-col justify-center items-center md:items-start  pb-10">
                <div className="flex h-max  items-center justify-start gap-2">
                  <span className="md:text-xl text-md">Language setting</span>
                  <div className="flex text-xl items-center justify-center text-center h-5 w-5 bg-[#EDBA02] p-1 rounded-full text-white">
                    <HiLanguage />
                  </div>
                </div>
                <Autocomplete
                  className="mt-10"
                  value={languageValue}
                  onChange={(event, newValue) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        language: newValue,
                      };
                    });
                    setLanguageValue(newValue);
                  }}
                  inputValue={inputLanguageValue}
                  onInputChange={(event, newInputValue) => {
                    setInputLanguageValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  sx={{ width: 250 }}
                  renderInput={(params) => (
                    <TextField {...params} label="language" />
                  )}
                />
              </div>
            </div>
            <button
              aria-label="update user button"
              className=" w-28  h-max px-6 py-2 text-sm mb-5 rounded-xl border-none  bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 focus:border-solid hover:scale-110 transition duration-200
               hover:bg-red-700"
            >
              update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Setting;
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
      const userServerSide = userData.data;

      return {
        props: {
          userServerSide,
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
      const userServerSide = userData.data;
      return {
        props: {
          userServerSide,
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
