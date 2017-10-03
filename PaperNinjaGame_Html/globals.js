/*----------------------------
This file contains all the variables used in the game, as well as the study
----------------------------*/

//User information
var dataID = "user2s1_game";
var userID = "2";
var groupID = " w/ training";
var sessionNum = "1";

var debugMode = false; // Used to debug the game physics
var showButtons = false; // False if we're using the bend sensors (bluetooth)

// Logging data
var fileLocation = "/sdcard/" + dataID + ".txt";
var string = dataID + "\nGroup" + groupID + "\n" + new Date() + "\n";
// NOTE: numOfBends = # of tries it took to get past the obstacle
// NOTE: ms = how long it took to get it right in miliseconds
string += "-------------------------------------------------------------------------------------------------------------\n";
string += "dataID, userID, group, date, sessionNumber, testName, roundNum, action(to perform), actionOrder, time(ms), #OfGestures, gesturesPerformed, completedLevel, levelCompletionTime(ms), totalPlayTime(ms) \n";
string += "-------------------------------------------------------------------------------------------------------------\n";
var testName;
var gesture = '';
var time = 0; // This is total playTime
var roundNum = 0;
var totalGesturesPerformed = 0;
// Create a new file for the user
app.WriteFile(fileLocation, string);

// Global Variables
var completedLevel = 'n';
var obstacle = '';
var gravity = 500;
var A = []; // Declare array for analog inputs
var obstacles = [1, 2, 3, 4, 5, 6, 7, 8]; // Each number represents an obstacle screen
var gesturesPerformed = [];
var obstacleIndex = 0;
var flat_A = [500, 500, 500, 500, 500, 500, 500, 500]; // Declare the straight values of each bend sensor
var buttonState = 0;
var obstacleTime = 0;
var levelPlayTime = 0;

// Groups
var platforms;
var breaking;
var bullets;

// Shooting paperAirplane bullets
var fireRate = 500; // lower = faster
var nextFire = 0;
var bullet;

// Props for map
var paperSprite, reset, bin;
var ground, wall;
var hBreak, vBreak;
var hLedge, vLedge;
var crumple1, crumple2, crumple3;

// Break states
var breakHitPoint = 0;
var waitForKick1 = true;
var waitForKick2 = true;
var vBreakHitPoint = 0;

// Paper states
var paperIsThin = false;
var paperIsFolded = false;
var paperIsCrumpled = false;

var hold1Once = true;
var hold2Once = true;

var paperIsMoving = false;
var paperIsBent = false;

var paperIsOnWall = false;
