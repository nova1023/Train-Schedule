// Initialize Firebase
var config = {
    apiKey: "AIzaSyAqHvE9n_0T0ng-Gw0DJBzCEbX0BxIZqwc",
    authDomain: "train-schedule-bc267.firebaseapp.com",
    databaseURL: "https://train-schedule-bc267.firebaseio.com",
    storageBucket: "train-schedule-bc267.appspot.com",
    messagingSenderId: "799557379138"
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("child_added", function(snap){
	var name = snap.val().name;
	var destination = snap.val().destination;
	var firstTrain = snap.val().firstTrain;
	var frequency = snap.val().frequency;
	var min = snap.val().min;
	var next = snap.val().next;

	$("#mainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

//user input is added to the table
$("#userInput").on("submit", function(event){
  event.preventDefault();
  event.stopPropagation();
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = $("#firstTrain").val().trim();
  var frequency = $("#frequency").val().trim();

  // Check to make sure all inputs been added
  if ( trainName == ""){
    alert("Enter a train name!")
    return false;
  }
  if ( destination == ""){
    alert("Enter a destination!")
    return false;
  }
  if ( firstTrain == ""){
    alert("Enter a first train time!")
    return false;
  }
  if ( frequency == ""){
    alert("Enter a frequency!")
    return false;
  }

// Subtracts first train time back a year to make sure it's before the current time
var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
var currentTime = moment();
// console.log("Current Time: " + moment(currentTime).format("hh:mm"));

// Time difference between current time and first train time
var timeDifference = currentTime.diff(moment(firstTrainConverted), "minutes");
// console.log("Difference: " + timeDifference);
var remainder = timeDifference % frequency;
// console.log(remainder);
var minutesUntilTrain = frequency - remainder;
// console.log("Minutes until next train: " + minutesUntilTrain);
var nextTrain = moment().add(minutesUntilTrain , "minutes").format("hh:mm:a");
// console.log("Next train: " + nextTrain);

var newTrain = {
	name: trainName,
	destination: destination,
	firstTrain : firstTrain,
	frequency : frequency,
	min: minutesUntilTrain,
	next: nextTrain
}

console.log(newTrain);
	database.ref().push(newTrain);
	$("#trainName").val("");
	$("#destination").val("");
	$("#firstTrain").val("");
	$("#frequency").val("");

	return false;

});
