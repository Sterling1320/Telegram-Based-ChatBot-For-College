const functions = require("firebase-functions");
const {WebhookClient} = require("dialogflow-fulfillment");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Handle faculty information for CSE intent.
 * @param {WebhookClient} agent - The agent object from Dialogflow.
 * @return {Promise<void>}
 */
async function handleFacultyInfoCSE(agent) {
  const cseRef = admin.database().ref("cse");

  try {
    const snapshot = await cseRef.once("value");
    const facultyMembers = snapshot.val();

    if (!facultyMembers) {
      agent.add("No faculty information found for CSE.");
      return;
    }

    let formattedResponse =
      "Here you go....the list of faculty members in CSE:\n\n";

    Object.keys(facultyMembers).forEach((facultyId) => {
      const faculty = facultyMembers[facultyId];
      formattedResponse += `Professor: ${faculty.prof_name}\n`;
      formattedResponse += `Designation: ${faculty.designation}\n`;
      formattedResponse += `Contact: ${faculty.contact_number}\n\n`;
    });

    agent.add(formattedResponse);
  } catch (error) {
    console.error("Error fetching faculty information for CSE:", error);
    agent.add("Oops! Something went wrong while fetching information.");
  }
}

const dialogflowFirebaseFulfillmentCSE = functions.https.onRequest(
    async (request, response) => {
      const agent = new WebhookClient({request, response});

      const intentMap = new Map();
      intentMap.set("Faculty Information - CSE", handleFacultyInfoCSE);

      agent.handleRequest(intentMap);
    });

module.exports = {
  dialogflowFirebaseFulfillmentCSE,
};
