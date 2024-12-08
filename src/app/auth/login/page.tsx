"use client";
import { loginAction } from "@/app/actions/authAction";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAction({ username, password });
      router.push("/");
    } catch {
      toast.error("Login failed. Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 py-5 px-4 border-2 border-purple-300 rounded-md shadow-lg">
        <h1 className="font-bold text-xl">Login to your account</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-bold text-md">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-purple-600 rounded-md p-2 min-w-[250px] shadow-md"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-bold text-md">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-purple-600 rounded-md p-2 min-w-[250px] shadow-md"
            />
          </div>
          <div className="flex justify-end mt-5">
            <button
              type="submit"
              className="px-4 py-2 rounded-md shadow-lg border border-black hover:border-none hover:bg-purple-400 hover:text-white font-bold transition-all"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
