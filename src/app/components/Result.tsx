"use client";
import React from "react";
import { CurrencyData } from "@/lib/db";

interface Props {
  data: CurrencyData[];
}

const ResultTable = ({ data }: Props) => {
  return (
    <div>
      {data.length === 0 ? (
        <p className="">No record found...</p>
      ) : (
        data.map((entry, index) => (
          <div key={index} className="mb-6">
            <table className="w-full table-auto text-md border-collapse border rounded-lg">
              <thead className="text-left bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">SN</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                <tr>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{entry.date}</td>
                  <td className="border px-4 py-2">{entry.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default ResultTable;
