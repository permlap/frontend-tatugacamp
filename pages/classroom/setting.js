import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Layout from "../../layouts/classroomLayout";
import { FiSettings, FiArrowLeftCircle } from "react-icons/fi";
import {
  GetUser,
  UpdateUserData,
  UploadProfilePicture,
} from "../../service/user";
import Swal from "sweetalert2";
import Image from "next/image";
import Loading from "../../components/loading/loading";
import { useRouter } from "next/router";
import Unauthorized from "../../components/error/unauthorized";

function Setting() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    school: "",
  });
  const [triggersidebar, setTriggerSidebar] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const user = useQuery(["user"], () => GetUser());
  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };
  // for passing data to sidebar
  const sideMenus = [
    {
      title: "โรงเรียน",
      icon: "🏫",
      url: "/classroom",
    },

    {
      title: "ตั้งค่า",
      icon: <FiSettings />,
      url: "/classroom/setting",
    },
    {
      title: "หน้าหลัก",
      icon: <FiArrowLeftCircle />,
      url: "/",
    },
  ];

  //get trigger from child component
  const chooseMessage = (trigger) => {
    setTriggerSidebar(trigger);
  };

  //check auth wheter the sesstion is expire or not
  useEffect(() => {
    if (user.data === "Unauthorized") {
      router.push("/auth/signIn");
    }
    if (user.isFetching === false) {
      if (!user.data) {
        router.push("/auth/signIn");
      }
    }
    setUserData((prevState) => ({
      ...prevState,
      firstName: user?.data?.data?.firstName,
      lastName: user?.data?.data?.lastName,
      school: user?.data?.data?.school,
      phone: user?.data?.data?.phone,
    }));
  }, []);

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
      const updateProfile = await UploadProfilePicture(formData);

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
        user.refetch().then(
          setUserData((prevState) => ({
            ...prevState,
            firstName: userUpdate?.data?.firstName,
            lastName: userUpdate?.data?.lastName,
            school: userUpdate?.data?.school,
            phone: userUpdate?.data?.phone,
          }))
        );
        Swal.fire("success", "update your profile successfully😃", "success");
      }
    } catch (err) {
      Swal.fire("error", err.props.response.data.message.toString(), "error");
    }
  };
  if (!user.data) {
    return <Unauthorized user={user} />;
  }

  return (
    <div className="flex font-sans   ">
      <Layout sideMenus={sideMenus} user={user} trigger={chooseMessage} />
      <div
        className={`w-full h-screen mt-10 md:mt-0  flex flex-col items-center md:justify-center
         bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover `}
      >
        <div
          className=" h-max w-5/6 md:max-w-xl lg:max-w-3xl
         md:mt-0 bg-white md:p-10 lg:px-20 p-2 rounded-xl mt-20 border-2 border-solid "
        >
          <div className="flex flex-col items-center justify-center  md:block">
            <span className="text-4xl font-medium text-gray-800 ">
              Account setting
            </span>
            <div className="flex gap-x-5 md:gap-5 mt-5  items-center justify-center">
              {user?.data?.data?.picture ? (
                <div className="relative md:w-40 md:h-40 w-20 h-20 rounded-md overflow-hidden flex justify-center items-center">
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
                  <label className="w-3/4 ">
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
            className=" mt-10 max-w-3xl flex items-center justify-center md:block "
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
              <button
                aria-label="update user button"
                className=" w-28  h-max px-6 py-2 text-sm mb-5 rounded-xl border-none  bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 focus:border-solid hover:scale-110 transition duration-200
               hover:bg-red-700"
              >
                update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Setting;
