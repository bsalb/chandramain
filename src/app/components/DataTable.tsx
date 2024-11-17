"use client";
import React, { useState, useMemo, useCallback } from "react";
import { CurrencyData } from "@/lib/db";

interface Props {
  data: CurrencyData[];
}

const DataTable = ({ data }: Props) => {
  const calculateTotals = useCallback(
    (data: CurrencyData[]): CurrencyData[] => {
      return data.map((entry) => {
        let total = 0;
        entry.prices.forEach((price) => {
          price.total = price.amount * price.quantity;
          total += price.total;
        });
        entry.total = total;
        return entry;
      });
    },
    []
  );

  const [document, setDocument] = useState<CurrencyData[]>(
    calculateTotals(data)
  );

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  const filteredData = useMemo(
    () => data.filter((entry) => entry.date === selectedDate),
    [data, selectedDate]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div>
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

      {filteredData.length === 0 ? (
        <p className="">No record found...</p>
      ) : (
        filteredData.map((entry, index) => (
          <div key={index} className="mb-6">
            <table className="w-full table-auto text-md border-collapse border rounded-lg">
              <thead className="text-left bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">SN</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {entry.prices.map((price, priceIndex) => (
                  <tr key={`${index}-${priceIndex}`}>
                    <td className="border px-4 py-2">{priceIndex + 1}</td>
                    <td className="border px-4 py-2">{price.amount}</td>
                    <td className="border px-4 py-2">{price.quantity}</td>
                    <td className="border px-4 py-2">{price.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-200">
                <tr>
                  <td
                    colSpan={3}
                    className="border px-4 py-2 font-bold text-right"
                  >
                    Overall Total
                  </td>
                  <td className="border px-4 py-2 font-bold">{entry.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default DataTable;
