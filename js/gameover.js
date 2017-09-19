var gameoverState = {

	preload: function() {
		game.load.image('gameover', 'assets/gameover400px.png');
		game.load.image('rs', 'assets/pressanykeytorestart.png');
	},

	create: function() {
		var gameinfo = game.add.bitmapText(game.width/2, 400, 'gamefont', 'Wave');
		gameinfo.setText('Waves ' + (wave-1) + '\nKills ' + kills);
		gameinfo.anchor.setTo(.5, .5);

		var gos = game.add.sprite(game.width/2, 200, 'gameover');
		gos.anchor.setTo(.5, .5);

		var rsSprite = game.add.sprite(game.width/2, 600, 'rs');
		rsSprite.anchor.setTo(.5, .5);

		timeRestart = 0;
	},

	update: function() {
		if (timeRestart == 100) {
			game.input.keyboard.onDownCallback = function() {
				game.input.keyboard.onDownCallback = null;
				game.state.start('gameState');
			}
			timeRestart++;
		}else if (timeRestart < 100) {
			timeRestart++;
		}
	}
}