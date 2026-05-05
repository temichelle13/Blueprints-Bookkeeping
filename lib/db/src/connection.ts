import mongoose from "mongoose";

let connectPromise: Promise<void> | null = null;

export async function connectToDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (connectPromise) return connectPromise; // connection in progress

  const uri = process.env["MONGODB_URI"];
  if (!uri) throw new Error("MONGODB_URI must be set");

  connectPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10_000 })
    .then(() => {
      /* connected */
    })
    .catch((err) => {
      connectPromise = null;
      throw err;
    });

  return connectPromise;
}

export { mongoose };
