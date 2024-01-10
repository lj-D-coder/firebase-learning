import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();


export const getBostonAreaWeather =
functions.https.onRequest((request, response) =>{
  admin.firestore().doc("/areas/greater-boston").get()
    .then((areaSnapshot) =>{
      const cities =areaSnapshot.data()!.cities;
      const promises = [];
      for (const city in cities) {
        const p = admin.firestore().doc(`cities-weather/${city}`).get();
        promises.push(p);
      }
      return Promise.all(promises);
    })
    .then((citySnapshots) => {
      const results: Record<string, unknown>[] = [];

      citySnapshots.forEach((citySnap) => {
        const data = citySnap.data();
        if (data) {
          data.city = citySnap.id;
          results.push(data);
        }
      });

      response.send(results);
    })
    .catch((error) => {
    // Handle errors here
      console.error(error);
      response.status(500).send("Internal Server Error");
    });
});


export const getBostonWeather = functions.https.onRequest((request, response)=>{
  admin.firestore().doc("cities-weather/boston-ma-us").get()
    .then((snapshot) => {
      const data = snapshot.data();
      response.send(data);
    })
    .catch((error)=>{
      console.log(error);
      response.status(500).send(error);
    });
});
