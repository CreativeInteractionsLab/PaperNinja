/* --- ALL TIME FUNCTIONS --- */
// Get the amount of time (ms) since the last screen/obstacleTime
function getObstacleTime() {
    var currentObstacleTime = time - obstacleTime;
    obstacleTime = time;
    return currentObstacleTime;
}

// Get the amount of time (ms) spent on this level
function getLevelPlayTime() {
    var currentLevelPlayTime = time - levelPlayTime;
    levelPlayTime = time;
    return currentLevelPlayTime;
}
/* --- END OF TIME FUNCTIONS --- */

/* --- Global Functions --- */
// Record every bend input the user makes
function logInput(bend) {
    totalGesturesPerformed++; // Every time we log a bend input, increment the total number of inputs
    gesturesPerformed.push(bend);
}
// Record and store time and number of gesture inputs for this obstacle
function storeThisInfo(checkpoint) {
    switch (checkpoint) {
    case 0:
        obstacle = 'first screen';
        break;
    case 1:
        obstacle = 'jump';
        break;
    case 2:
        obstacle = 'thin';
        break;
    case 3:
        obstacle = 'fold';
        break;
    case 4:
        obstacle = 'crumple';
        break;
    case 5:
        obstacle = 'wallClimb';
        break;
    case 6:
        obstacle = 'kick';
        break;
    case 7:
        obstacle = 'shoot';
        break;
    case 8:
        obstacle = 'maze';
        break;
    case 9:
        obstacle = 'bin';
        break;
    }
    // Increment the order of the obstacles (starts at 0 so this makes it 1)
    obstacleIndex++; // first screen is always 1 and bin is always last

    string = dataID + "," + userID + "," + groupID + "," + new Date() + "," + sessionNum + "," + testName + "," + roundNum + "," + obstacle + "," + obstacleIndex + "," + getObstacleTime() + "," + gesturesPerformed.length + ",";
    for (var i = 0; i < gesturesPerformed.length; i++) {
        string += gesturesPerformed[i] + ";";
    }
    // If this is the last obstacle (the bin) then we mark the level as complete
    if (checkpoint == 9) {
        console.log("level completed");
        completedLevel = 'y';
        string += "," + completedLevel + "," + getLevelPlayTime() + "," + time + "\n";
        obstacleIndex = 0; // Reset the obstacle index to 0 for the next round/level
    } else
        string += ",-,-," + time + "\n";

    app.WriteFile(fileLocation, string, "Append");
    gesturesPerformed = []; // After we log this gesture's info, we reset the gesturesPerformed array to empty
}

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

// Initialize the straight values of each bend sensor
function initializeFlatValues() {
    for (var i = 0; i < 8; i++) {
        flat_A[i] = A[i];
    }
    console.log("flat values saved");
};
