import { connect } from "mongoose";
import { DB_URI } from "~/constants";

async function dbConnect(): Promise<void> {
  await connect(DB_URI);
}

export default dbConnect;