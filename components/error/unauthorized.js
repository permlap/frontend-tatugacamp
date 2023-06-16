import React from "react";
import Layout from "../../layouts/classroomLayout";
import Head from "next/head";

function Unauthorized({ user }) {
  return (
    <Layout user={user}>
      <Head>
        <title>Login first</title>
      </Head>
      <div
        className={`w-screen h-screen flex  items-center justify-center
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
