import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";
import Loading from "../loading/loading";
import { MdError, MdOutlineCancel } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { GrRevert, GrScorecard } from "react-icons/gr";
import {
  AssignWorkToSTudent,
  UpdateAssignmentApi,
} from "../../service/assignment";
import Swal from "sweetalert2";
import { Box, TextField } from "@mui/material";

function UpdateAssignment({
  assignment,
  setTriggerUpdateAssignment,
  studentOnAssignments,
  setShowAssignment,
  assignments,
}) {
  const rounter = useRouter();
  const [assignmentData, setAssignmentData] = useState(assignment?.data?.data);
  const [isChecked, setIsChecked] = useState();
  const [isAssignStudent, setIsAssignmentStdent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActivetab] = useState(0);
  const [tabs, setTabs] = useState([
    {
      title: "assignment",
    },
    {
      title: "students",
    },
  ]);

  //handdle active tab
  const handleActiveTab = (index) => {
    setActivetab(index);

    if (index === 0) {
      setIsAssignmentStdent(false);
    } else if (index === 1) {
      setIsAssignmentStdent(true);
    }
  };

  // handle chagne of assignment's detail
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  //set isCheck to students
  useEffect(() => {
    setIsChecked(() =>
      studentOnAssignments?.data?.data?.map((student) => {
        return {
          ...student,
          [student.id]: false,
        };
      })
    );
  }, [studentOnAssignments.data]);

  // when input checkobx change apply value to isChecked in each student
  const handleChangeCheck = ({ studentId }) => {
    setIsChecked((prevState) => {
      return prevState.map((prevStudent) => {
        if (prevStudent.id === studentId) {
          return {
            ...prevStudent,
            [studentId]: !prevStudent[studentId],
          };
        } else {
          return { ...prevStudent };
        }
      });
    });
  };

  //convert the string date to format that input date required
  const date = new Date(assignmentData.deadline);
  const formattedDate = date.toISOString().split("T")[0];

  //handle click to sclect all student
  const onClickIsCheck = () => {
    setIsChecked((prevState) => {
      return prevState.map((student) => {
        if (student.status === "no-assign") {
          return {
            ...student,
            [student.id]: !student[student.id],
          };
        } else {
          return {
            ...student,
          };
        }
      });
    });
  };

  //handle click to assign student work
  const onClickAssignWork = async () => {
    try {
      setLoading(true);
      const assign = await AssignWorkToSTudent({
        isChecked,
        assignmentCreated: assignmentData,
      });
      setIsChecked(assign);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const updateAssignment = await UpdateAssignmentApi({
        assignmentId: assignmentData.id,
        title: assignmentData.title,
        description: assignmentData.body,
        maxScore: assignmentData.maxScore,
        deadline: assignmentData.deadline,
      });
      Swal.fire("success", "assignment has been updated", "success");
      setTriggerUpdateAssignment(false);
      assignment.refetch();
    } catch (err) {
      console.log(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  justify-center items-center bg-white h-screen font-Kanit 
      "
    >
      <div
        onClick={() => setTriggerUpdateAssignment(false)}
        className="absolute z-20 top-5 right-5 text-3xl hover:scale-110 hover:text-red-400 transition duration-150 cursor-pointer"
      >
        <MdOutlineCancel />
      </div>

      <div className="w-full flex mt-2 items-center justify-center ">
        <div className="flex w-56 h-10 justify-between bg-white  rounded-xl">
          {tabs.map((tab, index) => {
            return (
              <div
                key={index}
                role="button"
                onClick={() => handleActiveTab(index)}
                className={`w-28 px-4 flex items-center justify-center cursor-pointer h-full rounded-xl ${
                  activeTab === index
                    ? "text-white bg-orange-600"
                    : "text-black bg-transparent"
                }`}
              >
                {tab.title}
              </div>
            );
          })}
        </div>
      </div>
      {isAssignStudent === false ? (
        <div className="w-full h-full flex gap-8  ">
          <div className="flex-col flex gap-4 m-5 w-3/4">
            <div className="flex flex-col gap-0">
              <Box width="100%" className="bg-white">
                <TextField
                  name="title"
                  onChange={handleChange}
                  fullWidth
                  label="title"
                  value={assignmentData?.title}
                />
              </Box>
            </div>

            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
              textareaName="description"
              initialValue={assignmentData?.description}
              init={{
                link_context_toolbar: true,
                height: "100%",
                width: "100%",
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                  "link",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help | link",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={(newText) =>
                setAssignmentData((prev) => {
                  return {
                    ...prev,
                    body: newText,
                  };
                })
              }
            />

            <button
              type="submit"
              className="w-full py-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
          text-md cursor-pointer hover: active:border-2  active:border-gray-300
           active:border-solid  focus:border-2 hover:bg-red-500 transition duration-150
          focus:border-solid"
            >
              update
            </button>
          </div>
          <div
            className="w-[30%]   
      flex flex-col items-center justify-start gap-5"
          >
            <div className=" flex flex-col">
              <label>กำหนดส่ง</label>
              <input
                value={formattedDate}
                onChange={handleChange}
                name="deadline"
                className="w-40 appearance-none outline-none border-none ring-2 rounded-md px-5 
            py-2 text-lg ring-gray-200 focus:ring-black "
                type="date"
                placeholder="Please select a date"
                required
              />
            </div>
            <div className="flex flex-col w-max relative  h-max ">
              <label>คะแนนของงาน</label>
              <input
                min="1"
                value={assignmentData.maxScore}
                required
                onChange={handleChange}
                name="maxScore"
                className="w-40 appearance-none outline-none border-none ring-2 rounded-md px-5 
            py-2 text-lg ring-gray-200 focus:ring-black placeholder:text-sm"
                type="number"
                placeholder="ใส่คะแนนของงาน"
              />
              <div className="text-lg absolute top-8 right-5">
                <GrScorecard />
              </div>
            </div>
            <div className="relative w-60 h-80">
              <Image
                src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3053.PNG"
                layout="fill"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : (
        <form className="w-full h-full flex items-center justify-center flex-col gap-1">
          <div className="text-2xl font-Kanit font-semibold">
            เลือกผู้เรียนเพื่อมอบหมายงาน
          </div>

          <div
            className="w-2/4 h-full max-h-[28rem] flex relative items-center
           justify-start overflow-auto scrollbar  flex-col "
          >
            {loading ? (
              <div className="absolute w-full  h-full flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              isChecked?.map((student, index) => {
                const oddNumber = index % 2;
                return (
                  <div
                    key={student.id}
                    className={`grid grid-cols-4  w-full relative items-center justify-center ${
                      oddNumber === 0 ? "bg-white" : "bg-orange-100"
                    } py-2 
              text-lg font-Kanit `}
                  >
                    {student.status === 201 && (
                      <div className="flex items-center justify-center left-3  absolute text-green-500">
                        <AiOutlineCheckCircle />
                      </div>
                    )}
                    {student.status?.error && (
                      <div className="flex items-center justify-center left-3 absolute text-red-600">
                        <MdError />
                      </div>
                    )}
                    <div className="flex items-center justify-center">
                      {student.number}
                    </div>
                    <div className="flex items-center justify-center">
                      {student.firstName}
                    </div>
                    <div className="flex items-center justify-center">
                      {student.lastName}
                    </div>
                    {student.status === "no-assign" ? (
                      <div className="flex items-center justify-center ">
                        <input
                          checked={student?.[student.id]}
                          onChange={() =>
                            handleChangeCheck({ studentId: student.id })
                          }
                          type="checkbox"
                          className="w-6 h-6  text-blue-600 bg-gray-100 border-gray-300 rounded
                   focus:ring-blue-500 dark:focus:ring-blue-600
                   dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full text-sm bg-green-500 py-1  rounded-lg text-white
                      flex items-center justify-center"
                      >
                        มอบหมายแล้ว
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex gap-5 mt-4">
            <button
              type="button"
              onClick={onClickIsCheck}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              เลือกผู้เรียนทั้งหมด
            </button>
            <button
              type="button"
              onClick={onClickAssignWork}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              มอบหมายงาน
            </button>
          </div>
        </form>
      )}
    </form>
  );
}

export default UpdateAssignment;
