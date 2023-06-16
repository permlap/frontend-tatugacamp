import axios from "axios";
import Error from "next/error";

export async function GetAllAssignment({ studentId, classroomId }) {
  try {
    if (!studentId || !classroomId) {
      return null;
    }
    const assignments = await axios.get(
      `${process.env.Server_Url}/student/student-assignment/get-all`,
      {
        params: {
          studentId: studentId,
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return assignments;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetMyWork({ studentId, assignmentId }) {
  try {
    const myWork = await axios.get(
      `${process.env.Server_Url}/student/student-assignment/view-my-work`,
      {
        params: {
          studentId: studentId,
          assignmentId: assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return myWork;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function SummitWork({ formFiles, body, assignmentId, studentId }) {
  try {
    console.log("server", formFiles);
    const sumiit = await axios.post(
      `${process.env.Server_Url}/student/student-assignment/summit-work`,
      formFiles,
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(sumiit);
    return sumiit;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
