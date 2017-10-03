// Load assets into res object
var res = {
    normal_png: app.CreateImage("Img/normal.png"),
    up_png: app.CreateImage("Img/2jump.png"),
    left_png: app.CreateImage("Img/2moveLeft.png"),
    right_png: app.CreateImage("Img/2moveRight.png"),
    thin_png: app.CreateImage("Img/2thin.png"),
    fold_png: app.CreateImage("Img/2fold.png"),
    crumple_png: app.CreateImage("Img/2crumple.png"),
    arrow_bl_down_png: app.CreateImage("Img/arrow-bl-down.png"),
    arrow_br_down_png: app.CreateImage("Img/arrow-br-down.png"),
    arrow_tl_down_png: app.CreateImage("Img/arrow-tl-down.png"),
    arrow_tr_down_png: app.CreateImage("Img/arrow-tr-down.png"),
    arrow_bl_up_png: app.CreateImage("Img/arrow-bl-up.png"),
    arrow_br_up_png: app.CreateImage("Img/arrow-br-up.png"),
    arrow_tl_up_png: app.CreateImage("Img/arrow-tl-up.png"),
    arrow_tr_up_png: app.CreateImage("Img/arrow-tr-up.png"),
    shoot_png: app.CreateImage("Img/2shoot.png")
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
// showLeft: Right side up
var showLeft = {
    frame0: app.CreateImage("Img/0moveLeft.png"),
    frame1: app.CreateImage("Img/1moveLeft.png"),
    frame2: app.CreateImage("Img/2moveLeft.png")
};
var showLeftSet = []; // Move all gesture objects into an array
for (var i in showLeft) {
    showLeftSet.push(showLeft[i]);
}
// showRight: Left side up
var showRight = {
    frame0: app.CreateImage("Img/0moveRight.png"),
    frame1: app.CreateImage("Img/1moveRight.png"),
    frame2: app.CreateImage("Img/2moveRight.png")
};
var showRightSet = []; // Move all gesture objects into an array
for (var i in showRight) {
    showRightSet.push(showRight[i]);
}
