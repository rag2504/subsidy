import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

// In-memory fallback for development
const inMemoryDb: Record<string, any[]> = {
  users: [],
  programs: [],
  projects: [],
  milestones: [],
  events: [],
};

// Simple in-memory collection implementation
class InMemoryCollection<T = any> {
  private data: T[] = [];

  constructor(name: string) {
    this.data = inMemoryDb[name] || [];
    inMemoryDb[name] = this.data;
  }

  async find(filter: any = {}) {
    return {
      project: () => this,
      toArray: async () => {
        // Simple filter implementation
        if (Object.keys(filter).length === 0) {
          return this.data;
        }
        return this.data.filter(item => {
          return Object.entries(filter).every(([key, value]) => 
            (item as any)[key] === value
          );
        });
      }
    };
  }

  async findOne(filter: any = {}) {
    const results = await this.find(filter).toArray();
    return results[0] || null;
  }

  async insertOne(doc: T) {
    const newDoc = { ...doc, _id: Date.now().toString() };
    this.data.push(newDoc);
    return { insertedId: newDoc._id };
  }

  async updateOne(filter: any, update: any) {
    const index = this.data.findIndex(item => {
      return Object.entries(filter).every(([key, value]) => 
        (item as any)[key] === value
      );
    });
    
    if (index !== -1) {
      if (update.$set) {
        this.data[index] = { ...this.data[index], ...update.$set };
      }
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }
}

export async function getDb(): Promise<Db> {
  if (db) return db;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI not set, using in-memory database for development");
    // Return a mock DB object
    return {
      collection: (name: string) => new InMemoryCollection(name) as any,
    } as any;
  }
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    // Use database from URI path or default to 'Hack'
    const url = new URL(uri);
    const pathname = url.pathname?.replace(/^\//, "");
    db = client.db(pathname || "Hack");
    return db;
  } catch (error) {
    console.warn("Failed to connect to MongoDB, using in-memory database:", error);
    return {
      collection: (name: string) => new InMemoryCollection(name) as any,
    } as any;
  }
}

export async function getCollection<T = any>(
  name: string,
): Promise<Collection<T>> {
  const database = await getDb();
  return database.collection<T>(name);
}
