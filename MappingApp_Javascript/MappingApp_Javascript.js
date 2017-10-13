// App variables
var debugMode = false; // Switch off debugging (false) for max performance
var showButtons = false; // False if we're using the bend sensors (bluetooth)
var addOKbuttonOnce = true;
var showUseForText = true;

// Called when application is started
function OnStart() {
    app.EnableBackKey(false); // disable phone's back button
    app.SetOrientation("Landscape"); // Lock screen orientation to Landscape
    app.PreventScreenLock(true); // Stop screen turning off while playing
    app.SetScreenMode("Full"); // Hide the status bar (fullscreen mode)
    app.SetDebugEnabled(debugMode); // true or false

    // Create the main app layout
    layout = app.CreateLayout("Absolute", "FillXY");

    // Loading text
    loading = app.CreateText("Loading...");
    loading.SetPosition(0.35, 0.4);
    loading.SetTextSize(40);
    layout.AddChild(loading);

    // Load scripts
    app.LoadScript("globals.js");
    app.LoadScript("functions.js");
    //app.LoadScript("rawData.js");
    app.LoadScript("resources.js");

    // Instructional text
    text = app.CreateText("Perform the bends that are shown", "Multiline");
    text.SetPosition(0.15, 0.3);
    text.SetTextSize(30);

    // Use case text
    usedForText = app.CreateText("", "Multiline");
    usedForText.SetPosition(0.2, 0.37);
    usedForText.SetTextSize(30);
    layout.AddChild(usedForText);

    // Top Left
    TLup = app.CreateText("Up", "Multiline");
    TLup.SetPosition(0.05, 0.12);
    TLup.SetTextSize(30);
    TLdown = app.CreateText("Down", "Multiline");
    TLdown.SetPosition(0.05, 0.12);
    TLdown.SetTextSize(30);

    // Top Right
    TRup = app.CreateText("Up", "Multiline");
    TRup.SetPosition(0.85, 0.12);
    TRup.SetTextSize(30);
    TRdown = app.CreateText("Down", "Multiline");
    TRdown.SetPosition(0.82, 0.12);
    TRdown.SetTextSize(30);

    // Bottom Right
    BRup = app.CreateText("Up", "Multiline");
    BRup.SetPosition(0.82, 0.76);
    BRup.SetTextSize(30);
    BRdown = app.CreateText("Down", "Multiline");
    BRdown.SetPosition(0.8, 0.76);
    BRdown.SetTextSize(30);

    // Bottom Left
    BLup = app.CreateText("Up", "Multiline");
    BLup.SetPosition(0.05, 0.76);
    BLup.SetTextSize(30);
    BLdown = app.CreateText("Down", "Multiline");
    BLdown.SetPosition(0.05, 0.76);
    BLdown.SetTextSize(30);

    // OK button
    okButton = app.CreateButton("OK", 0.5);
    okButton.SetPosition(0.25, 0.5);
    okButton.SetOnTouch(readUseForText);

    // Start button
    startButton = app.CreateButton("Start", 0.5);
    startButton.SetPosition(0.25, 0.45);
    startButton.SetOnTouch(start);

    if (!showButtons) {
        // Create Bluetooth serial object
        bt = app.CreateBluetoothSerial();
        bt.SetOnConnect(bt_OnConnect)
        bt.SetOnReceive(bt_OnReceive);
        bt.SetSplitMode("End", "\n");

        // Connect to the HC-05 bluetooth chip
        bt.Connect("HC-05");
    }

    // Add layout to app
    app.AddLayout(layout);

    // Create a delay for when to show the start button after loading is done
    loadTime = setTimeout(showStart, 5000);
};

// Called when bluetooth connects
function bt_OnConnect(ok) {
    if (!ok) {
        console.log("BT ERROR!");
        bt.Connect("HC-05"); // Try to reconnect again
    } else if (ok)
        console.log("BT Successful");
}

