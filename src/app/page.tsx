"use client";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import DataTable from "./components/DataTable";
import ResultTable from "./components/Result";
import { getUser, logout } from "./actions/authAction";
import { useEffect, useState } from "react";
import { getUserOrAllCompanies } from "./actions/currencyActions";

export default function Home() {
  const router = useRouter();

  const [company, setCompany] = useState<string>("");

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success(result.message);
      router.push("/auth/login");
    }
  };

  const fetchUser = async () => {
    const user = await getUser();
    if (user) {
      const company = await getUserOrAllCompanies(user.id);
      setCompany(company[0].name);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="w-full h-full">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full flex  flex-col  gap-10 p-4">
        <div className="flex justify-between">
          <h1 className="font-bold text-3xl">{company}</h1>
          <button
            className="px-4 py-2 rounded-md border border-black hover:border-none hover:bg-purple-400 hover:text-white font-bold transition-all"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="w-full">
          <DataTable />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg">Sales Records</h1>
          <div className="w-full md:w-3/4">
            <ResultTable />
          </div>
        </div>
      </div>
    </div>
  );
}
