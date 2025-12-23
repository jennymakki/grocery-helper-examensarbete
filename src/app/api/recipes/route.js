import { connectToDatabase } from "../../lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    return new Response(
      JSON.stringify({ status: "ok", message: "MongoDB connected!" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    );
  }
}