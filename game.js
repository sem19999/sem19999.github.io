var game = new Phaser.Game(1100, 600, Phaser.AUTO, '', {
	preload: preload,
    create: create,
    update: update,

});

var player;
var theSpikes;
var playerAnim;
var jumpB;
var spike;
var score = 0;
var scoreText;
var scoreString;
var background;
var backgroundSong;
var gameOver = false;
var gameOverText;
var startText;
var started = false;


function preload(){
	game.load.image('spike', 'assets/spike D.png');
	game.load.image('background', 'assets/background.jpg')
	game.load.spritesheet('player', 'assets/playerBall.png');
	game.load.audio('backgroundSong', 'assets/song.mp3')
}

function create(){
	//background stuff
	backgroundSong = game.add.audio('backgroundSong', 1, true)
	backgroundSong.volume = 0.2;
	backgroundSong.play();
	background = game.add.tileSprite(0, 0, 1100, 600, "background");
	//start physics engine and setup gravite and collisions
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 850;
	game.physics.arcade.checkCollision.left = false;
	// //player
	player = game.add.sprite(211,47,'player');
	player.anchor.setTo(0.5, 0.5);
	//enable physics for player	
	game.physics.enable(player, Phaser.Physics.ARCADE);

	//collision player etc
	player.body.collideWorldBounds = true;


	//enemy aka theSpikes!
	//group the spikes,  kill if out of bound and enable physics
	theSpikes = game.add.group();
	theSpikes.enableBody = true;
	theSpikes.setAll('outOfBoundsKill', true);

	theSpikes.physicsBodyType = Phaser.Physics.ARCADE;

	//call function createTheSpikes every ranom 1 to 10 seconds

	game.time.events.repeat(Phaser.Timer.SECOND * game.rnd.integerInRange(2, 10), 7, createTheSpikes, this);
	game.time.events.add(Phaser.Timer.SECOND * 30, level2, this);
	game.time.events.add(Phaser.Timer.SECOND * 60, level3, this);


	function level2(){
		game.time.events.repeat(Phaser.Timer.SECOND * game.rnd.integerInRange(2, 5), 10000, createTheSpikes, this);
	}

	function level3(){
		game.time.events.repeat(Phaser.Timer.SECOND * game.rnd.integerInRange(2, 14), 10000, createTheSpikes, this);
	}


	//score
	scoreString = "Your score:";
	scoreText = game.add.text(10,12,scoreString + score, {font: '32px Arial', fill: '#fff' });


	startText = game.add.text(260,260,'Press spacebar to Jump!!', {font: '52px Arial', fill: '#fff' });





	//create jump button (spacebar)
	jumpB = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update(){
	//jump if the player is on the groun and spacebar is pressed
	if (jumpB.isDown && player.body.onFloor()) {
		player.body.velocity.y = -720;
	}

	//if gametime is more then 2 seconds start the score countign
	if (this.game.time.now > 2000 && gameOver == false){
		score = Math.round((this.game.time.now - 2000) / 100);
		scoreText.text = scoreString + score;
	}

	//kill tutorial after first jump
	if (jumpB.isDown && started == false){
		started = true;
		startText.kill();
	}

	//display game over text if player is game over
	if (gameOver == true){
		gameOverText = game.add.text(334, 200, "Game Over, spacebar to restart!", {font: '32px Arial', fill: '#fff' })
	}
	//if game is over and spacebar is pressed reload the game
	if (gameOver == true && jumpB.isDown){
		location.reload();
	}



	//makes the ball roll
	player.angle += 8;

	//check for collisions between the player and the spike
	game.physics.arcade.collide(player,theSpikes,killPlayer,null,this);
}


//creates an enmey
function createTheSpikes(){
	spike = theSpikes.create(1020,470, 'spike');
	spike.body.collideWorldBounds = true;
	spike.scale.set(0.42);
	spike.body.velocity.x = (Math.random() * -333) + -200;

}

//kills the player and restarts the game
function killPlayer(player,theSpikes){
	player.kill();
	gameOver = true;

}
