import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();


export const getBostonAreaWeather =
functions.https.onRequest(async(request, response) =>{
  try {
    const areaSnapshot = await admin.firestore().doc("/areas/greater-boston").get();
    const cities =areaSnapshot.data()!.cities;
    const promises = [];
    for (const city in cities) {
      const p = admin.firestore().doc(`cities-weather/${city}`).get();
      promises.push(p); 
      }
      const snapshot = await Promise.all(promises);
      const results: { [key: string]: any; }[] = [];

      snapshot.forEach((snap) => {
        const data = snap.data();
        if (data) {
          data.city = snap.id;
          results.push(data);
        }
      });
      response.send(results);
    }

   catch (error) {
    console.error(error);
      response.status(500).send("Internal Server Error");
  }
});



export const getBostonWeather = functions.https.onRequest(async (request, response)=>{
  try {
    const snapshot = await admin.firestore().doc("cities-weather/boston-ma-us").get();
    const data =snapshot.data();
    response.send(data);
  } catch (error) {
    console.log(error);
      response.status(500).send(error);
  }
});
