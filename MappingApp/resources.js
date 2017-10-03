// Load assets into res object
var res = {
    normal_png: app.CreateImage("Img/normal.png"),
    thin_png: app.CreateImage("Img/thin.png"),
    fold_png: app.CreateImage("Img/folded.png"),
    crumple_png: app.CreateImage("Img/crumpled.png"),
    hold1_png: app.CreateImage("Img/hold1.png"),
    shoot_png: app.CreateImage("Img/shoot_image.png", 1, -1)
};

/* --- GESTURES --- */
// jump: Bottom side up
var jump = {
    frame0: app.CreateImage("Img/0jump.png"),
    frame1: app.CreateImage("Img/1jump.png"),
    frame2: app.CreateImage("Img/2jump.png")
};
var jumpSet = []; // Move all gesture objects into an array
for (var i in jump) {
    jumpSet.push(jump[i]);
}
// thin: Left side up + Right side up
var thin = {
    frame0: app.CreateImage("Img/0thin.png"),
    frame1: app.CreateImage("Img/1thin.png"),
    frame2: app.CreateImage("Img/2thin.png")
};
var thinSet = []; // Move all gesture objects into an array
for (var i in thin) {
    thinSet.push(thin[i]);
}
// fold: Top side up
var fold = {
    frame0: app.CreateImage("Img/0fold.png"),
    frame1: app.CreateImage("Img/1fold.png"),
    frame2: app.CreateImage("Img/2fold.png")
};
var foldSet = []; // Move all gesture objects into an array
for (var i in fold) {
    foldSet.push(fold[i]);
}
// crumple: Top left up + Bottom right up
var crumple = {
    frame0: app.CreateImage("Img/0crumple.png"),
    frame1: app.CreateImage("Img/1crumple.png"),
    frame2: app.CreateImage("Img/2crumple.png")
};
var crumpleSet = []; // Move all gesture objects into an array
for (var i in crumple) {
    crumpleSet.push(crumple[i]);
}
// wallClimb1: Top right down
var climb1 = {
    frame0: app.CreateImage("Img/0climb1.png"),
    frame1: app.CreateImage("Img/1climb1.png"),
    frame2: app.CreateImage("Img/2climb1.png")
};
var climb1Set = []; // Move all gesture objects into an array
for (var i in climb1) {
    climb1Set.push(climb1[i]);
}
// wallClimb2: Top left down
var climb2 = {
    frame0: app.CreateImage("Img/0climb2.png"),
    frame1: app.CreateImage("Img/1climb2.png"),
    frame2: app.CreateImage("Img/2climb2.png")
};
var climb2Set = []; // Move all gesture objects into an array
for (var i in climb2) {
    climb2Set.push(climb2[i]);
}
// kick1: Top right down
var kick1 = {
    frame0: app.CreateImage("Img/0kick1.png"),
    frame1: app.CreateImage("Img/1kick1.png"),
    frame2: app.CreateImage("Img/2kick1.png")
};
var kick1Set = []; // Move all gesture objects into an array
for (var i in kick1) {
    kick1Set.push(kick1[i]);
}
// kick2: Top left down
var kick2 = {
    frame0: app.CreateImage("Img/0kick2.png"),
    frame1: app.CreateImage("Img/1kick2.png"),
    frame2: app.CreateImage("Img/2kick2.png")
};
var kick2Set = []; // Move all gesture objects into an array
for (var i in kick2) {
    kick2Set.push(kick2[i]);
}
// shoot: Top right up
var shoot = {
    frame0: app.CreateImage("Img/0shoot.png"),
    frame1: app.CreateImage("Img/1shoot.png"),
    frame2: app.CreateImage("Img/2shoot.png")
};
var shootSet = []; // Move all gesture objects into an array
for (var i in shoot) {
    shootSet.push(shoot[i]);
}
// moveLeft: Right side up
var moveLeft = {
    frame0: app.CreateImage("Img/0moveLeft.png"),
    frame1: app.CreateImage("Img/1moveLeft.png"),
    frame2: app.CreateImage("Img/2moveLeft.png")
};
var moveLeftSet = []; // Move all gesture objects into an array
for (var i in moveLeft) {
    moveLeftSet.push(moveLeft[i]);
}
// moveRight: Left side up
var moveRight = {
    frame0: app.CreateImage("Img/0moveRight.png"),
    frame1: app.CreateImage("Img/1moveRight.png"),
    frame2: app.CreateImage("Img/2moveRight.png")
};
var moveRightSet = []; // Move all gesture objects into an array
for (var i in moveRight) {
    moveRightSet.push(moveRight[i]);
}