// Called when we get data from bluetooth device
function bt_OnReceive(data) {
    // data = array of analogRead inputs sent from Arduino
    A = data.split(",");
    console.log("Received: " + A[0]+","+A[1]+","+A[2]+","+A[3]+","+A[4]);

    // NOTE: readNextInput is needed to create a buffer between bend sensor readings
    // since analog readings are constantly being read, faster than the time it takes the user to release the bend
    if (A[0] === undefined || A[1] === undefined || A[2] === undefined || A[3] === undefined || A[4] === undefined
        || A[0] === "" || A[1] === "" || A[2] === "" || A[3] === "" || A[4] === "")  {//if all elements have some value
        console.log("Incompete values, skip");
        return;
    } else {
        console.log("Use above");
    }


    // Check if reset button is pressed (to reset flat values) A[4] = buttonState
    if (A[4] == '1') {
        initializeFlatValues(); // Initialize the straight values of each bend sensor
    }

    // Only check for bend inputs after start has been pressed because that means flat values has been initialized
    if (startClicked) {
        // Check if all sensors are normal (no bends / straight / flat)
        if (Math.abs(flat_A[0] - A[0]) < flatValue && Math.abs(flat_A[1] - A[1]) < flatValue && Math.abs(flat_A[2] - A[2]) < flatValue && Math.abs(flat_A[3] - A[3]) < flatValue) {
            bending = false;
            readNextInput = true;
        } else if (readNextInput) {
            bending = true;
            // thin: Left side up + Right side up
            if ((A[0] - flat_A[0]) > 120 && (A[1] - flat_A[1]) > 120 && (A[2] - flat_A[2]) > 120 && (A[3] - flat_A[3]) > 120) {
                showThinPaper();
                console.log("thin");
            }
            // moveUp: Top side down
            else if ((flat_A[1] - A[1]) > 150 && (flat_A[2] - A[2]) > 150) {
                movePaperUp();
                console.log("moveUp");
            }
            // moveLeft: Left side down
            else if ((flat_A[0] - A[0]) > 110 && (flat_A[1] - A[1]) > 110) {
                movePaperLeft();
                console.log("moveLeft");
            }
            // moveRight: Right side down
            else if ((flat_A[2] - A[2]) > 110 && (flat_A[3] - A[3]) > 110) {
                movePaperRight();
                console.log("moveRight");
            }
            // fold: Top side up
            else if ((A[1] - flat_A[1]) > 150 && (A[2] - flat_A[2]) > 150) {
                showFold();
                console.log("fold");
            }
            // crumple: Top left up + Bottom right up
            else if ((A[1] - flat_A[1]) > 120 && (A[3] - flat_A[3]) > 120) {
                crumplePaper();
                console.log("crumple");
            }
            // kick1: Bottom left up + Bottom right down
            else if ((A[0] - flat_A[0]) > 90 && (flat_A[3] - A[3]) > 90) {
                showKick1();
                console.log("kick1");
            }
            // kick2: Bottom left down + Bottom right up
            else if ((flat_A[0] - A[0]) > 100 && (A[3] - flat_A[3]) > 100) {
                showKick2();
                console.log("kick2");
            }
            // climb1: Top right down
            else if ((flat_A[2] - A[2]) > 150) {
                showWallClimb1();
                console.log("climb1");
            }
            // climb2: Top left down
            else if ((flat_A[1] - A[1]) > 140) {
                showWallClimb2();
                console.log("climb2");
            }
            // shoot: Top right up
            else if ((A[2] - flat_A[2]) > 220) {
                showPaperShooting();
                console.log("shoot");
            }
            // Else any other input is incorrect and should be logged
            //else if (Math.abs(flat_A[0] - A[0]) > flatValue || Math.abs(flat_A[1] - A[1]) > flatValue || Math.abs(flat_A[2] - A[2]) > flatValue || Math.abs(flat_A[3] - A[3]) > flatValue)
            else if (false) {
                logInput("OTHER");
                showResponse(false);
            }
        }
    }
}

// Runs when user clicks ok after reading use-for text
function readUseForText() {
    // Hide use for text
    usedForText.SetText("");
    addOKbuttonOnce = true;
    showUseForText = false;
    layout.RemoveChild(okButton);

    // Remove all up/down text
    layout.RemoveChild(TLdown);
    layout.RemoveChild(TLup);
    layout.RemoveChild(TRdown);
    layout.RemoveChild(TRup);
    layout.RemoveChild(BLdown);
    layout.RemoveChild(BLup);
    layout.RemoveChild(BRdown);
    layout.RemoveChild(BRup);

    // Remove all arrows
    layout.RemoveChild(res.arrowBL_png);
    layout.RemoveChild(res.arrowBR_png);
    layout.RemoveChild(res.arrowTL_png);
    layout.RemoveChild(res.arrowTR_png);
}

