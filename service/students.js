import axios from "axios";
import Error from "next/error";

export async function GetAllStudents(data) {
  try {
    const access_token = localStorage.getItem("access_token");
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
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3063.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG",
  ];
  try {
    const converNumber = Number(number);
    const StringNumber = converNumber.toString();
    const access_token = localStorage.getItem("access_token");
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

export async function UpdateStudent({
  firstName,
  lastName,
  number,
  studentId,
}) {
  try {
    console.log(firstName, lastName, number, studentId);
    const access_token = localStorage.getItem("access_token");
    const converNumber = Number(number);
    const StringNumber = converNumber.toString();
    const updateStudent = await axios.put(
      `${process.env.Server_Url}/user/student/update`,
      {
        firstName: firstName,
        lastName: lastName,
        number: number,
      },
      {
        params: {
          studentId: studentId,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(updateStudent);
    return updateStudent;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DelteStudent({ studentId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    console.log("studentId", studentId);
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
