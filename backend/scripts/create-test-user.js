import { db } from '../database/firestore.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestUser() {
  try {
    // Get the UID from Firebase Authentication
    // Replace this with the actual UID from your Firebase Console
    const userEmail = 'test@policia.gov.co';

    console.log('Por favor, copia el UID del usuario de Firebase Console');
    console.log('Lo encontrarás en: Authentication > Users > click en el usuario');
    console.log('\nLuego ejecuta este script con el UID como parámetro:');
    console.log('node create-test-user.js <UID>');

    const uid = process.argv[2];

    if (!uid) {
      console.error('\n❌ Error: Debes proporcionar el UID del usuario');
      console.log('Uso: node create-test-user.js <UID>');
      process.exit(1);
    }

    const userProfile = {
      uid: uid,
      email: userEmail,
      displayName: 'Oficial de Prueba',
      rank: 'Patrullero',
      placa: 'TEST-001',
      plan: 'free',
      createdAt: new Date(),
      usage: {
        documentsThisMonth: 0,
        lastReset: new Date()
      }
    };

    await db.collection('users').doc(uid).set(userProfile);

    console.log('\n✅ Usuario creado exitosamente en Firestore!');
    console.log('Datos del usuario:', JSON.stringify(userProfile, null, 2));
    console.log('\nAhora puedes hacer login con:');
    console.log('Email: test@policia.gov.co');
    console.log('Contraseña: Test123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    process.exit(1);
  }
}

createTestUser();
