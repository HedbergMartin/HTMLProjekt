var startupState = {

	preload: function() {
		game.load.image('welcome', 'assets/WelcomeScreen.png');
	},

	create: function() {
		var gos = game.add.sprite(game.width/2, game.height/2, 'welcome');
		gos.anchor.setTo(.5, .5);

		game.input.keyboard.onDownCallback = function() {
			game.input.keyboard.onDownCallback = null;
			game.state.start('tutorialState');
		}
	},

	update: function() {
		
	}
}