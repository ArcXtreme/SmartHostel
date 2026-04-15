const mongoose = require("mongoose");

async function dropIndexIfExists(collection, indexName) {
  try {
    const indexes = await collection.indexes();
    const exists = indexes.some((idx) => idx.name === indexName);
    if (exists) {
      await collection.dropIndex(indexName);
      console.log(`Dropped index ${collection.collectionName}.${indexName}`);
    }
  } catch (e) {
    // Ignore when collection doesn't exist yet or index missing
  }
}

async function connectDB(mongoUri) {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    // Migration: older versions enforced unique (hostelName, roomNumber) for students.
    // Requirement: allow multiple students to share same room number.
    await dropIndexIfExists(mongoose.connection.collection("users"), "hostelName_1_roomNumber_1");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;