// Delay showing the start button till after the scripts finish loading
function showStart() {
    layout.RemoveChild(loading);
    layout.AddChild(text);
    layout.AddChild(startButton);
    clearInterval(loadTime);

    // Setup arrows
    res.arrowTL_png.SetPosition(0, 0);
    res.arrowTR_png.SetPosition(0.9, 0);
    res.arrowBL_png.SetPosition(0, 0.85);
    res.arrowBR_png.SetPosition(0.9, 0.85);
}

// Start: show paper and possible bends
function start() {
    // Initialize the straight values of each bend sensor
    initializeFlatValues();
    startClicked = true;

    // Start a new line in the log file
    roundNum++;
    completedRound = 'n';

    // Remove previous content from layout
    layout.RemoveChild(text);
    layout.RemoveChild(startButton);
    if (roundNum > 3)
        layout.RemoveChild(doneButton);

    // Reset paper position to the middle of the screen
    paperX = 0.3;
    paperY = 0.2;

    // Create a blank image to act as our drawing canvas
    canvas = app.CreateImage(null, 1, 1);
    canvas.SetAutoUpdate(false);
    layout.AddChild(canvas);

    // Begin practiceTime and update it every 1 second
    setInterval(updatePracticeTime, 1000);

    // Shuffle the order of gestures to be shown
    //shuffle(gesturesArray);

    // Start showing gestures to perform
    repeatGestureTimer = setInterval(selectGesture, 0);

    /* --- BUTTONS --- */
    if (showButtons) {
        bending = false;
        // Top side down button
        TSD_btn = app.CreateButton("jump");
        TSD_btn.SetPosition(0.55, 0)
        TSD_btn.SetOnTouch(movePaperUp);
        layout.AddChild(TSD_btn);
        // Left side up button
        LSU_btn = app.CreateButton("thin");
        LSU_btn.SetPosition(0.105, 0.4)
        LSU_btn.SetOnTouch(showThinPaper);
        layout.AddChild(LSU_btn);
        // Top side up button
        TSU_btn = app.CreateButton("fold");
        TSU_btn.SetPosition(0.4, 0)
        TSU_btn.SetOnTouch(showFold);
        layout.AddChild(TSU_btn);
        // Top left up button
        TLU_btn = app.CreateButton("crumple");
        TLU_btn.SetPosition(0.105, 0)
        TLU_btn.SetOnTouch(crumplePaper);
        layout.AddChild(TLU_btn);
        // Top right down button
        TRD_btn = app.CreateButton("climb1");
        TRD_btn.SetPosition(0.85, 0)
        TRD_btn.SetOnTouch(showWallClimb1);
        layout.AddChild(TRD_btn);
        // Top left down button
        TLD_btn = app.CreateButton("climb2");
        TLD_btn.SetPosition(0, 0)
        TLD_btn.SetOnTouch(showWallClimb2);
        layout.AddChild(TLD_btn);
        // Bottom right up button
        BRU_btn = app.CreateButton("kick2");
        BRU_btn.SetPosition(0.745, 0.85)
        BRU_btn.SetOnTouch(showKick2);
        layout.AddChild(BRU_btn);
        // Bottom right down button
        BRD_btn = app.CreateButton("kick1");
        BRD_btn.SetPosition(0.85, 0.85)
        BRD_btn.SetOnTouch(showKick1);
        layout.AddChild(BRD_btn);
        // Top right up button
        TRU_btn = app.CreateButton("shoot");
        TRU_btn.SetPosition(0.745, 0)
        TRU_btn.SetOnTouch(showPaperShooting);
        layout.AddChild(TRU_btn);
        // Left side down button
        LSD_btn = app.CreateButton("movL");
        LSD_btn.SetPosition(0, 0.4)
        LSD_btn.SetOnTouch(movePaperLeft);
        layout.AddChild(LSD_btn);
        // Right side up
        RSD_btn = app.CreateButton("movR");
        RSD_btn.SetPosition(0.745, 0.4)
        RSD_btn.SetOnTouch(movePaperRight);
        layout.AddChild(RSD_btn);
    }
    /* --- END OF BUTTONS --- */
}

