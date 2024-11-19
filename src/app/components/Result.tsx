"use client";
import React from "react";
import { CurrencyList } from "@prisma/client";
import { formatDateToString } from "@/lib/formateDate";

interface Props {
  data: CurrencyList[];
}

const ResultTable = ({ data }: Props) => {
  return (
    <div>
      {data.length === 0 ? (
        <p className="text-center">No record found...</p>
      ) : (
        <table className="w-full table-auto text-md border-collapse border rounded-lg">
          <thead className="text-left bg-gray-200">
            <tr>
              <th className="border px-4 py-2">SN</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {data.map((entry, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {formatDateToString(entry.date)}
                </td>
                <td className="border px-4 py-2">{entry.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultTable;
