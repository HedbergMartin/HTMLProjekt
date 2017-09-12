var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var speed = 5;

function preload() {
	game.load.image('player', 'assets/player.png');
	game.load.image('weapon', 'assets/weapon.png');
}

function create() {
	
	player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	player.anchor.setTo(0.5, 0.5);
	
	weapon = game.add.sprite(0, 0, 'weapon');
	weapon.anchor.setTo(0, 0.5);
	
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function update() {
	movePlayer();
	aim();
}

function movePlayer() {
	moveX = 0;
	moveY = 0;
	
	if (wKey.isDown) {
		moveY -= speed;
	}
	if (aKey.isDown) {
		moveX -= speed;
	}
	if (sKey.isDown) {
		moveY += speed;
	}
	if (dKey.isDown) {
		moveX += speed;
	}
	
	if (moveX != 0 && moveY != 0) {
		moveX *= Math.cos(Math.PI/4);
		moveY *= Math.cos(Math.PI/4);
	}
	
	player.x += moveX;
	player.y += moveY;
}

function aim() {
	weapon.x = player.x;
	weapon.y = player.y;
	
	mouseX = game.input.mousePointer.x;
	mouseY = game.input.mousePointer.y;
	
	radians = Math.atan(-(player.y - mouseY) / (mouseX - player.x));
	degrees = radians * (360 / (2 * Math.PI));
	
	if (mouseX < player.x) {
		degrees += 180;
	}
	
	player.angle = degrees;
	weapon.angle = degrees;
}