import { initializeApp, cert } from 'firebase-admin/app';
// console.log(process.env.firestore_admin_creds);
// console.log("test");
// var app = initializeApp({credential: cert(process.env.firestore_admin_creds)});
// var firestore = getFirestore(app);

export async function getStandings(id){
    var testDoc = await firestore.doc('StandingTables/iZ9SkkAedWzd8hn9xPIp').get();
    testDoc = await testDoc.data();
    return testDoc;
}
