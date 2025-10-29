/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import config from "@/config";

// A simple button to navigate to the dashboard
// Authentication is disabled for now - users can access the app directly
const ButtonSignin = ({
  text = "Get started",
  extraStyle,
}: {
  text?: string;
  extraStyle?: string;
}) => {
  return (
    <Link
      href={config.auth.callbackUrl}
      className={`btn ${extraStyle ? extraStyle : ""}`}
    >
      {text}
    </Link>
  );
};

export default ButtonSignin;
