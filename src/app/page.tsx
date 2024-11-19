import Link from "next/link";

import { getAllData } from "./actions/currencyActions";
import DataTable from "./components/DataTable";
import ResultTable from "./components/Result";
import { formatDateToString } from "@/lib/formateDate";

export default async function Home() {
  const data = await getAllData();

  const todayData = data.some(
    (item) =>
      formatDateToString(item.date) === new Date().toISOString().split("T")[0]
  );

  return (
    <div className="w-full h-full">
      <div className="w-full flex  flex-col  gap-3 p-4">
        {!todayData && (
          <Link href="/create">
            <span className=" border rounded-md px-4 py-2 font-bold hover:border-purple-600">
              Create entry
            </span>
          </Link>
        )}
        <div className="w-1/2">
          <DataTable data={data} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg">Sales Records</h1>
          <div className="w-1/2">
            <ResultTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
