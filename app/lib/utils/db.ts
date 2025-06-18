import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

// Расширяем глобальный тип для mongoose
declare global {
    var _mongoose: {
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose> | null
    }
}

let cached = global._mongoose

if (!cached) {
    cached = global._mongoose = {conn: null, promise: null}
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI!)
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB
