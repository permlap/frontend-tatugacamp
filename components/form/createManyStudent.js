import { useRouter } from "next/router";
import React, { useState } from "react";
import { CreateStudentApi } from "../../service/students";
import { v4 as uuidv4 } from "uuid";

function ExcelTable({ getExcelData, students }) {
  const [excelData, setExcelData] = useState("");
  const [tableData, setTableData] = useState([]);
  const router = useRouter();
  const handleExcelDataChange = (e) => {
    setExcelData(e.target.value);
  };

  const handleCreateMany = async (e) => {
    for (const student of tableData) {
      try {
        const createStudent = await CreateStudentApi({
          firstName: student.firstName,
          lastName: student.lastName,
          number: student.number,
          classroomId: router.query.classroomId,
        });
        students.refetch();
        console.log("Created student:", createStudent);
      } catch (err) {
        getExcelData((prevTableData) => {
          return prevTableData.map((prevStudent) => {
            if (prevStudent.id === student.id) {
              return {
                ...prevStudent,
                error: err?.props?.response?.data?.message.toString(),
              };
            }
            return prevStudent;
          });
        });
        console.error("Error creating student:", err);
      }
    }
  };
  console.log(tableData);
  const generateTable = () => {
    const rows = excelData.split("\n");
    const table = [];

    const arrayOfObjects = rows.map((item) => {
      const [number, firstName, lastName] = item.split("\t");
      const uniqueId = uuidv4();
      return { id: uniqueId, number, firstName, lastName };
    });

    getExcelData(arrayOfObjects);
    setTableData(arrayOfObjects);
  };

  return (
    <div className="container mx-auto my-4">
      <div className="mb-4">
        <label htmlFor="excel_data" className="block font-bold mb-2">
          คัดลอคข้อมูลจาก Excel ลงที่นี่
        </label>
        <textarea
          id="excel_data"
          name="excel_data"
          className="w-96 h-96 p-2 border border-gray-300 rounded-md"
          value={excelData}
          onChange={handleExcelDataChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={generateTable}
        >
          Load students
        </button>
        <button
          onClick={handleCreateMany}
          className="bg-red-500 hover:bg-red-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
        >
          Create students
        </button>
      </div>
    </div>
  );
}

export default ExcelTable;
