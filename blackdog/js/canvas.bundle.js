/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/canvas.js":
/*!***********************!*\
  !*** ./src/canvas.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2
};

var randomX = randomIntFromRange(window.innerWidth + 50 - window.innerWidth, window.innerWidth - 50);
var randomY = randomIntFromRange(window.innerHeight + 50 - window.innerHeight, window.innerHeight - 50);

var colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// Event Listeners
addEventListener('mousemove', function (event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

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
		x: Math.random() - 0.5,
		y: Math.random() - 0.5
	};

	this.update = function (enemies) {
		_this.draw();

		for (var i = 0; i < enemies.length; i++) {
			if (_this === enemies[i]) continue;
			if (Distance(_this.x, _this.y, enemies[i].x, enemies[i].y) - 50 < 0) {
				//HITBOX ^^^
				_this.velocity.x = -_this.velocity.x;
				_this.velocity.y = -_this.velocity.y;
			}
		}

		if (_this.x <= 0 || _this.x >= innerWidth) {
			_this.velocity.x = -_this.velocity.x;
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

	player1 = new Player(undefined, undefined, document.getElementById("blackdog"), 50, 50);

	var x = randomIntFromRange(window.innerWidth + 50 - window.innerWidth, window.innerWidth - 50);
	var y = randomIntFromRange(window.innerHeight + 50 - window.innerHeight, window.innerHeight - 50);
	coin = new Coin(x, y, document.getElementById("coin"), 50, 50);

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

		enemies.push(new Enemy(_x, _y, document.getElementById("enemy"), 50, 50));
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

		enemies.push(new Enemy(x, y, document.getElementById("enemy"), 50, 50));
	}

	coin.update();
	console.log(Distance(player1.x, player1.y, coin.x, coin.y));
}

init();
animate();

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

module.exports = { randomIntFromRange: randomIntFromRange, randomColor: randomColor, distance: distance };

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map