var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var moveSpeed = 5;
var bulletSpeed = 10;
var bullets = [];
var mousePressed = false;

function preload() {
	game.load.image('player', 'assets/player.png');
	game.load.image('weapon', 'assets/weapon.png');
	game.load.image('bullet1', 'assets/bullet.png');
	game.load.image('bullet2', 'assets/bullet.png');
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
	LMB = game.input.activePointer;
}

function update() {
	movePlayer();
	aim();
	shoot();
}

function shoot() {
	if (LMB.isDown && !mousePressed) {
		mousePressed = true;
		var bullet;
		if (Math.random() < 0.5) {
			bullet = game.add.sprite(player.x, player.y, 'bullet1');
		}
		else {
			bullet = game.add.sprite(player.x, player.y, 'bullet2');
		}
		bullet.anchor.setTo(0.5, 0.5);
		bullet.angle = playerRadians;
		bullets.push(bullet);
	}
	else if (!LMB.isDown && mousePressed) {
		mousePressed = false;
	}
	
	for (i = 0; i < bullets.length; i++) {
		bullets[i].x += bulletSpeed * Math.cos(bullets[i].angle);
		bullets[i].y += bulletSpeed * Math.sin(bullets[i].angle);
		
		if (!bullets[i].inWorld) {
			bullets.splice(i, 1);
		}
	}
	console.log(bullets.length);
}

function movePlayer() {
	moveX = 0;
	moveY = 0;
	
	if (wKey.isDown) {
		moveY -= moveSpeed;
	}
	if (aKey.isDown) {
		moveX -= moveSpeed;
	}
	if (sKey.isDown) {
		moveY += moveSpeed;
	}
	if (dKey.isDown) {
		moveX += moveSpeed;
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
	
	playerRadians = Math.atan(-(player.y - mouseY) / (mouseX - player.x));
	playerDegrees = playerRadians * (360 / (2 * Math.PI));
	
	if (mouseX < player.x) {
		playerDegrees += 180;
		playerRadians += Math.PI;
	}
	
	player.angle = playerDegrees;
	weapon.angle = playerDegrees;
}