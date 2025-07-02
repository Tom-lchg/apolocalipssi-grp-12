/**
 * Configuration globale pour les tests
 */

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = "test";
process.env.HUGGINGFACE_API_KEY = "test-api-key";

// Augmentation du timeout pour les tests
jest.setTimeout(10000);
