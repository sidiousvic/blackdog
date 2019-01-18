import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

//Utility Functions

function Distance(x1, y1, x2, y2) {
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;
	
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Objects
function Sprite(x, y, img, width, height) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.dWidth = width;
    this.dHeight = height;
}

function Enemy(x, y, img, width, height) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.dWidth = width;
    this.dHeight = height;
    this.velocity = {
	    x: Math.random() - 0.5,
	    y: Math.random() - 0.5
    };
    
    this.update = enemies => {
	    this.draw();
	    
	    for (let i = 0; i < enemies.length; i++) {
		    if (this === enemies[i]) continue;
		    if (Distance(this.x, this.y, enemies[i].x, enemies[i].y) - 25 < 0) {
			    			 //THIS NUMBER DETERMINES BOUNCE DISTANCE ^^^
			    this.velocity.x = -this.velocity.x; 
			    this.velocity.y = -this.velocity.y;
		    }
		    
	    }
	    
	    if (this.x <= 0 || this.x >= innerWidth) {
		    this.velocity.x = -this.velocity.x;
	    }
	    
	    if (this.y <= 0 || this.y >= innerHeight) {
		    this.velocity.y = -this.velocity.y;
	    }
	    
	    this.x += this.velocity.x;
		this.y += this.velocity.y;
    };
    

}



Object.prototype.draw = function() {
    c.beginPath();
    c.drawImage(this.img, this.x, this.y, this.dWidth, this.dHeight);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
}

Object.prototype.update = function() {
    this.draw();
}

// Implementation
let player1;
let enemies;
function init() {
	enemies = [];
	player1 = new Sprite(undefined, undefined, document.getElementById("blackdog"), 50, 50);
	
	for (let i = 0; i < 80; i++) {
		let x = randomIntFromRange(canvas.width - canvas.width, canvas.width);
		let y = randomIntFromRange(canvas.height - canvas.height, canvas.height);
		
		if (i !== 0) {
			for (let j = 0; j < enemies.length; j++) {
				if (Distance(x, y, enemies[j].x, enemies[j].y) - 25 < 0) {
						//THIS NUMBER DETERMINES BOUNCE DISTANCE ^^^
					x = randomIntFromRange(canvas.width - canvas.width, canvas.width);
					y = randomIntFromRange(canvas.height - canvas.height, canvas.height);
					
					j = -1;
				}
			}
		}
		
		enemies.push(new Enemy(x, y, document.getElementById("enemy"), 50, 50));
	}

}



// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    
	player1.x = mouse.x;
	player1.y = mouse.y;
	player1.update();
	
	enemies.forEach(enemy => {
		enemy.update(enemies);
	});

}

init()
animate()
