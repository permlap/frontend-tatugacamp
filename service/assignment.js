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
    let progresses = [];
    for (const assignment of assignments.data) {
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
    if (student[student.id] === true) {
      try {
        const access_token = localStorage.getItem("access_token");
        const assign = await axios.post(
          `${process.env.Server_Url}/user/assignment/assign-work-to-student`,
          {},
          {
            params: {
              studentId: student.id,
              assignmentId: assignmentCreated.id,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        stduentOnAssignment.push({ ...student, status: 201, assign: assign });
      } catch (err) {
        console.log(err);
        stduentOnAssignment.push({ ...student, status: { error: err } });
      }
    } else if (student[student.id] === false) {
      console.log(student);
      stduentOnAssignment.push(student);
    }
  }
  return stduentOnAssignment;
}

export async function ViewAllAssignOnStudent({ classroomId, assignmentId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const studentWorks = await axios.get(
      `${process.env.Server_Url}/user/assignment/view-all-assign-on-student`,
      {
        params: {
          classroomId: classroomId,
          assignmentId: assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return studentWorks;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DeleteAssignment({ assignmentId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const deleteAssignment = await axios.delete(
      `${process.env.Server_Url}/user/assignment/delete`,
      {
        params: {
          assignmentId: assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return deleteAssignment;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function UpdateAssignmentApi({
  assignmentId,
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
    const updatedAssignment = await axios.put(
      `${process.env.Server_Url}/user/assignment/update`,
      {
        title: title,
        deadline: dateFormat,
        description: description,
        maxScore: maxScoreNum,
      },
      {
        params: {
          assignmentId: assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return updatedAssignment;
  } catch (err) {
    throw new Error(err);
  }
}
