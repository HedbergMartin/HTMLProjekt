var gameoverState = {

	preload: function() {
		game.load.image('gameover', 'assets/gameover.png');
	},

	create: function() {
		var gameinfo = game.add.bitmapText(300, 400, 'gamefont', 'Wave');
		gameinfo.setText('Waves ' + (wave-1) + '\nKills ' + kills);
		var gos = game.add.sprite(400, 200, 'gameover'); //TODO worldbounds
		gos.anchor.setTo(.5, .5);
		gos.scale.setTo(4, 4);
		gos.smoothed = false;

		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	update: function() {
		if (spaceKey.isDown) {
			game.state.start('gameState');
		}
	}
}