// This is called when the user is done with the current test
function done() {
    // User is done, remove buttons on the screen
    readNextInput = false;
    layout.RemoveChild(startButton);
    layout.RemoveChild(doneButton);
    text.SetText("Cool!");
    console.log("Done.");
}

// Pick a random gesture for the user to perform
function selectGesture() {
    clearInterval(repeatGestureTimer); // Clear this interval (it will start once the animation or moving end)

    // Loop through the available gesture frames continuously
    if (gesturesIndex < gesturesArray.length) {
        index = gesturesArray[gesturesIndex];

        switch (index) {
        case 1:
            gesture = "jump";
            break;
        case 2:
            gesture = "thin";
            break;
        case 3:
            gesture = "fold";
            break;
        case 4:
            gesture = "crumple";
            break;
        case 5:
            gesture = "wallClimb1";
            break;
        case 6:
            gesture = "wallClimb2";
            break;
        case 7:
            gesture = "kick1";
            break;
        case 8:
            gesture = "kick2";
            break;
        case 9:
            gesture = "shoot";
            break;
        case 10:
            gesture = "moveLeft";
            break;
        case 11:
            gesture = "moveRight";
            break;
        }
        // Run portion of the gesture to show user what to do
        gestureTimer = setInterval(ShowGesture, gestureFrameRate);
    }
    // User has finished round of gestures, repeat or finish (done)
    else {
        // Run this code after 1.5 second delay
        setTimeout(function () {
            // Remove response right away if it is shown
            if (responseIsShown)
                layout.RemoveChild(response);

            layout.RemoveChild(canvas);
            gesturesIndex = 0;

            // Check if previous round is 1 then we must repeat exercise
            if (roundNum == 1 || roundNum == 2) {
                readNextInput = false;

                // Instructional text
                text = app.CreateText("You will now repeat this excercise", "Multiline");
                text.SetPosition(0.15, 0.3);
                text.SetTextSize(30);
                layout.AddChild(text);

                // Start button
                startButton = app.CreateButton("Repeat", 0.5);
                startButton.SetPosition(0.25, 0.45);
                startButton.SetOnTouch(start);
                layout.AddChild(startButton);
            }
            // Otherwise user has choice to repeat or not
            else if (roundNum > 2) {
                // Instructional text
                text = app.CreateText("Done! Need more practice?", "Multiline");
                text.SetPosition(0.22, 0.3);
                text.SetTextSize(30);
                layout.AddChild(text);

                // Start button
                startButton = app.CreateButton("Repeat practice", 0.5);
                startButton.SetPosition(0.25, 0.43);
                startButton.SetOnTouch(start);
                layout.AddChild(startButton);

                // Done button
                doneButton = app.CreateButton("Done", 0.5);
                doneButton.SetPosition(0.25, 0.6);
                doneButton.SetOnTouch(done);
                layout.AddChild(doneButton);
            }
        }, 1500);
    }
}

// Set readNextInput if some time passes (user tends to hold the bend in place without flatening first)
function removeReadNextInput() {
    readNextInput = true;
    clearInterval(readNextInputTimer);
}

