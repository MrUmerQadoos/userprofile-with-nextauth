import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
const page = async () => {
  const session = await getServerSession(authOptions);
  return <div>Welcome to admin{session?.user.username}</div>;
};

export default page;
