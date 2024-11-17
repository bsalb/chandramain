"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { saveData } from "../actions";

const CreateDataPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialPrices = [
    { amount: 5, quantity: 0, total: 0 },
    { amount: 10, quantity: 0, total: 0 },
    { amount: 50, quantity: 0, total: 0 },
    { amount: 100, quantity: 0, total: 0 },
    { amount: 500, quantity: 0, total: 0 },
    { amount: 1000, quantity: 0, total: 0 },
  ];

  const [prices, setPrices] = useState(initialPrices);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const handleQuantityChange = (index: number, value: number) => {
    const updatedPrices = [...prices];
    updatedPrices[index].quantity = value;
    updatedPrices[index].total = updatedPrices[index].amount * value;
    setPrices(updatedPrices);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    const updatedPrices = prices.map((price) => ({
      ...price,
      date: e.target.value,
    }));
    setPrices(updatedPrices);
  };

  const handleEntry = async () => {
    try {
      setLoading(true);
      const payload = {
        date: selectedDate,
        prices,
        total: prices.reduce((acc, price) => acc + price.total, 0),
      };
      await saveData(payload);
      alert("Data successfully saved.");
      router.push("/");
    } catch (error) {
      alert("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <span
        className="font-bold text-sm cursor-pointer  hover:underline"
        onClick={() => router.back()}
      >
        Back
      </span>
      <h2 className="text-xl font-semibold mb-4 mt-10">Create Entry</h2>
      <div className="w-1/2">
        <div className="mb-10">
          <label htmlFor="date" className="mr-4">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border px-2 py-1 text-black"
          />
        </div>

        <table className="w-full table-auto text-md border-collapse border border-gray-300 ">
          <thead className="text-left bg-gray-200 ">
            <tr>
              <th className="border px-4 py-2">SN</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {prices.map((price, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{price.amount}</td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    value={price.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                    className="border px-2 py-1 w-24 text-black"
                  />
                </td>
                <td className="border px-4 py-2">{price.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-200">
            <tr>
              <td colSpan={4} className="border px-4 py-2 font-bold text-right">
                Overall Total
              </td>
              <td className="border px-4 py-2 font-bold">
                {prices.reduce((acc, price) => acc + price.total, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="flex justify-end mt-5">
          <button
            className=" px-4 py-2 rounded-md border border-black hover:border-none hover:bg-purple-400 hover:text-white font-bold transition-all"
            onClick={handleEntry}
            disabled={loading}
          >
            {loading ? "loading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDataPage;
