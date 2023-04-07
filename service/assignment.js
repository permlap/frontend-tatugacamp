import axios from "axios";
import Error from "next/error";

export async function CreateAssignmentApi({
  classroomId,
  title,
  description,
  deadline,
  maxScore,
}) {
  try {
    const maxScoreNum = Number(maxScore);
    const dateFormat = new Date(deadline);
    console.log(dateFormat);
    const access_token = localStorage.getItem("access_token");
    const assignment = await axios.post(
      `${process.env.Server_Url}/user/assignment/create`,
      {
        title: title,
        deadline: dateFormat,
        description: description,
        maxScore: maxScoreNum,
      },
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return assignment;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllAssignments({ classroomId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const assignments = await axios.get(
      `${process.env.Server_Url}/user/assignment/get-all-assignment`,

      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return assignments;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAssignmentProgress({ assignments }) {
  let progresses = [];
  for (const assignment of assignments) {
    try {
      const access_token = localStorage.getItem("access_token");

      const progress = await axios.get(
        `${process.env.Server_Url}/user/assignment/progress-assignment`,

        {
          params: {
            assignmentId: assignment.id,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      progresses.push({ ...assignment, progress: progress.data });
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
  return progresses;
}

export async function AssignWorkToSTudent({ isChecked, assignmentCreated }) {
  let stduentOnAssignment = [];
  for (const student of isChecked) {
    console.log(student[student.id]);
    if (student[student.id] === true) {
      try {
        const access_token = localStorage.getItem("access_token");
        console.log(access_token);
        const assign = await axios.post(
          `${process.env.Server_Url}/user/assignment/assign-work-to-student`,
          {},
          {
            params: {
              studentId: student.id,
              assignmentId: assignmentCreated.data.id,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        stduentOnAssignment.push(assign);
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }
  }
  return stduentOnAssignment;
}
