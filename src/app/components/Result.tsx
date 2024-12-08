"use client";
import React, { useState, useEffect } from "react";
import { DailyCashRecord } from "@prisma/client";

import { PAGE_SIZE } from "@/constants";
import { formatDateToString } from "@/lib/formateDate";
import { getPaginatedData } from "../actions/currencyActions";
import { getUser } from "../actions/authAction";

const ResultTable = () => {
  const [data, setData] = useState<DailyCashRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = PAGE_SIZE;
  const totalPage = Math.ceil(totalCount / pageSize);

  const fetchPageData = async (page: number) => {
    const user = await getUser();
    const res = await getPaginatedData(user?.id, page);
    if (res) {
      setData(res.data);
      setTotalCount(res.totalCount);
    }
  };

  useEffect(() => {
    fetchPageData(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
    }
  };

  return (
    <div className="w-full">
      {data.length === 0 ? (
        <p className="text-center">No record found...</p>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <table className="w-full table-auto text-md border-collapse border rounded-lg">
            <thead className="text-left bg-gray-200">
              <tr>
                <th className="border px-4 py-2">SN</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {data.map((entry, index) => {
                const previousTotal = index > 0 ? data[index - 1].total : null;
                const growth =
                  previousTotal !== null
                    ? (
                        ((entry.total - previousTotal) / previousTotal) *
                        100
                      ).toFixed(2)
                    : null;

                return (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="border px-4 py-2">
                      {formatDateToString(entry.date)}
                    </td>
                    <td className="border px-4 py-2">{entry.total}</td>
                    <td className="border px-4 py-2">
                      {growth !== null ? (
                        <span
                          className={`font-bold ${
                            parseFloat(growth) >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {parseFloat(growth) >= 0 ? "+" : ""}
                          {growth}%
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200">
                <td
                  colSpan={2}
                  className="border px-4 py-2 font-bold text-right"
                >
                  Overall Total
                </td>
                <td className="border px-4 py-2 font-bold text-right">
                  {data.reduce((acc, item) => acc + item.total, 0)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="w-full flex-1 flex justify-between items-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded ${
                currentPage === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-blue-500 border-blue-500 hover:bg-blue-100"
              }`}
            >
              Previous
            </button>
            <span>
              Page: {currentPage} of {totalPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPage}
              className={`px-4 py-2 border rounded ${
                currentPage === totalPage
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-blue-500 border-blue-500 hover:bg-blue-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
