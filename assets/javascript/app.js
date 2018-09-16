//*********************************************************************************************/
// Set the Firebase project config
//*********************************************************************************************/
var config = {
    apiKey: "AIzaSyCJtxuAtYnkRNcJZZbJkeCgZASVVTW6GgU",
    authDomain: "homework7-traintime.firebaseapp.com",
    databaseURL: "https://homework7-traintime.firebaseio.com",
    projectId: "homework7-traintime",
    storageBucket: "homework7-traintime.appspot.com",
    messagingSenderId: "727195016883"
};
//*********************************************************************************************/
// Initialize the Firebase Database
//*********************************************************************************************/
firebase.initializeApp(config);
var database = firebase.database();


$(document).ready(function () {
    //*********************************************************************************************/
    // Leverage the timepicker libary to drive field input
    //*********************************************************************************************/
    $(function() {
        $('#TrainTimeField').timepicker({
            'timeFormat': 'H:i',
            'step': 5, 
            'minTime': '05:00',
            'maxTime': '00:00'
        });
    });
    
    //*********************************************************************************************/
    // Detect the submit button click
    //*********************************************************************************************/
    $("#SubmitButton").on("click", function (event) {
        event.preventDefault();

        //*********************************************************************************************/
        // Grab the values from the form
        //*********************************************************************************************/
        var trainName = $("#TrainNameField").val();
        var trainDest = $("#DestinationField").val();
        var trainTime = $("#TrainTimeField").val();
        var trainFreq = parseInt($("#FrequencyField").val());

        //*********************************************************************************************/
        // Push the record into the database
        //*********************************************************************************************/
        database.ref().push({
            trainName: trainName,
            trainDest: trainDest,
            trainTime: trainTime,
            trainFreq: trainFreq,
        });
        //*********************************************************************************************/
        // Clear the form fields
        //*********************************************************************************************/
        $("#TrainNameField").val("");
        $("#DestinationField").val("");
        $("#TrainTimeField").val("");
        $("#FrequencyField").val("");
    });


    database.ref().on("child_added", function (snapshot) {
        //*********************************************************************************************/
        // Get values from database and assign to display variables
        //*********************************************************************************************/
        var displayTrainName = snapshot.val().trainName;
        var displayTrainDest = snapshot.val().trainDest;
        var displayTrainTime = snapshot.val().trainTime;
        var displayTrainFreq = snapshot.val().trainFreq;

        //*********************************************************************************************/
        // Compute Train Timings
        //*********************************************************************************************/
        var firstTrainTime = moment(displayTrainTime, "HH:mm");
        var diffTime = moment().diff(moment(firstTrainTime), "minutes");
        var timeRemainder = diffTime % displayTrainFreq;
        var displayMinutesAway = parseInt(displayTrainFreq - timeRemainder);
        var arrivalTime = moment().add(displayMinutesAway, "minutes");
        var displayNextArrival = moment(arrivalTime).format("HH:mm");

        //*********************************************************************************************/
        // Build and append table row
        //*********************************************************************************************/
        var tableRow = $("<tr>").append(
            $("<td>").text(displayTrainName),
            $("<td>").text(displayTrainDest),
            // $("<td>").text(displayTrainTime),
            $("<td>").text(displayTrainFreq),
            $("<td>").text(displayNextArrival),
            $("<td>").text(displayMinutesAway),
        );
        $("#TrainTable > tbody").append(tableRow);
    });
});












