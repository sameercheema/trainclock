   // Initialize Firebase
 

   // Initialize Firebase
   var config = {
     apiKey: "AIzaSyBvgvGbnsuWEmr9PEBKov3xjyU_0QK3R7A",
     authDomain: "trainclock-d8120.firebaseapp.com",
     databaseURL: "https://trainclock-d8120.firebaseio.com",
     projectId: "trainclock-d8120",
     storageBucket: "trainclock-d8120.appspot.com",
     messagingSenderId: "16779548839"
   };
   firebase.initializeApp(config);


  
  // This references database
  var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // gets values from input form
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = moment($("#first-input").val().trim(), "hh:mm").format("X");
  var frequency = $("#frequency-input").val().trim();

  // creates the local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // uploads the train data to the database 
  database.ref().push(newTrain);

  // Logs  to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // This clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#frequency-input").val("");
});

// This creates a Firebase event for adding train to the database and a row in the html when a user adds new entries
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Variables
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

  // console log the train info
  console.log(trainName);
  console.log(destination);
  console.log(firstTrain);
  console.log(frequency);

// time/math info
//-----------------------------------------

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
console.log(firstTrainConverted);

// var current time + the call moment library
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// this is the difference between current time and the first train
var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// time apart = remainder)
var tRemainder = diffTime % frequency;
console.log(tRemainder);

// minutes until train
var tMinutesTillTrain = frequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// next train var/moment/console.log
var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
console.log(nextTrain);

  // this adds train data to the table
  $("#train-table > tbody").append(
    "<tr><td>" + trainName + 
    "</td><td>" + destination + 
    "</td><td>" + frequency + 
    "</td><td>" + nextTrain + 
    "</td><td>" + tMinutesTillTrain + "</td></tr>");
}); 
