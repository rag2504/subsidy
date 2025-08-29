import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  client = new MongoClient(uri);
  await client.connect();
  // Use database from URI path or default to 'Hack'
  const url = new URL(uri);
  const pathname = url.pathname?.replace(/^\//, "");
  db = client.db(pathname || "Hack");
  return db;
}

export async function getCollection<T = any>(name: string): Promise<Collection<T>> {
  const database = await getDb();
  return database.collection<T>(name);
}