// User has made a gesture, check if it was correct or not and increment # of attempts
function showResponse(isCorrect) {
    // Check if a previous response is already showing
    if (responseIsShown)
        removeResponse();

    // Stop reading anymore inputs till the user releases this bend or till 2 seconds pass
    readNextInput = false;

    // Check if the gesture performed was the right one
    if (isCorrect) {
        // If user did the correct gesture then we can set the show use-for text to true for the next gesture
        showUseForText = true;

        // Record and store time and number of gesture inputs for this gesture
        string = dataID + "," + userID + "," + groupID + "," + new Date() + "," + sessionNum + "," + roundNum + "," + gesture + "," + (gesturesIndex + 1) + "," + getBendTime() + "," + gesturesPerformed.length + ",";
        for (var i = 0; i < gesturesPerformed.length; i++) {
            string += gesturesPerformed[i] + ";";
        }
        if (gesturesIndex == (gesturesArray.length - 1)) {
            console.log("rounded completed");
            completedRound = 'y';
            string += "," + completedRound + "," + getRoundPracticeTime() + "," + practiceTime + "\n";
        } else
            string += ",-,-,-\n";
        app.WriteFile(fileLocation, string, "Append");
        gesturesPerformed = []; // After we log this gesture's info, we reset the gesturesPerformed array to empty

        // Show correct response
        response = app.CreateText("Good job");
        response.SetBackColor("#009933");
        gesturesIndex++; // Increment gesturesIndex to show the next gesture
        if (readNextInputTimer)
            clearInterval(readNextInputTimer); // Before setting a new interval delay, we should make sure there is no previous one
        readNextInputTimer = setInterval(removeReadNextInput, 4000); // wait 4 seconds before next reading
        console.log("wait 4 seconds after " + new Date().getSeconds());
    } else {
        // Show incorrect response
        response = app.CreateText(" Try again ");
        response.SetBackColor("#ff3300");
        if (readNextInputTimer)
            clearInterval(readNextInputTimer); // Before setting a new interval delay, we should make sure there is no previous one
        readNextInputTimer = setInterval(removeReadNextInput, 2000); // wait 2 sec before next reading
        console.log("wait 2 seconds after " + new Date().getSeconds());
    }

    // Show response and start showing gestures again
    response.SetPosition(0.37, 0.82);
    response.SetTextSize(30);
    response.SetPadding(0.02, 0.02, 0.02, 0.02)
    response.SetTextColor("#ffffff");
    layout.AddChild(response);
    responseIsShown = true;
    responseTimer = setInterval(removeResponse, responseShowTime);
}

// Remove the response
function removeResponse() {
    if (responseIsShown)
        layout.RemoveChild(response);
    responseIsShown = false;
    clearInterval(responseTimer);
}

