import * as firebaseFunctionsTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const test = firebaseFunctionsTest({
  projectId: 'newssentimentanalyzer',
  databaseURL: 'http://localhost:8080'
});

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
admin.initializeApp({
  projectId: 'newssentimentanalyzer',
});

export { test, admin };
