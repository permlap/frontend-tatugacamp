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

export async function SummitWork({ formFiles, assignmentId, studentId }) {
  try {
    const files = await formFiles.getAll("files");
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
    for (let i = 0; i < sumiit.data.length; i++) {
      const response = await fetch(sumiit.data[i].SignedURL, {
        method: "PUT",
        headers: {
          "Content-Type": `${sumiit.data[i].contentType}`,
        },
        body: files[i],
      }).catch((err) => console.log(err));
    }

    return "finish";
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
