const functions = require("firebase-functions");
const {WebhookClient} = require("dialogflow-fulfillment");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Handle library information intent.
 * @param {WebhookClient} agent - The agent object from Dialogflow.
 * @return {Promise<void>}
 */
async function handleLibraryInfo(agent) {
  const prn = Number(agent.parameters.PRN); // Get PRN parameter from user input
  const libraryRef = admin.database().ref("library");

  try {
    const snapshot = await libraryRef
        .orderByChild("prn")
        .equalTo(prn)
        .once("value");
    const books = snapshot.val();

    if (!books) {
      let fallback = `We did not find PRN ${prn} in our systems make sure `;
      fallback += `you entered the correct details and if the issue still `;
      fallback += `persists, kindly contact the college library. Thank You`;
      agent.add(fallback);
      return;
    }

    let formattedResponse = `Details for books issued to PRN ${prn}:\n\n`;

    Object.keys(books).forEach((bookId) => {
      const book = books[bookId];
      formattedResponse += `Book Name: ${book.bookname}\n`;
      formattedResponse += `Author: ${book.author}\n`;
      formattedResponse += `Issued Date: ${book.issued_date}\n`;
      formattedResponse += `Due Date: ${book.due_date}\n`;
      formattedResponse += `Branch: ${book.branch}\n\n`;
    });

    formattedResponse += "NOTE: If overdue, a ₹1/day fine is imposed ";
    formattedResponse += "on the student until return.";
    agent.add(formattedResponse);
  } catch (error) {
    console.error("Error fetching library information:", error);
    agent.add("Oops! Something went wrong while fetching library information.");
  }
}

const dialogflowFirebaseFulfillment = functions.https.onRequest(
    async (request, response) => {
      const agent = new WebhookClient({request, response});

      const intentMap = new Map();
      intentMap.set("library - check", handleLibraryInfo);

      agent.handleRequest(intentMap);
    },
);

module.exports = {
  dialogflowFirebaseFulfillment,
};
