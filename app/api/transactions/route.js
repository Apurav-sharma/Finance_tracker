import dbConnect from "../../../database/connect";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
}

export async function POST(req) {
    await dbConnect();
    const data = await req.json();
    console.log(data);
    try {
        const newTransaction = await Transaction.create(data);
        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req) {
    await dbConnect();
    const { id } = await req.json();
    try {
        await Transaction.findByIdAndDelete(id);
        return NextResponse.json({ message: "Transaction deleted" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
