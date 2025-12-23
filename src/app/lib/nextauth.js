import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { clientPromise } from "../../../lib/mongodb";

export default MongoDBAdapter(clientPromise);