// Record every bend input the user makes
function logInput(bend) {
    totalGesturesPerformed++; // Every time we log a bend input, increment the total number of inputs
    gesturesPerformed.push(bend);
}

// Initialize the straight values of each bend sensor
function initializeFlatValues() {
    for (var i = 0; i < 8; i++) {
        flat_A[i] = A[i];
    }
    console.log("flat values saved");
};

/* --- ALL TIME FUNCTIONS --- */
// Updates the practiceTime by 1 millisecond
function updatePracticeTime() {
    practiceTime++;
}
// Get the amount of time (ms) since the last learnBendTime
function getBendTime() {
    var currentBendTime = practiceTime - learnBendTime;
    learnBendTime = practiceTime;
    return currentBendTime;
}

// Get the amount of time (ms) spent on this round of learning gestures
function getRoundPracticeTime() {
    var currentRoundPracticeTime = practiceTime - roundPracticeTime;
    roundPracticeTime = practiceTime;
    return currentRoundPracticeTime;
}
/* --- END OF TIME FUNCTIONS --- */

// jump: move paper up
function showPaperUp() {
    logInput("BSU");
    if (gesture == "jump") {
        move = "up";
        animate = "up";
        animationTimer = setInterval(DrawFrame, frameRate);
        animating = true;
        showResponse(true);
    } else
        showResponse(false);
}
// thin: show thin paper
function showThinPaper() {
    logInput("LSU+RSU");
    if (gesture == "thin") {
        if (!animating) {
            animate = "thin";
            animationTimer = setInterval(DrawFrame, frameRate);
            animating = true;
            showResponse(true);
        }
    } else
        showResponse(false);
}
// fold: show folded paper
function showFold() {
    logInput("TSU");
    if (gesture == "fold") {
        if (!animating) {
            animate = "fold";
            animationTimer = setInterval(DrawFrame, frameRate);
            animating = true;
            showResponse(true);
        }
    } else
        showResponse(false);
}
// crumple: show crumpled paper
function crumplePaper() {
    logInput("TLU+BRU");
    if (gesture == "crumple") {
        if (!animating) {
            animate = "crumple";
            animationTimer = setInterval(DrawFrame, frameRate);
            animating = true;
            showResponse(true);
        }
    } else
        showResponse(false);
}
// wallClimb1: show it
function showWallClimb1() {
    logInput("TRD");
    if (gesture == "wallClimb1") {
        if (!animating) {
            animate = "wallClimb1";
            animationTimer = setInterval(DrawFrame, frameRate);
            animating = true;
            showResponse(true);
        }
    } else
        showResponse(false);
}
// wallClimb2: show it
function showWallClimb2() {
    logInput("TLD");
    if (gesture == "wallClimb2") {
        if (!animating) {
            animate = "wallClimb2";
            animationTimer = setInterval(DrawFrame, frameRate);
            animating = true;
            showResponse(true);
        }
    } else
        showResponse(false);
}
// kick1: show kick1
function showKick1() {
    logInput("BLU+BRD");
    if (gesture == "kick1") { // If the user performed a gesture, check if it was the right gesture
        if (!animating) { // Check if there's already an animation running, we do not want to send one before the running one ends first
            animate = "kick1";
            animationTimer = setInterval(DrawFrame, frameRate);
            animating = true;
            showResponse(true);
        }
    } else
        showResponse(false);
}
// kick1: show kick2
function showKick2() {
    logInput("BLD+BRU");
    if (gesture == "kick2") { // If the user performed a gesture, check if it was the right gesture
        if (!animating) { // Check if there's already an animation running, we do not want to send one before the running one ends first
            animate = "kick2";
            animationTimer = setInterval(DrawFrame, frameRate);
            animating = true;
            showResponse(true);
        }
    } else
        showResponse(false);
}
// shoot: show shoot image
function showPaperShooting() {
    logInput("TRU");
    if (gesture == "shoot") { // If the user performed a gesture, check if it was the right gesture
        if (!animating) { // Check if there's already an animation running, we do not want to send one before the running one ends first
            animate = "shoot";
            animationTimer = setInterval(DrawFrame, frameRate);
            animating = true;
            showResponse(true);
        }
    } else
        showResponse(false);
}
// showLeft
function showPaperLeft() {
    logInput("RSU");
    if (gesture == "showLeft") {
        animate = "left";
        animationTimer = setInterval(DrawFrame, frameRate);
        animating = true;
        showResponse(true);
    } else
        showResponse(false);
}
// showRight
function showPaperRight() {
    logInput("LSU");
    if (gesture == "showRight") {
        animate = "right";
        animationTimer = setInterval(DrawFrame, frameRate);
        animating = true;
        showResponse(true);
    } else
        showResponse(false);
}
