import Lottie from "lottie-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import { isError, useQuery } from "react-query";
import Swal from "sweetalert2";
import { CreateStudentApi, GetAllStudents } from "../../service/students";
import * as SuccesfulAnimation from "../../components/79952-successful.json";
import Loading from "../loading/loading";
function CreateStudent({ close, handlePassingstudents }) {
  const router = useRouter();
  const [succesful, setSuccesful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentNumber, setStudentNumber] = useState();
  const [error, setError] = useState();
  const [sortedStudents, setSortedStudents] = useState(students?.data?.data);
  const students = useQuery(["students"], () =>
    GetAllStudents({ classroomId: router.query.classroomId })
  );

  useEffect(() => {
    setSortedStudents((prev) => {
      return students?.data?.data.sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });
    });
    handlePassingstudents(sortedStudents);
  }, [students.isFetching, sortedStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputObject = Object.fromEntries(formData);
    setError("");
    setLoading(true);
    try {
      const createStudent = await CreateStudentApi({
        inputObject,
        classroomId: router.query.classroomId,
      });
      setLoading(false);
      if (createStudent) {
        setSuccesful(true);
      }
      await students.refetch();
      document.getElementById("form-create-students").reset();

      setTimeout(() => {
        setSuccesful(false);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err?.props?.response?.data?.message);
    }
  };

  const style = {
    height: 50,
  };
  return (
    <div>
      <div className="w-max p-3 h-max fixed right-0 left-0 top-0 bottom-0 m-auto z-30  ">
        <div className="flex items-center justify-center gap-x-5  bg-transparent h-[0.05rem] w-max">
          <div
            className="w-96 h-[30rem] bg-white border-2 border-solid  flex-col justify-start items-center 
          rounded-xl font-Kanit md:flex hidden"
          >
            <div className=" font-Kanit font-bold text-xl mt-2">
              <span className="text-black">รายชื่อนักเรียน</span>
            </div>
            <div className="w-full  flex flex-col items-center justify-start mt-5">
              <ul className="grid grid-cols-3 pl-0 list-none w-full">
                <li className="flex justify-center items-cente">เลขที่</li>
                <li className="flex justify-center items-cente">ชื่อจริง</li>
                <li className="flex justify-center items-cente">นามสกุล</li>
              </ul>
              <ul
                className=" mt-5 list-disc flex flex-col justify-start items-start w-full pl-0
            gap-y-5 h-80  overflow-auto bg-white scrollbar"
              >
                {sortedStudents?.map((list) => {
                  return (
                    <li key={list.id} className="w-full">
                      <div className="grid  grid-cols-3  w-full">
                        <div className="flex justify-center items-center  ">
                          <span
                            className="w-8 h-8 bg-[#2C7CD1] flex items-center justify-center 
                          rounded-xl font-bold text-white"
                          >
                            {list.number}
                          </span>
                        </div>
                        <span className="flex justify-center items-center text-black">
                          {list.firstName}
                        </span>
                        <span className="flex justify-center items-center text-black">
                          {list.lastName}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div
            className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5  
        z-20"
          >
            <form
              id="form-create-students"
              className=" w-80 flex flex-col justify-center items-center "
              onSubmit={handleSubmit}
            >
              <span className="text-xl font-semibold text-[#2C7CD1]">
                ลงทะเบียนนักเรียน
              </span>
              <div className="flex flex-col relative">
                <label className="font-sans font-normal">ชื่อจริง</label>
                <input
                  className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
                  type="text"
                  name="firstName"
                  placeholder="เช่น เพิ่มลาภ"
                  maxLength="30"
                />
                <div
                  className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                >
                  <FcBusinessContact />
                </div>
              </div>

              <div className="flex flex-col relative mt-2">
                <label className="font-sans font-normal">นามสกุล</label>
                <input
                  className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
                  type="text"
                  name="lastName"
                  placeholder="เช่น โพธิ์หล้า"
                  maxLength="30"
                />
                <div
                  className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                >
                  <FcLineChart />
                </div>
              </div>
              <div className="flex flex-col relative mt-2">
                <label className="font-sans font-normal">เลขที่</label>
                <input
                  className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
                  type="number"
                  name="number"
                  placeholder="เช่น 02"
                  maxLength="10"
                  min="1"
                  required
                />
                <div
                  className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                >
                  <FcViewDetails />
                </div>
              </div>

              <button
                className="w-full  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid flex items-center justify-center"
              >
                {succesful && (
                  <Lottie animationData={SuccesfulAnimation} style={style} />
                )}
                {loading && <Loading />}
                {!loading && !succesful && <span>สร้าง</span>}
              </button>
              <div>
                {error && <span className="text-red-500 ">{error}</span>}
              </div>
            </form>
          </div>
          <div
            onClick={() => close()}
            className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/50 "
          ></div>
        </div>
      </div>
    </div>
  );
}

export default CreateStudent;
