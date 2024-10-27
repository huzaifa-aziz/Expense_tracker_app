// import React from "react";
// import { useState, useEffect, ChangeEvent } from "react";
// import {Button} from "./ui/button";
// import {Label} from "./ui/label";
// import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "./ui/dialog";
// import {Input} from "./ui/input";
// import { FilePenIcon, PlusIcon, TrashIcon } from "lucide-react";
// import {format} from "date-fns";

// type Expense =  {
//     id: number;
//     name: string;
//     amount: number;
//     date: Date;
// }

// const initialExpenses: Expense[] = [
//     {
//         id: 1,
//         name: "Groceries",
//         amount: 250,
//         date: new Date("19/10/2024")
//     },
//     {
//         id: 2,
//         name: "Rent",
//         amount: 1000,
//         date: new Date("19/10/2024")
//     },
//     {
//         id: 3,
//         name: "Utilities",
//         amount: 1500,
//         date: new Date("19/10/2024")
//     },
//     {
//         id: 4,
//         name: "Dinning out",
//         amount: 1200,
//         date: new Date("19/10/2024")

//     }
// ]


// const ExpenseTrackerPage = () => {


//     //states

//     const [expenses, setExpenses] = useState<Expense[]>([])
//     const [showModel, setShowModel] = useState<boolean>(false)
//     const [isEditting, setISedditing] = useState<boolean>(false)
//     const [currentExpensesId, setCurrentExpensesId] = useState<number | null>(null)
//     const [newExpense, setNewExpese] = useState<{name: string;amount: string; date: Date}>({name: "", amount: "",date: new Date()})


//     useEffect (() => {
//         const storedExpenses = localStorage.getItem("expenses");
//         if (storedExpenses) {
//             setExpenses(JSON.parse(storedExpenses).map((expense: Expense) => {
//                 ...expenses,
//                 date: new Date(expenses.da)
//             }))
//         }
//     },[])

//   return (
//     <div>expense-tracker</div>
//   )
// }

// export default ExpenseTrackerPage


"use client"; // Enables client-side rendering for this component

import React, { useState, useEffect, ChangeEvent } from "react"; // Import React hooks and types
import { Button } from "@/components/ui/button"; // Import custom Button component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Import custom Dialog components
import { Label } from "@/components/ui/label"; // Import custom Label component
import { Input } from "@/components/ui/input"; // Import custom Input component
import { FilePenIcon, PlusIcon, TrashIcon } from "lucide-react"; // Import icons from lucide-react
import { format } from "date-fns"; // Import date formatting utility

// Define the Expense type
type Expense = {
  id: number;
  name: string;
  amount: number;
  date: Date;
};

// Initial expenses to populate the tracker
const initialExpenses: Expense[] = [
  {
    id: 1,
    name: "Groceries",
    amount: 250,
    date: new Date("2024-05-15"),
  },
  {
    id: 2,
    name: "Rent",
    amount: 250,
    date: new Date("2024-06-01"),
  },
  {
    id: 3,
    name: "Utilities",
    amount: 250,
    date: new Date("2024-06-05"),
  },
  {
    id: 4,
    name: "Dining Out",
    amount: 250,
    date: new Date("2024-06-10"),
  },
];

export default function ExpenseTrackerComponent() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentExpenseId, setCurrentExpenseId] = useState<number | null>(null);
  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: string;
    date: Date;
  }>({
    name: "",
    amount: "",
    date: new Date(),
  });

  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(
        JSON.parse(storedExpenses).map((expense: Expense) => ({
          ...expense,
          date: new Date(expense.date),
        }))
      );
    } else {
      setExpenses(initialExpenses);
    }
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  const handleAddExpense = (): void => {
    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date),
      },
    ]);
    resetForm(); // Reset the input form
    setShowModal(false); // Close the modal
  };

  const handleEditExpense = (id: number): void => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    if (expenseToEdit) {
      setNewExpense({
        name: expenseToEdit.name,
        amount: expenseToEdit.amount.toString(),
        date: expenseToEdit.date,
      });
      setCurrentExpenseId(id);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handleSaveEditExpense = (): void => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === currentExpenseId
          ? { ...expense, ...newExpense, amount: parseFloat(newExpense.amount) }
          : expense
      )
    );
    resetForm(); // Reset the input form
    setShowModal(false); // Close the modal
  };

  const resetForm = (): void => {
    setNewExpense({
      name: "",
      amount: "",
      date: new Date(),
    });
    setIsEditing(false);
    setCurrentExpenseId(null);
  };

  const handleDeleteExpense = (id: number): void => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [id]:
        id === "amount"
          ? parseFloat(value)
          : id === "date"
          ? new Date(value)
          : value,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900">
      {/* Header section */}
      <header className="bg-indigo-600 text-white py-6 px-8 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Expense Tracker</h1>
          <div className="text-xl font-semibold">
            Total Expenses: <span className="font-bold">${totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      </header>

      {/* Main section */}
      <main className="flex-1 overflow-y-auto p-8 bg-white shadow-lg rounded-lg m-4">
        <ul className="space-y-6">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-md flex justify-between items-center hover:bg-gray-100 transition duration-200"
            >
              <div>
                <h3 className="text-lg font-semibold">{expense.name}</h3>
                <p className="text-gray-500">
                  ${expense.amount.toFixed(2)} -{" "}
                  <span className="font-semibold text-gray-700">
                    {format(expense.date, "MMMM dd, yyyy")}
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-blue-50 hover:bg-blue-100"
                  onClick={() => handleEditExpense(expense.id)}
                >
                  <FilePenIcon className="w-5 h-5 text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-red-50 hover:bg-red-100"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Floating add expense button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="icon"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl p-4"
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            resetForm();
          }}
        >
          <PlusIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Modal dialog for adding/editing expenses */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditing ? "Edit Expense" : "Add Expense"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Expense Name</Label>
              <Input
                id="name"
                value={newExpense.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newExpense.amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date.toISOString().slice(0, 10)}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={isEditing ? handleSaveEditExpense : handleAddExpense}
            >
              {isEditing ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
