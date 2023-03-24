import React from "react";
import Layout from "../../layouts/classroomLayout";

function Unauthorized({ user }) {
  return (
    <Layout user={user}>
      <div
        className={`w-full h-screen mt-10 md:mt-0  flex flex-col items-center md:justify-center
bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover `}
      >
        <div className="text-xl md:text-3xl font-Kanit">
          กรุณาเข้าสู่ระบบก่อน
        </div>
      </div>
    </Layout>
  );
}

export default Unauthorized;
