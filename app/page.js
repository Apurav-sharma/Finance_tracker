"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useForm } from "react-hook-form";
import Bchart from "./components/charts/barchart";
import Pchart from "./components/charts/piechart";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"];
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#BA68C8", "#FF9800"];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await axios.get("/api/transactions");
    setTransactions(data);
  };

  const onSubmit = async (data) => {
    const transaction = {
      category: data.category,
      amount: parseFloat(data.amount),
      date: new Date(data.date).toISOString(),
      description: data.description,
    };
    console.log(transaction);
    await axios.post("/api/transactions", transaction);
    fetchTransactions();
    reset();
  };

  const deleteTransaction = async (id) => {
    await axios.delete(`/api/transactions`, { data: { id } });
    fetchTransactions();
  };

  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const categoryData = CATEGORIES.map((category, index) => ({
    name: category,
    value: transactions.filter((tx) => tx.category === category).reduce((sum, tx) => sum + tx.amount, 0),
    color: COLORS[index],
  })).filter((item) => item.value > 0);


  const monthlyCategoryData = months.map(item => {
    const m = item;
    const obj = transactions.reduce((sum, tx) => {
      var month = new Date(tx.date).getMonth();
      const monthName = months[month];
      if (!sum[tx.category]) {
        sum[tx.category] = 0;
      }

      if (monthName === m) {
        sum[tx.category] += tx.amount;
      }

      return sum;
    }, {})

    return { month: m, categories: obj };
  });

  // console.log(monthlyCategoryData);


  const monthlyExpenses = transactions.reduce((acc, tx) => {
    const month = new Date(tx.date).getMonth();
    let month2 = months[month];
    acc[month2] = (acc[month2] || 0) + tx.amount;
    return acc;
  }, {});

  console.log(transactions);
  // console.log(monthlyExpenses);

  const barChartData = Object.keys(monthlyExpenses).map((month) => ({
    month,
    amount: monthlyExpenses[month],
  }));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Tracker</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-blue-500 text-white rounded-lg">
          <h2 className="text-lg">Total Expenses</h2>
          <p className="text-xl font-bold">${totalExpenses}</p>
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg">
          <h2 className="text-lg">Transactions</h2>
          <p className="text-xl font-bold">{transactions.length}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Input type="number" placeholder="Amount" {...register("amount", { required: true })} />
        <Input type="date" {...register("date", { required: true })} />
        <Input placeholder="Description" {...register("description", { required: true })} />
        <select {...register("category", { required: true })} className="border rounded p-2 w-full">
          <option value="">Select Category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <Button type="submit">Add Transaction</Button>
      </form>

      {/* Transaction List */}
      <ul className="mt-4 space-y-2">
        {transactions.map((tx) => (
          <li key={tx._id} className="flex justify-between p-2 bg-gray-100 rounded">
            <span>
              {tx.description} - ${tx.amount} ({tx.category})
            </span>
            <Button variant="destructive" onClick={() => deleteTransaction(tx._id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">Monthly Expenses</h2>
      <Bchart barChartData={barChartData} />

      <h2 className="text-xl font-bold mt-6">Category-wise Expenses</h2>
      <Pchart categoryData={categoryData} />
    </div>
  );
}
