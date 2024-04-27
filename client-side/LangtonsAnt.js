let canvas = document.getElementById("antField");
let width = 64;
let height = 64;
let rate = 100;
//y-pos, x-pos, dir (0up, 1right, 2down, 3left)
let ants = [[height/2, width/2, 0, "Green"],
			[height/2, width/2, 1, "Black"],
			[height/2, width/2, 2, "Red"],
			[height/2, width/2, 3, "Blue"]
		   ];
//init field with background color
const background = "#FFFFFF";
let field = new Array(height);
for(let i=0; i<height; i++){
	field[i] = new Array(width);
	for(let j = 0; j < width; j++) field[i][j] = background;
};

function draw(verbose=false) {
    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerHeight*.9;
        let cellWidth = canvas.width / width;
        let cellHeight = canvas.height / height;

        field.forEach((row, i) => {
            row.forEach((col, j) => {
                ctx.fillStyle = col;
                ctx.fillRect(Math.round(j*cellWidth),Math.round(i*cellHeight), cellWidth+1, cellHeight+1);
            });
        });
    }
};

function step() {
	ants.forEach((ant,i)=>{
		let y = ant[0];
		let x = ant[1];
		let dir = ant[2];
		let col = ant[3];
		//switch dir based on field
		dir += field[y][x]===background?1:3;
		dir %= 4;
		//flip field
		field[y][x] = (field[y][x]===background)?col:background;
		//move
		if (dir===0) y += height-1;
		if (dir===1) x += 1;
		if (dir===2) y += 1;
		if (dir===3) x += width-1;
		y %= height;
		x %= width;
		ants[i] = [y,x,dir,col];
	});
};

function main() {
	let title = document.getElementById("title");

	// use server-side js
	fetch('http://127.0.0.1:3000/name', {
		method: 'GET',
		headers: {'x-auth-token':'valid'}})
	.then(response => response.text())
	.then(name => {
		title.value = name;})
	.catch(error => title.value = "Server not responding...");

	let slider = document.getElementById("simRate");
	slider.value = rate;
	let rateText = document.getElementById("rateField");
	let toggle = document.getElementById("toggle");
	toggle.value = "Pause";
	rateText.value = "Rate: "+rate;
	
	simInterval = setInterval(() => {
		step();
	}, 1000/rate);
	simInterval;

	let fps = 30;
	setInterval(() => {
		draw();
	}, 1000/fps);

	slider.oninput = function() {
		toggle.value = "Pause";
		paused = false;
		rate = this.value; //update value
		rateText.value = "Rate: "+rate; //show it

		simInterval2 = setInterval(() => {
			step();
		}, 1000/rate); //use it
		clearInterval(simInterval); //clear old drawing
		simInterval2; //start new drawing
		simInterval = simInterval2; //save ID for later clearings
		serialized = JSON.stringify(field);
		console.log(serialized);
	} 

	let paused = false;
	toggle.onclick = function() {
		if (!paused) {
			paused = true;
			clearInterval(simInterval);
			rateText.value = "Rate: 0";
			toggle.value = "Resume";
			slider.value = 0;
			slider.disable = true;
		}
		else {
			paused = false;
			simInterval = setInterval(() => {
				step();
			}, 1000/rate);
			simInterval;
			rateText.value = "Rate: "+rate;
			toggle.value = "Pause";
			slider.value = rate;
		};
	};
};

main();