/**
 * Configuration globale pour les tests
 */

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = "test";
process.env.HUGGINGFACE_API_KEY = "test-api-key";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.SOME_OTHER_VAR = "valeur-de-test";

// Augmentation du timeout pour les tests
jest.setTimeout(10000);

// ==== MongoDB In-Memory ====
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});