
// declare global variables
var canvas = document.getElementById("myCanvas");
var contxt = canvas.getContext("2d");
var cartoonChar = new Image();
var tree = new Image();
var basket = new Image();
var redNum = 0;
var startRadiusOfFruit = 6;
var maxRadiusOfFruit = 30;
var FruitGrowthTime = 5000; // 5 seconds
var FruitHoldTimeBeforeFalling = 3000; // 3 seconds
var FruitFallingTime = 6000; // 6 seconds
var MaxFallHeight = 400; // Fruit can grow anywhere between treeY1_Boudry to treeY2_Boudry, This value is how much to fall from that point
var fruitColour = ["LawnGreen","orange","yellow"];
var fruitState = ["none", "growing", "ready", "falling", "caught", "missed"];
var HatCollisionCounter = 0;
var BasketCollisionCounter = 0;
var sc = 0;
var running = setInterval(game, 10);


var xp = 1;
var xp_add = 2;
var yp = 1;
var yp_add = 0;

setTimeout(function() {        // Set a timer
  clearInterval(running);      // Stop the running loop
  alert('Game over!');         // Let the user know, do other stuff here
}, 420000);                     // time in miliseconds before the game ends

var player = {
	x: 500,
	y: 530
};

var treeLocation = {
	x: 100,
	y: 0
};

var apple = {
	x: 100,
	y: 100,
	radius: 1,
	speed: 1,
	color: "red",
	state: "none"
};


var sound = new Audio('Minion Song.m4a');
sound.load();
	sound.loop = true;


	//var sound = new Audio('Minion Song.m4a');

	//	sound.load();
	//	sound.loop = true;
	//	sound.volume = RangeVolume;

		var soundHat = new Audio('Sad.m4a');
		soundHat.load();

		var soundBasket = new Audio('basket.mp3');
		soundBasket.load();

// Run this as soon as page loads
window.onload = init();



// run during initial page load
function init(){
	sound.play();
	cartoonChar.src = 'minon copy.png';
	tree.src = 'tree.png';
	basket.src = 'basket.png';
	document.addEventListener("keydown", move, false);
	treeX1_Boudry = treeLocation.x + 200; //300
	treeX2_Boudry = treeLocation.x + 500; //600
	treeY1_Boudry = treeLocation.y + 100; //100
	treeY2_Boudry = treeLocation.y + 400; //400
	apple.x = getRandX();
	apple.y = getRandY();
	console.log(treeX1_Boudry);
	console.log(treeX2_Boudry);
	console.log(treeY1_Boudry);
	console.log(treeY2_Boudry);
}

function getRandX(){
	//Math.floor(Math.random() * (max - min + 1)) + min
	return Math.floor(Math.random() * (treeX2_Boudry - treeX1_Boudry + 1)) + treeX1_Boudry;
}

function getRandY(){
	//Math.floor(Math.random() * (max - min + 1)) + min
	return Math.floor(Math.random() * (treeY2_Boudry - treeY1_Boudry + 1 )) + treeY1_Boudry;
}

function getBasketX(){
	return player.x+cartoonChar.width-10;
}

function getBasketY(){
	return player.y+80;
}
//--------------
function get1eye(){
	return player.x;
}

function getBasketLeftBoundry(){
	return getBasketX()+35;
}

function getBasketRightBoundry(){
	return getBasketX()+78;
}

function getBasketTopBoundry(){
	return getBasketY()+35;
}

function getBasketBottomBoundry(){
	return getBasketY()+20;
}

function getHatLeftBoundry(){
	return player.x;
}

function getHatRightBoundry(){
	return player.x+85;
}

function getHatTopBoundry(){
	return player.y+15;
}

function getHatBottomBoundry(){
	return player.y+2;
}

// game function will be called every 10 milliseconds
//setInterval(game,10);



// This function is called every time setInterval timer is set
function game(){
	contxt.clearRect(0, 0, canvas.width, canvas.height);
	contxt.drawImage(tree, treeLocation.x, treeLocation.y);
	contxt.drawImage(cartoonChar, player.x, player.y);
	contxt.drawImage(basket, getBasketX(), getBasketY());
	// state machine
	drawFruit();
	FruitGrowing();
	writeScore(sc);	
	FruitFalling();
	writeTimer();
	
	bigEye(player.x+20,player.y + 34);
	bigEye(player.x+55,player.y + 34);
	drawEyes(player.x + 18);
	drawEyes(player.x + 56);
}

function restart(){
	// setTimeout(function() {        // Set a timer
 //  clearInterval(running);  });
	location.reload();



}


var z = true;
function SoundOff(){
	sound.volume = 0;
	z = false;
}
function SoundOn(){
	sound.volume = 1;
	z = true;
}

// Function gets called on every key press event
function move(e){
	if(39 == e.keyCode && player.x < canvas.width-cartoonChar.width-basket.width){
		player.x += 10;
	}
	if(37 == e.keyCode && player.x > 0){
		console.log('x value' + player.x);
		player.x -= 10;
		
	}
	if(38 == e.keyCode && player.y > 410){
		console.log('y value' + player.y);
		player.y -= 10;
	}
	if(40 == e.keyCode && player.y < 700){
		console.log('y value' + player.y);
		player.y += 10;
	}
}

