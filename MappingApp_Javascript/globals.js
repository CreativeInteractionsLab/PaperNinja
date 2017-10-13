// User information
var dataID = "user1s1-mapping-app";
var userID = "1";
var groupID = "mapping-training";
var sessionNum = "1";

// Logging data
var fileLocation = "/sdcard/" + dataID + ".txt";
var string = dataID + "\nGroup" + groupID + "\n" + new Date() + "\n";
// NOTE: attempts = # of tries to get it right
// NOTE: ms = how long it took to get it right in miliseconds
string += "-------------------------------------------------------------------------------------------------------------\n";
string += "dataID, userID, group, date, sessionNumber, roundNum, action(to perform), actionOrder, time(ms), #OfGestures, gesturesPerformed, completedRound, roundCompletionTime(ms), totalPracticeTime(ms) \n";
string += "-------------------------------------------------------------------------------------------------------------\n";
var gesture = '';
var practiceTime = 0;
var roundNum = 0;
var totalGesturesPerformed = 0;
// Create a new file for the user
app.WriteFile(fileLocation, string);

// Global variables
var completedRound = 'n';
var holdTime = 0;
var frameRate = 80; // Miliseconds in between each frame of showing an animation
var animating = false; // The app will start off with no animation running
var moving = false; // The app will start off with no moving
var bending = false;
// NOTE: gestureFrameUp and Down must have the same number of indexes for app to run properly
var gestureFrameUp = [1, 2, 2, 1, 0]; // 0 is the normal frame
var gestureFrameDown = [1, 2, 2, 1, 0]; // Frames of down gestures
var gestureFrameIndex = 0;
var gestureFrameRate = 100; // Milliseconds in between each frame of showing a gesture
var gestureRepeatTime = 750; // Delay in ms of time between gesture repeats
var gesturesArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Array of the possible gestures
var gesturesPerformed = [];
var responseShowTime = 900; // Length of how long response is shown for in ms
var responseIsShown = false;
var readNextInput = true;
var gesturesIndex = 0;
var learnBendTime = 0;
var roundPracticeTime = 0;
var A = []; // Declare array for analog inputs
var flat_A = [500, 500, 500, 500, 500, 500, 500, 500]; // Declare the straight values of each bend sensor
var flatValue = 100;
var initializeFlatOnce = true;
var startClicked = false;
var readNextInputTimer = null;

// Set paper position and move speed
var paperWidth = 0.4; // Width of paper
var paperHeight = paperWidth * 800 / 480; // Height of paper (proportional to w
var paperMoveSpeed = 0.01; // Speed the paper moves when down bends are done
var paperX = 0.3;
var paperY = 0.2;

/* --- Global Functions --- */

// Shuffle the array of bend gestures to be randomly ordered
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // We will start shuffling from the top of the array and count down to first index/element
    while (0 !== currentIndex) {
        // Pick a random element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap the random element with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};
