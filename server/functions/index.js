const functions = require("firebase-functions");

const server = require("./server");
const PORT = 4000;

server.listen({ port: PORT }, () => {
  //   console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.app = functions.https.onRequest(server);
