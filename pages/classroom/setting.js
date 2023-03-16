import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Layout from "../../layouts/classroomLayout";
import { GetUser } from "../../service/service";
import { FiSettings, FiArrowLeftCircle } from "react-icons/fi";
import { UpdateUserData, UploadProfilePicture } from "../../service/user";
import Swal from "sweetalert2";
import Image from "next/image";
import Loading from "../../components/loading/loading";
import { useRouter } from "next/router";

function Setting() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
      title: "หน้าหลัก",
      icon: "🏫",
      url: "/classroom",
    },

    {
      title: "ตั้งค่า",
      icon: <FiSettings />,
      url: "/classroom/setting",
    },
    {
      title: "Go back",
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
    setUserData((prevState) => ({
      ...prevState,
      firstName: user?.data?.data?.firstName,
      lastName: user?.data?.data?.lastName,
      school: user?.data?.data?.school,
      phone: user?.data?.data?.phone,
    }));
  }, [user.data]);

  //handle summit file
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!file) {
        console.error("No file selected");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      setLoading((prev) => (prev = true));
      const updateProfile = await UploadProfilePicture(formData);
      console.log(updateProfile);
      if (updateProfile?.status === 200) {
        setLoading((prev) => (prev = false));
        Swal.fire("success", "upload image is successful", "success");
        setTimeout(() => {
          user.refetch();
        }, 2000);
      }
    } catch (err) {
      setLoading((prev) => (prev = false));
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
      setUserData((prevState) => ({
        ...prevState,
        firstName: userUpdate?.data?.data?.firstName,
        lastName: userUpdate?.data?.data?.lastName,
        school: userUpdate?.data?.data?.school,
        phone: userUpdate?.data?.data?.phone,
      }));
      if (userUpdate.status === 200) {
        Swal.fire("success", "update your profile successfully😃", "success");
      }
    } catch (err) {
      Swal.fire("error", err.props.response.data.message.toString(), "error");
    }
  };

  return (
    <div className="flex font-sans  ">
      <Layout sideMenus={sideMenus} user={user} trigger={chooseMessage} />
      <div
        className={`w-full h-screen mt-10 pl-20 flex flex-col ${
          !triggersidebar ? "items-start" : "items-center"
        } bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover `}
      >
        <div>
          <span className="text-4xl font-medium text-gray-800">
            Account setting
          </span>
          <div className="flex gap-5 mt-5">
            {user?.data?.data?.picture && (
              <div className="relative w-40 h-40 rounded-md overflow-hidden flex justify-center items-center">
                {loading ? (
                  <Loading />
                ) : (
                  <Image
                    src={user.data.data.picture}
                    layout="fill"
                    className="object-cover"
                  />
                )}
              </div>
            )}

            <div className="flex flex-col gap-y-5">
              <span className="text-xl">Change your profile here</span>

              <form
                onSubmit={handleSubmit}
                className="flex w-max  flex-col gap-2 justify-start items-start "
              >
                <label>
                  <input
                    aria-label="upload profile picture"
                    onChange={handleFileInputChange}
                    type="file"
                    class="text-sm text-grey-500
            file:mr-5 file:w-28 file:py-2
            file:rounded-full file:border-0
            file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                  />
                </label>
                <button
                  className=" w-28  h-max px-6 py-2 text-sm rounded-full border-none  bg-[#2C7CD1] text-white font-sans font-bold
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
        <form onSubmit={handleSubmitData} className=" mt-10 max-w-3xl  ">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-first-name"
              >
                First Name
              </label>
              <input
                value={userData.firstName}
                onChange={handleChange}
                name="firstName"
                className="appearance-none block w-80 bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Update your first name here"
              />
            </div>
            <div>
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-last-name"
              >
                Last Name
              </label>
              <input
                value={userData.lastName}
                onChange={handleChange}
                name="lastName"
                className="appearance-none block w-80 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="update your last name here"
              />
            </div>

            <div>
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-last-name"
              >
                Phone number
              </label>
              <input
                value={userData.phone}
                onChange={handleChange}
                name="phone"
                className="appearance-none block w-80 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="update your phone number here"
              />
            </div>
            <div>
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-last-name"
              >
                School
              </label>
              <input
                value={userData.school}
                onChange={handleChange}
                name="school"
                className="appearance-none block w-80 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="update your school name here"
              />
            </div>
            <button
              aria-label="update user button"
              className=" w-28  h-max px-6 py-2 text-sm rounded-xl border-none  bg-[#2C7CD1] text-white font-sans font-bold
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
  );
}

export default Setting;
