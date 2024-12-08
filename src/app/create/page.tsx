"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { saveDataToCompany } from "../actions/currencyActions";
import { CustomInput } from "../components/CustomInput";
import { getUser } from "../actions/authAction";

const CreateDataPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bankDeposit, setBankDeposit] = useState("0");
  const [qrDeposit, setQRdeposit] = useState("0");

  const initialPrices = [
    { amount: 5, quantity: "0", total: 0 },
    { amount: 10, quantity: "0", total: 0 },
    { amount: 50, quantity: "0", total: 0 },
    { amount: 100, quantity: "0", total: 0 },
    { amount: 500, quantity: "0", total: 0 },
    { amount: 1000, quantity: "0", total: 0 },
  ];

  const [prices, setPrices] = useState(initialPrices);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const handleQuantityChange = (index: number, value: string) => {
    const updatedPrices = [...prices];
    updatedPrices[index].quantity = value;
    updatedPrices[index].total =
      updatedPrices[index].amount * (parseInt(value, 10) || 0);
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

  const calculateOverallTotal = () => {
    return prices.reduce((acc, price) => acc + price.total, 0);
  };

  const handleEntry = async () => {
    try {
      setLoading(true);
      const user = await getUser();

      const payload = {
        date: selectedDate,
        prices: prices.map((price) => ({
          ...price,
          quantity: parseInt(price.quantity, 10),
        })),
        bankDeposit: parseInt(bankDeposit, 10),
        qrDeposit: parseInt(qrDeposit, 10),
        total: calculateOverallTotal(),
        userId: user?.id,
      };
      await saveDataToCompany(payload);
      toast.success("Data successfully saved.");
      router.push("/");
    } catch {
      toast.error("Failed to save data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <span
        className="font-bold text-sm cursor-pointer hover:underline"
        onClick={() => router.back()}
      >
        Back
      </span>
      <h2 className="text-xl font-semibold mb-4 mt-10">Create Entry</h2>
      <div className="w-full">
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

        <div className="flex flex-col gap-5">
          <table className="w-full table-auto text-md border-collapse border border-gray-300">
            <thead className="text-left bg-gray-200">
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
                    <CustomInput
                      value={price.quantity}
                      onChange={(value) => handleQuantityChange(index, value)}
                      className="border px-2 py-1 w-24 text-black"
                    />
                  </td>
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
                  {calculateOverallTotal()}
                </td>
              </tr>
            </tfoot>
          </table>
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
                <td className="border px-4 py-2">
                  {" "}
                  <CustomInput
                    value={bankDeposit}
                    onChange={setBankDeposit}
                    className="border px-2 py-1 w-24 text-black"
                  />
                </td>
                <td className="border px-4 py-2">
                  {" "}
                  <CustomInput
                    value={qrDeposit}
                    onChange={setQRdeposit}
                    className="border px-2 py-1 w-24 text-black"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="px-4 py-2 rounded-md border border-black hover:border-none hover:bg-purple-400 hover:text-white font-bold transition-all"
            onClick={handleEntry}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDataPage;
