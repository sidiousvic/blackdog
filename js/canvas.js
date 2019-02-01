"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2
};

var colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

var score = 0;

// Event Listeners
addEventListener('mousemove', function (event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

// addEventListener('touchmove', function (event) {
// 	mouse.x = event.clientX;
// 	mouse.y = event.clientY;
// });

addEventListener('resize', function () {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});

//Utility Functions

function Distance(x1, y1, x2, y2) {
	var xDistance = x2 - x1;
	var yDistance = y2 - y1;

	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// Objects
function Player(x, y, img, width, height) {
	this.x = x;
	this.y = y;
	this.img = img;
	this.dWidth = width;
	this.dHeight = height;
}

function Coin(x, y, img, width, height) {
	this.x = x;
	this.y = y;
	this.img = img;
	this.dWidth = width;
	this.dHeight = height;
}

function Enemy(x, y, img, width, height) {
	var _this = this;

	this.x = x;
	this.y = y;
	this.img = img;
	this.dWidth = width;
	this.dHeight = height;
	this.velocity = {
		x: Math.random() - 3,
		y: Math.random() - 3
	};

	this.update = function (enemies) {
		_this.draw();

		for (var i = 0; i < enemies.length; i++) {
			if (_this === enemies[i]) continue;
			if (Distance(_this.x, _this.y, enemies[i].x, enemies[i].y) - 20 < 0) {
				//HITBOX ^^^
				_this.velocity.x = -_this.velocity.x;
				_this.velocity.y = -_this.velocity.y;
				if (_this.img === document.getElementById("enemy")) {
					_this.img = document.getElementById("enemyR");
					} else {
						_this.img = document.getElementById("enemy");
					}
			}

			if (Distance(player1.x, player1.y, enemies[i].x, enemies[i].y) - 20 < 0) {
				//HITBOX ^^^
				enemies.length = 0;
				document.getElementById("score").innerHTML = String(score - 1) + " MONEYS";
				score = 0;
				coin.x = randomIntFromRange(window.innerWidth + 50 - window.innerWidth, window.innerWidth - 50);
				coin.y = randomIntFromRange(window.innerHeight + 50 - window.innerHeight, window.innerHeight - 50);
			}

		}

		//MAX NUMBER OF ENEMIES BEFORE WIN
		if (enemies.length > 99) {
			enemies.length = 0;
			document.getElementById("score").innerHTML = "NO MORE GHOSTIES. GOOD JOB BUCKO.";
			score = 0;
		}


		if (_this.x <= 0 || _this.x >= innerWidth) {
			_this.velocity.x = -_this.velocity.x;
			if (_this.img === document.getElementById("enemy")) {
			_this.img = document.getElementById("enemyR");
			} else {
				_this.img = document.getElementById("enemy");
			}
		}

		if (_this.y <= 0 || _this.y >= innerHeight) {
			_this.velocity.y = -_this.velocity.y;
		}

		_this.x += _this.velocity.x;
		_this.y += _this.velocity.y;
	};
}

Object.prototype.draw = function () {
	c.beginPath();
	c.drawImage(this.img, this.x, this.y, this.dWidth, this.dHeight);
	c.fillStyle = this.color;
	c.fill();
	c.closePath();
};

Object.prototype.update = function () {
	this.draw();
};

// Implementation
var player1 = void 0;
var enemies = void 0;
var coin = void 0;
function init() {
	enemies = [];

	player1 = new Player(mouse.x, mouse.y, document.getElementById("blackdog"), 50, 50);

	var Cx = randomIntFromRange(window.innerWidth + 50 - window.innerWidth, window.innerWidth - 50);
	var Cy = randomIntFromRange(window.innerHeight + 50 - window.innerHeight, window.innerHeight - 50);
	coin = new Coin(Cx, Cy, document.getElementById("coin"), 50, 50);

	var radius = 50;
	for (var i = 0; i < 3; i++) {
		var _x = randomIntFromRange(radius, window.innerWidth - radius);
		var _y = randomIntFromRange(radius, window.innerHeight - radius);

		if (i !== 0) {
			for (var j = 0; j < enemies.length; j++) {
				if (Distance(_x, _y, enemies[j].x, enemies[j].y) - 50 < 0) {
					//HITBOX ^^^
					_x = randomIntFromRange(radius, window.innerWidth - radius);
					_y = randomIntFromRange(radius, window.innerHeight - radius);

					j = -1;
				}
			}
		}

		enemies.push(new Enemy(_x, _y, document.getElementById("enemy"), 30, 30));
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	player1.x = mouse.x;
	player1.y = mouse.y;
	player1.update();

	enemies.forEach(function (enemy) {
		enemy.update(enemies);
	});

	if (Distance(player1.x, player1.y, coin.x, coin.y) < 25) {
		var x = randomIntFromRange(window.innerWidth + 50 - window.innerWidth, window.innerWidth - 50);
		var y = randomIntFromRange(window.innerHeight + 50 - window.innerHeight, window.innerHeight - 50);
		coin.x = randomIntFromRange(window.innerWidth + 50 - window.innerWidth, window.innerWidth - 50);
		coin.y = randomIntFromRange(window.innerHeight + 50 - window.innerHeight, window.innerHeight - 50);

		var radius = 50;
		for (var j = 0; j < enemies.length; j++) {
			if (Distance(x, y, enemies[j].x, enemies[j].y) - 50 < 0) {
				//HITBOX ^^^
				x = randomIntFromRange(radius, window.innerWidth - radius);
				y = randomIntFromRange(radius, window.innerHeight - radius);

				j = -1;
			}
		}

		enemies.push(new Enemy(x, y, document.getElementById("enemy"), 30, 30));
		document.getElementById("score").innerHTML = String(score);
		score++;
	}

	coin.update();}



init();
animate(); 	




function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
    var xDist = x2 - x1;
    var yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}