async function FruitGrowing() {
	// If fruit growing has just started then only start process
	if(apple.state == "none"){
		apple.state = "growing";
		for(var i = startRadiusOfFruit; i <= maxRadiusOfFruit; i++){
			// increase apple radius
			apple.radius = i;
			// this number decides apple growing speed which meets requirement
			await sleep(FruitGrowthTime/(maxRadiusOfFruit-startRadiusOfFruit));
		}
		if (z==false){
		sound.volume = 0;
	}else{
		sound.volume = 1;
	}
		// Wait for sometime before proceeding to falling accoring to spec
		await sleep(FruitHoldTimeBeforeFalling);
		
		apple.state = "ready";
	}
}

async function FruitFalling(){
	if(apple.state == "ready"){
		apple.state = "falling";
		
	

		// To achieve 6 second fix fall we need to use this
		for(var i=0; i<MaxFallHeight; i+=10){
			apple.y += 10;
			await sleep(FruitFallingTime/(MaxFallHeight/10));

			if(collisionWithHat() || collisionWithBasket()){
				console.log('Collision detected');
				//reset radius
				apple.radius = 0;
				// pick next random x,y co-ordinates to display apple
				apple.x = getRandX();
				apple.y = getRandY();
				console.log(apple.x + ' ' + apple.y);
				
				apple.state = "none";
				break;
			}
		}
			
		apple.state = "missed";
		
	}
	  
	if("missed" == apple.state && apple.y <= canvas.height-apple.radius){
		 console.log("reached to bottom");
		 //reset radius
		 apple.radius = 0;
		 // pick next random x,y co-ordinates to display apple
		 apple.x = getRandX();
		 apple.y = getRandY();
		 console.log(apple.x + ' ' + apple.y);
		 
		 apple.state = "none";
	}
}

function drawFruit(){
	contxt.beginPath();
	contxt.arc(apple.x, apple.y, apple.radius, 0, Math.PI * 2);
	if (apple.radius == maxRadiusOfFruit){
		contxt.fillStyle = fruitColour[1];
	} else {
		contxt.fillStyle = fruitColour[0];
	}
	contxt.fill();
	contxt.closePath();
}


  

function collisionWithHat(){
	//console.log('apple.x' + apple.x + ' >= getHatLeftBoundry()' + getHatLeftBoundry());
	//console.log('apple.x' + apple.x + ' <= getHatRightBoundry()' + getHatRightBoundry());
	// If apple is falling in same x axis as hat
	if(apple.x >= getHatLeftBoundry() && apple.x <= getHatRightBoundry()){
		if((apple.y + apple.radius) <= getHatTopBoundry() && (apple.y + apple.radius) >= getHatBottomBoundry()){
			HatCollisionCounter = HatCollisionCounter + 1;
			//console.log('Hat Collision detected => ' + HatCollisionCounter);
			
			sc-=1;
			sound.volume=0;
			writeScore(sc);	
			//playSound('Sad.m4a');
			soundHat.play();
			show();
			return true;
			
		}
	}
	return false;
}

function collisionWithBasket(){
	//console.log('apple.x' + apple.x + ' >= getHatLeftBoundry()' + getBasketLeftBoundry());
	//console.log('apple.x' + apple.x + ' <= getHatRightBoundry()' + getBasketRightBoundry());
	// If apple is falling in same x axis as hat
	if(apple.x >= getBasketLeftBoundry() && apple.x <= getBasketRightBoundry()){
		if((apple.y + apple.radius) <= getBasketTopBoundry() && (apple.y + apple.radius) >= getBasketBottomBoundry()){
			BasketCollisionCounter = BasketCollisionCounter + 1;
			//console.log('Basket Collision detected => ' + BasketCollisionCounter);
			
			sc+=1;
			sound.volume=0;
			writeScore(sc);
			//playSound('hat.mp3');
			soundBasket.play();
			show1();
			return true;
			
		}
	}
	return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function writeScore(sc) {
	 // Transparent black text
		 contxt.font = '24px "Segoe UI"';
		 contxt.fillStyle = "red";
		 contxt.fillText("Score: " +sc, 20, 100);
		 }

function writeTimer() {
	 // Transparent black text
		 contxt.font = '24px "Segoe UI"';
		 contxt.fillStyle = "red";
		 contxt.fillText("Minutes: 7 " , 20, 130);
		 }


		 function playSound(soundfile) {
	
		document.getElementById("dummy").innerHTML=
    "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
	}

var x;
	function show(){
 x= 	document.getElementById("d");
	x.style.display= "block";
	//z();
	if (x.style.display=="block"){
		setTimeout(function() {        
  clearInterval(show);      
  x.style.display="none";         
}, 3000);
	}


	}


	var y;
	function show1(){
 y= 	document.getElementById("s");
	y.style.display= "block";
	//z();
	if (y.style.display=="block"){
		setTimeout(function() {        
  clearInterval(show);     
  y.style.display="none";         
}, 3000);
	}


	}

function bigEye(x,y){
	contxt.beginPath();
contxt.arc(x,y,16,0,Math.PI * 2,true);
contxt.fillStyle="white";
contxt.fill();
contxt.strokeStyle="black";
contxt.lineWidth="2";
contxt.stroke();
}

function drawEyes(x){
contxt.beginPath();
contxt.arc(x + xp,(player.y + 35) + yp,5,0,Math.PI * 2,true);
contxt.fillStyle="black";
contxt.fill();
contxt.strokeStyle="Green";
contxt.lineWidth="2";
contxt.stroke();
 }

 function moveEyes(){
 	xp +=xp_add;
 	yp += yp_add;
 	if (xp > 9) xp_add = -xp_add;
 	if (xp <- 8) xp_add = - xp_add;
 	if(yp > 20 || xp < 0)yp_add=-yp_add;
 	xp+=xp_add;
 	yp+=yp_add;

 }
 setInterval(moveEyes,1000);



