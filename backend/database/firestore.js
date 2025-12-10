import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// Option 1: Using service account JSON file (recommended for production)
// Uncomment and use this if you have a service account file:
/*
import { readFileSync } from 'fs';
const serviceAccount = JSON.parse(
  readFileSync('./firebase-adminsdk.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

// Option 2: Using environment variables (for development)
const initializeFirebase = async () => {
  try {
    if (!admin.apps.length) {
      // Check if we have a service account file
      try {
        // Try to use service account file if it exists
        const serviceAccount = await import('../firebase-adminsdk.json', {
          assert: { type: 'json' }
        });

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount.default)
        });
        console.log('✅ Firebase Admin inicializado con service account');
      } catch (fileError) {
        // Fallback to environment variables
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            })
          });
          console.log('✅ Firebase Admin inicializado con variables de entorno');
        } else {
          console.warn('⚠️  Firebase Admin no configurado. Verifica tus credenciales.');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error inicializando Firebase Admin:', error.message);
  }
};

// Initialize on module load
await initializeFirebase();

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
