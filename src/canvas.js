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

function getDistance(x1, y1, x2, y2) {
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;
	
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Objects
function Sprite(x, y, img, width, height) {
    this.x = x
    this.y = y
    this.img = img
    this.dWidth = width
    this.dHeight = height
}

Object.prototype.draw = function() {
    c.beginPath()
    c.drawImage(this.img, this.x, this.y, this.dWidth, this.dHeight)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
}

Object.prototype.update = function() {
    this.draw()
}

// Implementation
let sprite1;
function init() {
	sprite1 = new Sprite(undefined, undefined, document.getElementById("blackdog"), 50, 50);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    
	sprite1.x = mouse.x;
	sprite1.y = mouse.y;
	sprite1.update();
	

}

init()
animate()