// This shows a portion of the animation of a gesture (to show the user the bend to perform)
function ShowGesture() {
    if (gestureFrameIndex < gestureFrameUp.length && !animating && !moving) {
        // Clear the canvas
        canvas.Clear();

        // Reset position of paper back to the center
        paperX = 0.3;
        paperY = 0.2;

        switch (gesture) {
        case "jump":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTL_png);
                    layout.AddChild(res.arrowTR_png);
                    layout.AddChild(TLdown);
                    layout.AddChild(TRdown);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To move up.");
            } else
                canvas.DrawImage(jumpSet[gestureFrameUp[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "thin":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTL_png);
                    layout.AddChild(res.arrowTR_png);
                    layout.AddChild(res.arrowBL_png);
                    layout.AddChild(res.arrowBR_png);
                    layout.AddChild(TLup);
                    layout.AddChild(TRup);
                    layout.AddChild(BLup);
                    layout.AddChild(BRup);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To get through thin wholes.");
            } else
                canvas.DrawImage(thinSet[gestureFrameDown[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "fold":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTL_png);
                    layout.AddChild(res.arrowTR_png);
                    layout.AddChild(TLup);
                    layout.AddChild(TRup);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To fold in half.");
            } else
                canvas.DrawImage(foldSet[gestureFrameUp[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "crumple":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTL_png);
                    layout.AddChild(res.arrowBR_png);
                    layout.AddChild(TLup);
                    layout.AddChild(BRup);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To crumple into a ball.");
            } else
                canvas.DrawImage(crumpleSet[gestureFrameDown[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "wallClimb1":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTR_png);
                    layout.AddChild(TRdown);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To prevent paper from falling.");
            } else
                canvas.DrawImage(climb1Set[gestureFrameUp[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "wallClimb2":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTL_png);
                    layout.AddChild(TLdown);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To prevent paper from falling.");
            } else
                canvas.DrawImage(climb2Set[gestureFrameDown[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "kick1":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowBL_png);
                    layout.AddChild(res.arrowBR_png);
                    layout.AddChild(BLup);
                    layout.AddChild(BRdown);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To kick and breack the ground.");
            } else
                canvas.DrawImage(kick1Set[gestureFrameUp[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "kick2":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s) bottom left down and button right up
                    layout.AddChild(res.arrowBL_png);
                    layout.AddChild(res.arrowBR_png);
                    layout.AddChild(BLdown);
                    layout.AddChild(BRup);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To kick and breack the ground.");
            } else
                canvas.DrawImage(kick2Set[gestureFrameDown[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "shoot":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTR_png);
                    layout.AddChild(TRup);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("Shoot paper airplane to break wall.");
            } else
                canvas.DrawImage(shootSet[gestureFrameUp[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "moveLeft":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTL_png);
                    layout.AddChild(res.arrowBL_png);
                    layout.AddChild(TLdown);
                    layout.AddChild(BLdown);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To move left.");
            } else
                canvas.DrawImage(moveLeftSet[gestureFrameDown[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        case "moveRight":
            if (showUseForText) {
                if (addOKbuttonOnce) {
                    layout.AddChild(okButton);
                    // Add arrow(s)
                    layout.AddChild(res.arrowTR_png);
                    layout.AddChild(res.arrowBR_png);
                    layout.AddChild(TRdown);
                    layout.AddChild(BRdown);
                }
                addOKbuttonOnce = false;
                usedForText.SetText("To move right.");
            } else
                canvas.DrawImage(moveRightSet[gestureFrameUp[gestureFrameIndex]], paperX, paperY, paperWidth, paperHeight);
            break;
        }

        // Update the canvas and gestureFrameIndex
        gestureFrameIndex++;
        canvas.Update();
    }
    // Animating this gesture is done, stop and reset everything
    else {
        clearInterval(gestureTimer);
        gestureFrameIndex = 0;
        repeatGestureTimer = setInterval(selectGesture, gestureRepeatTime);
    }
}

// This is called when user performs an up bend and we want to show the animation
function DrawFrame() {
    // Hold this image for some time
    if (holdTime <= 10) {
        // Clear the canvas
        canvas.Clear();

        switch (animate) {
        case "thin":
            // width: 1/480
            // height: 0.6/480
            canvas.DrawImage(res.thin_png, paperX, paperY, paperWidth, paperHeight);
            break;
        case "fold":
            canvas.DrawImage(res.fold_png, paperX, paperY, paperWidth, paperHeight);
            break;
        case "crumple":
            canvas.DrawImage(res.crumple_png, paperX, paperY, paperWidth, paperHeight);
            break;
        case "wallClimb1":
            canvas.DrawImage(res.hold1_png, paperX, paperY, paperWidth, paperHeight);
            break;
        case "wallClimb2":
            canvas.DrawImage(climb2Set[2], paperX, paperY, paperWidth, paperHeight);
            break;
        case "kick1":
            canvas.DrawImage(kick1Set[2], paperX, paperY, paperWidth, paperHeight);
            break;
        case "kick2":
            canvas.DrawImage(kick2Set[2], paperX, paperY, paperWidth, paperHeight);
            break;
        case "shoot":
            canvas.DrawImage(res.shoot_png, paperX, paperY, paperWidth * 1.65, paperHeight);
            break;
        }

        // Update the canvas and holdTime
        holdTime++;
        canvas.Update();
    }
    // Animating this gesture is done, stop and reset everything
    else {
        clearInterval(animationTimer);
        holdTime = 0;
        animating = false;
    }
}

// This is called when user performs a down bend and we want to move the paper
function movePaper() {
    // Move the paper 6 times (0,0 are cordinates in the top left corner)
    if (bending) {
        // Clear the canvas
        canvas.Clear();

        switch (move) {
        case "up":
            paperY -= paperMoveSpeed;
            canvas.DrawImage(res.normal_png, paperX, paperY, paperWidth, paperHeight);
            break;
        case "left":
            paperX -= paperMoveSpeed;
            canvas.DrawImage(res.normal_png, paperX, paperY, paperWidth, paperHeight);
            break;
        case "right":
            paperX += paperMoveSpeed;
            canvas.DrawImage(res.normal_png, paperX, paperY, paperWidth, paperHeight);
            break;
        }

        // Update the canvas
        canvas.Update();

    }
    // Stop moving the paper, reset everything
    else {
        clearInterval(moveTimer);
        moving = false;
    }
}
