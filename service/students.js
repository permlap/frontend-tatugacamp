import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function GetAllStudents(data) {
  try {
    if (!data.classroomId) {
      return null;
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const student = await axios.get(
      `${process.env.Server_Url}/user/student/get-all-student?classroomId=${data.classroomId}`,
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student;
  } catch (err) {
    throw new Error(err);
  }
}
export async function GetAllStudentScores({ classroomId }) {
  try {
    if (!classroomId) {
      return null;
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.get(
      `${process.env.Server_Url}/user/assignment/get-allStudentScores`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return students;
  } catch (err) {
    throw new Error(err);
  }
}

export async function CreateStudentApi({
  number,
  firstName,
  lastName,
  classroomId,
}) {
  const picture = [
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3049.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3050.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3051.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3052.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3053.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3054.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3060.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3062.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG",
  ];
  try {
    const converNumber = Number(number);
    const StringNumber = converNumber.toString();
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const student = await axios.post(
      `${process.env.Server_Url}/user/student/create?classroomId=${classroomId}`,
      {
        firstName: firstName,
        lastName: lastName,
        number: StringNumber,
        picture: picture[Math.floor(Math.random() * picture.length)],
      },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateStudent({ formData, studentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const updateStudent = await axios.put(
      `${process.env.Server_Url}/user/student/update`,
      formData,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return updateStudent;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DelteStudent({ studentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const deleteStudent = await axios.delete(
      `${process.env.Server_Url}/user/student/delete`,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(deleteStudent);
    return deleteStudent;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
