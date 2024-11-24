"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { CurrencyList } from "@/types";
import { formatDateToString } from "@/lib/formateDate";
import { getDataByDate } from "../actions/currencyActions";
import toast from "react-hot-toast";

const DataTable = () => {
  const [data, setData] = useState<CurrencyList>();
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateToString(new Date())
  );

  const fetchData = async (date: string) => {
    try {
      const data = await getDataByDate(date);
      if (data) {
        setData(data);
      }
    } catch (_) {
      toast.error("No data found...");
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="w-full border rounded-md px-3 py-2 shadow-md">
      <div className="mb-6">
        <label htmlFor="date" className="mr-4">
          Select Date:
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border px-2 py-1"
        />
      </div>

      {!data ? (
        <div className="flex gap-5 py-5">
          <p className="">No record found...</p>
          {selectedDate !== formatDateToString(new Date()) && (
            <Link href="/create">
              <span className=" border rounded-md px-4 py-2 font-bold hover:border-purple-600">
                Create entry
              </span>
            </Link>
          )}
        </div>
      ) : (
        <div className="mb-6 flex flex-col sm:flex-row gap-5">
          <table className="basis-[70%] w-full table-auto text-md border-collapse border rounded-lg">
            <thead className="text-left bg-gray-200">
              <tr>
                <th className="border px-4 py-2">SN</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {data.prices.map((price, priceIndex) => (
                <tr key={priceIndex}>
                  <td className="border px-4 py-2">{priceIndex + 1}</td>
                  <td className="border px-4 py-2">{price.amount}</td>
                  <td className="border px-4 py-2">{price.quantity}</td>
                  <td className="border px-4 py-2">{price.total}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gray-200">
                <td
                  colSpan={3}
                  className="border px-4 py-2 font-bold text-right"
                >
                  Overall Total
                </td>
                <td className="border px-4 py-2 font-bold text-right">
                  {data.total}
                </td>
              </tr>
            </tfoot>
          </table>
          <div>
            <table className="w-full table-auto text-md border-collapse border rounded-lg">
              <thead className="text-left bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">SN</th>
                  <th className="border px-4 py-2">Bank Deposit</th>
                  <th className="border px-4 py-2">QR/Fonepay</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                <tr>
                  <td className="border px-4 py-2">1</td>
                  <td className="border px-4 py-2">{data.bankDeposit}</td>
                  <td className="border px-4 py-2">{data.qrDeposit}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
