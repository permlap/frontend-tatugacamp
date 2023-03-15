import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Layout from "../../layouts/classroomLayout";
import { GetUser } from "../../service/service";
import { FiSettings, FiArrowLeftCircle } from "react-icons/fi";
import { UploadProfilePicture } from "../../service/user";
import Swal from "sweetalert2";

function Setting() {
  const [file, setFile] = useState();
  const user = useQuery(["user"], () => GetUser());
  //   const updateProfile = useMutation((formData) => {
  //     UploadProfilePicture(formData);
  //   });
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

      const updateProfile = await UploadProfilePicture(formData);
      console.log(updateProfile);
      if (updateProfile?.status === 200) {
        Swal.fire("success", "upload image is successful", "success");
        setTimeout(() => {
          user.refetch();
        }, 2000);
      }
    } catch (err) {
      console.log("err code", err);
      if (err) {
        Swal.fire("error", err.props.response.data.message, "error");
      }
    }
  };

  return (
    <div className="flex">
      <Layout sideMenus={sideMenus} user={user} />
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex w-max">
          <input
            type="file"
            onChange={handleFileInputChange}
            className="w-48 "
          />

          <button
            className=" w-max  h-max px-5 rounded-sm  bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
          >
            สร้าง
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setting;
