// setAdminClaim.js

const admin = require("firebase-admin");
const serviceAccount = require("C:\\Users\\Arla\\Documents\\GitHub\\hr-management-system\\src\\main\\java\\com\\example\\hrsystem\\config\\hrcloudx-3c6ee-firebase-adminsdk-fbsvc-6bcaca8df8.json"); // path to your key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "6kYt3NB3O5hoEm5lt0c6vhivKcz1"; // Replace with the user's UID

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Successfully set admin claim for user ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error setting custom claim:", error);
    process.exit(1);
  });
