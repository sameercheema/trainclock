    
// initialize Firebase 
 var config = {
    apiKey: "AIzaSyB3a-ngcH-ifMaaHCJoRAR2l5j5ZMnfsg8",
    authDomain: "train-scheduler-dedca.firebaseapp.com",
    databaseURL: "https://train-scheduler-dedca.firebaseio.com",
    projectId: "train-scheduler-dedca",
    storageBucket: "train-scheduler-dedca.appspot.com",
    messagingSenderId: "916429112960"
  };
  firebase.initializeApp(config);

// Database
var database = firebase.database();

// FIREBASE WATCHER + INITIAL LOADER - updates or snapshot everytime a child is added to database
database.ref().on("child_added", function(childSnapshot){

  // creates the row in the table with the values from the firebase database
    var row = $("<tr>");
    row.html("<td>" + childSnapshot.val().name + "</td>" + "<td>" + childSnapshot.val().city+ "</td><td>" + childSnapshot.val().rate + "</td><td>" + childSnapshot.val().arrival + "</td><td>" + childSnapshot.val().minutes + "</td>" + "<td>" + "<button class='remove btn btn-default'>Remove</button>" + "</td>" 
        );
    $("#table").append(row);
});


$("#submit-train").on("click", function(){
   
   event.preventDefault();

    var trainName = $("#name").val().trim();
    var destination =$("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var tFrequency = $("#frequency").val().trim();
    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years").toString();
     console.log(firstTimeConverted);
    
    // // current time
    var currentTime = moment().format();

    // Depreciation warning from Moment happening HERE (not sure how to fix):
    // Difference between the times
    var diffTime = moment().diff(firstTimeConverted, "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

      // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");

    // Pushing values to the firebase database
    database.ref().push({
      name: trainName,
      city: destination,
      rate: tFrequency,
      arrival: nextTrain,
      minutes: tMinutesTillTrain
   
});


    // after submit set the value of each input field to an empty string
   
   $("#name").val(" ");
    $("#destination").val(" ");
    $("#first-train").val(" ");
    $("#frequency").val(" ");

 });


   
  $(document.body).on("click", ".remove", function() {

    // get constant trId / database ID
    var buttonGradparentId = $(this).parent().parent().attr("id");

    // remove from database
    var removeRef = database.ref(buttonGradparentId);
    removeRef.remove();


    // remove from HTML
    $(this).parent().parent().remove();
    
  });


