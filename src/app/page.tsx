import { Toaster } from "react-hot-toast";

import DataTable from "./components/DataTable";
import ResultTable from "./components/Result";

export default async function Home() {
  return (
    <div className="w-full h-full">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full flex  flex-col  gap-10 p-4">
        <div className="w-full">
          <DataTable />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg">Sales Records</h1>
          <div className="w-1/2">
            <ResultTable />
          </div>
        </div>
      </div>
    </div>
  );
}
