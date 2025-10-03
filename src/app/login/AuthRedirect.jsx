"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";

export const AuthRedirect = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/protected");
    }
  }, [user, router]);
  return null;
};

export default AuthRedirect;
