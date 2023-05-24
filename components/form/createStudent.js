import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FcBusinessContact,
  FcLineChart,
  FcViewDetails,
  FcUndo,
} from "react-icons/fc";
import { SiMicrosoftexcel } from "react-icons/si";
import { useQuery } from "react-query";
import { CreateStudentApi, GetAllStudents } from "../../service/students";
import Lottie from "lottie-react";
import * as SuccesfulAnimation from "../../components/79952-successful.json";
import Loading from "../loading/loading";
import ExcelTable from "./createManyStudent";
import { MdError } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";

function CreateStudent({ close }) {
  const router = useRouter();
  const [succesful, setSuccesful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExcelData, setIsExcelData] = useState(true);
  const [studentNumber, setStudentNumber] = useState();
  const [error, setError] = useState();
  // students' data from excel
  const [tabelData, setTabledata] = useState();
  const [sortedStudents, setSortedStudents] = useState(students?.data?.data);
  const students = useQuery(["students"], () =>
    GetAllStudents({ classroomId: router.query.classroomId })
  );

  //get excelData
  const getExcelData = (data) => {
    setTabledata(data);
  };
  // sort student by nuber
  useEffect(() => {
    setSortedStudents((prev) => {
      return students?.data?.data.sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });
    });
  }, [students.isFetching, sortedStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputObject = Object.fromEntries(formData);
    setError("");
    setLoading(true);
    try {
      const createStudent = await CreateStudentApi({
        firstName: inputObject.firstName,
        lastName: inputObject.lastName,
        number: inputObject.number,
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
    <div className="">
      <div className="w-max p-3 h-max fixed right-0 left-0 top-0 bottom-0 m-auto z-40  ">
        <div className="flex items-center justify-center gap-x-5  bg-transparent h-[0.05rem] w-max">
          <div
            className="w-[40rem] max-w-[40rem] h-[30rem] bg-white border-2 border-solid  flex-col justify-start items-center 
          rounded-xl font-Kanit md:flex hidden"
          >
            <div className=" font-Kanit font-bold text-xl mt-2">
              <span className="text-black">
                {isExcelData
                  ? "รายชื่อนักเรียนในห้อง"
                  : "รายชื่อนักเรียนที่จะถูกสร้าง"}
              </span>
            </div>
            <div className="w-full  flex flex-col items-center justify-start mt-5">
              <ul
                className={`grid ${
                  isExcelData === false ? "grid-cols-5" : "grid-cols-3"
                } pl-0 list-none w-full`}
              >
                <li className="flex justify-center items-cente">เลขที่</li>
                <li className="flex justify-center items-cente">ชื่อจริง</li>
                <li className="flex justify-center items-cente">นามสกุล</li>
                {isExcelData === false && (
                  <li className="flex justify-center items-cente col-span-2">
                    สถานะ
                  </li>
                )}
              </ul>
              <ul
                className=" mt-5 list-disc flex flex-col justify-start items-start w-full pl-0
            gap-y-5 h-80  overflow-auto bg-white scrollbar"
              >
                {isExcelData === false
                  ? tabelData?.map((list) => {
                      return (
                        <li key={list.id} className="w-full">
                          <div className={`grid  grid-cols-5 w-full`}>
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

                            {list.status === 400 && (
                              <div className="flex text-red-500 col-span-2 justify-center  items-center relative group cursor-pointer   bg-white">
                                <div
                                  className="w-40 text-xs h-max bg-white rounded-md 
                                absolute top-0 right-0 left-10 bottom-0 m-auto hidden group-hover:flex"
                                >
                                  {list.error}
                                </div>
                                <MdError />
                              </div>
                            )}
                            {list.status === 200 && (
                              <div className="flex text-green-500 text-lg justify-center col-span-2  items-center  ">
                                <AiOutlineCheckCircle />
                              </div>
                            )}
                            {list.Notloading === false && (
                              <div className="flex justify-center  items-center  ">
                                <Loading />
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })
                  : sortedStudents?.map((list) => {
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
            className="flex w-max relative h-max font-Kanit pt-10 bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5  
        z-20"
          >
            {isExcelData ? (
              <div
                onClick={() => setIsExcelData(false)}
                role="button"
                aria-label="click to import data from excel to create student"
                className="text-green-600 text-2xl flex items-center  absolute top-2 right-1
              justify-center flex-col w-16 text-left cursor-pointer hover:text-green-800 transition duration-150"
              >
                <SiMicrosoftexcel />
                <span className="text-xs text-center">
                  นำเข้าข้อมูลจาก Excel
                </span>
              </div>
            ) : (
              <div
                onClick={() => setIsExcelData(true)}
                role="button"
                aria-label="click to undo data from excel to create student"
                className=" text-2xl flex items-center  absolute top-2 right-1
              justify-center flex-col w-16 text-left cursor-pointer transition duration-150"
              >
                <FcUndo />
                <span className="text-xs text-center">กลับ</span>
              </div>
            )}
            {isExcelData ? (
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
                  <label className="font-sans font-normal">
                    นามสกุล (optional)
                  </label>
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
            ) : (
              <div>
                <ExcelTable getExcelData={getExcelData} students={students} />
              </div>
            )}
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
