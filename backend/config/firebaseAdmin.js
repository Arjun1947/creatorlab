import admin from "firebase-admin";

const initFirebaseAdmin = () => {
  if (admin.apps.length > 0) return admin;

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin;
};

export { initFirebaseAdmin };
