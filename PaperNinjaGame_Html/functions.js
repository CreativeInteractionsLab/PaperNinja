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
// Called when bluetooth connects
function bt_OnConnect(ok) {
    
    if (ok) {
        console.log("BT Connection Successful");
    	app.ShowPopup( "BT Connected" );
    } else {
        console.log("BT ERROR!");
        app.ShowPopup( "BT Connection Error" );
        //bt.Connect("HC-05"); // Try to reconnect again
    }
};

// Called when we get data from bluetooth device (array of analogRead inputs from Arduino)
function bt_OnReceive(data) {
    A = data.split(",");
    //console.log("Received: " + A[0]+","+A[1]+","+A[2]+","+A[3]+","+A[4]);
    //console.log("Flat: " + flat_A[0]+","+flat_A[1]+","+flat_A[2]+","+flat_A[3]+","+flat_A[4]);

    // Send data to Phaser web control (sometimes BT is slow and not all values are received right away)
    if (A[0] === undefined || A[1] === undefined || A[2] === undefined || A[3] === undefined || A[4] === undefined
        || A[0] === "" || A[1] === "" || A[2] === "" || A[3] === "" || A[4] === "")  {//if all elements have some value
        console.log("Incompete values, skip");
        return;
    } else {
        //web.Execute("updateBend(" + A[0] + "," + A[1] + "," + A[2] + "," + A[3] + "," + A[4] + ")");
        updateBend(A[0], A[1], A[2], A[3], A[4]);
        //console.log("Use above");
    }

};

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
    } else {
        string += ",-,-," + time + "\n";
    }

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

// Populate the array (and the buttonState variable) whenever it receives the sensor values via bluetooth
function updateBend(A0, A1, A2, A3, btnState) {
    console.log("updateBend: " + A0 + "," + A1 + "," + A2 + "," + A3 + "," + btnState);
    A[0] = parseInt(A0);
    A[1] = parseInt(A1);
    A[2] = parseInt(A2);
    A[3] = parseInt(A3);
    buttonState = parseInt(btnState);
};

// Initialize the straight values of each bend sensor
function initializeFlatValues() {
    for (var i = 0; i < A.length; i++) {
        flat_A[i] = A[i];
    }
    console.log("flat values updated");
};
