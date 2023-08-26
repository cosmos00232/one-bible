import { getDatabase } from "firebase/database";
import app from "./app";

const database = getDatabase(app);
export default database;
