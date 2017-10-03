function canvas_moveUp() {
    logInput("BSU");
    paperSprite.body.velocity.y = -400;
    paperIsMoving = true;
}

function showThinPaper() {
    logInput("LSU+RSU");
    paperSprite.loadTexture('thin');
    paperSprite.body.setSize(paperSprite.width, paperSprite.height);
    paperIsBent = true;
    paperIsThin = true;
}

function showFold() {
    logInput("TSU");
    paperSprite.loadTexture('folded');
    paperSprite.body.setSize(paperSprite.width, paperSprite.height);
    paperIsBent = true;
    paperIsFolded = true;
}

function crumplePaper() {
    logInput("TLU+BRU");
    paperSprite.loadTexture('crumpled');
    paperSprite.body.setSize(paperSprite.width, paperSprite.height);
    paperIsBent = true;
    paperIsCrumpled = true;
}

function showWallClimb1() {
    logInput("TRD");
    if (hold1Once) {
        paperSprite.x += (paperSprite.width / 2) - 20;
        hold1Once = false;
    }
    paperSprite.loadTexture('hold1');
    paperSprite.body.setSize(paperSprite.width, paperSprite.height);
    if (hold2Once) {
        hold2Once = false;
    }
    paperSprite.body.gravity.y = 0;
    paperSprite.body.velocity.y = 0;
    paperIsBent = false;
}

function showWallClimb2() {
    logInput("TLD");
    if (!hold2Once) {
        paperSprite.x += (paperSprite.width / 2) + 25;
        hold2Once = true;
    }
    paperSprite.loadTexture('hold2');
    paperSprite.body.setSize(paperSprite.width, paperSprite.height);
    paperSprite.body.gravity.y = 0;
    paperSprite.body.velocity.y = 0;
    paperIsBent = false;
}

function showKick1() {
    logInput("BLU+BRD");
    paperSprite.loadTexture('kick1');
    paperSprite.body.setSize(paperSprite.width, paperSprite.height);
    paperIsBent = false;
    // Increment hit count by 1 Once
    if (waitForKick1) {
        breakHitPoint++;
        waitForKick1 = false;
        waitForKick2 = true;
        switch (breakHitPoint) {
        case 1:
            hTween1.start();
            break;
        case 2:
            hTween2.start();
            break;
        case 3:
            hTween3.start();
            break;
        case 4:
            hTween4.start();
            break;
        }
    }
}

function showKick2() {
    logInput("BLD+BRU");
    paperSprite.loadTexture('kick2');
    paperSprite.body.setSize(paperSprite.width, paperSprite.height);
    paperIsBent = false;
    // Increment hit count by 1 Once
    if (waitForKick2) {
        breakHitPoint++;
        waitForKick1 = true;
        waitForKick2 = false;
        switch (breakHitPoint) {
        case 1:
            hTween1.start();
            break;
        case 2:
            hTween2.start();
            break;
        case 3:
            hTween3.start();
            break;
        case 4:
            hTween4.start();
            break;
        }
    }
}

function showPaperShooting() {
    logInput("TRU");
    paperSprite.loadTexture('shoot');
    paperSprite.body.setSize(paperSprite.width, paperSprite.height);
    this.shootPaperAirplanes();
    paperIsBent = false;
}

function movePaperLeft() {
    logInput("RSU");
    paperSprite.body.velocity.x = -1500;
    paperIsMoving = true;
}

function movePaperRight() {
    logInput("LSU");
    paperSprite.body.velocity.x = 3500;
    paperIsMoving = true;
}
