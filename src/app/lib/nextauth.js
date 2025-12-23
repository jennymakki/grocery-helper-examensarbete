import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { clientPromise } from "./mongodb";

export default MongoDBAdapter(clientPromise);