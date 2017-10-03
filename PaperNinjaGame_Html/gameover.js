var gameover = {
    init: function (winStatus, time) {
        if (winStatus) {
            var text = "Success! :)";
            completedLevel = 'y';
        } else {
            var text = "You fell :(";
            completedLevel = 'n';
        }

        // Game over title (win or lose)
        var gameOverTitle = game.add.text(400, 120, text, {
            fontSize: '62px',
            fill: '#fff'
        });
        gameOverTitle.anchor.setTo(0.5);

        // Log the user's time
        storeThisInfo(9);

    },
    create: function () {
        // Play Again button
        var playAgaintButton = this.game.add.button(400, 340, 'playAgain', this.start, this);
        playAgaintButton.anchor.setTo(0.5);
    },
    start: function () {
        game.state.start("play");
    }
};