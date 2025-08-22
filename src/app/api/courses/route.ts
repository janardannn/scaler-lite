import { NextResponse } from "next/server";

// dummy export to pass build
export async function GET() {
    return NextResponse.json({ message: "Hello - GET" }, { status: 200 });
}