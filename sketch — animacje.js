//source for data load in
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1YA618b11VTKyFVs_1j-IgV_aCOEzRtfhqmVVb_trKKQ/edit?usp=sharing';

//text color
var text_color = 0;

//vars for storing transformation coordinates
var transformX = 0;
var transformY = 0;

//wysokosc paska
var boxsize = 60;

//wielkosc czcionki
var textsizenum = 22;

//x offset of bars
var xoffset = 104;
//x offset of title
var titxoffset = 180;

//resolution
var w = 1536 /*window.innerWidth*/;
var h = 3000;

//background color
var bg_col = 200;

//define var for array that will store each pasek separately
var boxes = {};
var boxes_graph = {};
var move_Y = [];

//define flag to determine if blocks will be in expanding moment
var expanding = false;
var start_draw = false;





function init() {
	if (window.localStorage.getItem("testJSON") != null) {
		window.localStorage.removeItem("testJSON");
	}
	console.log("function init start");
	Tabletop.init( { key: publicSpreadsheetUrl,
							callback: usedata,
							simpleSheet: true 
			} )
			
	console.log("function init end");
	
}

var myJSON = {};

window.addEventListener('DOMContentLoaded', init)

function usedata(data) {
	console.log("function use data start");
	console.log(data);
	myJSON = JSON.stringify(data);
	//saveJSON(data, 'jasiekdata.json');
	window.localStorage.setItem("testJSON", myJSON);
	
	//generate title line in "title_grapgic" offscreen - this is not shown on canvas yet
	title_line ();
	
	// count global vars that need to be counted at webapge start
	text_place = boxsize - (boxsize - textsizenum)/2 ;
	console.log("text_place:",text_place);
	
	
	//load in data to 
	testdane = JSON.parse(window.localStorage.getItem('testJSON'));
	//testdane = filejson1;
	//testdane = testdane2
	console.log(testdane);
	
	start_boxes();
	start_draw = true;
	redraw();
	
	console.log("function use data end");
}

function pasekf(pantone, ncs, hex1, hex2) {

	//belt_graphic = createGraphics(1500,60);
	//background(300);

	textSize(textsizenum);
	//belt_graphic.textAlign(CENTER, CENTER);
    fill (text_color);
	
    text (pantone, 0, text_place );
    text (ncs, 148, text_place);
    text (hex1, 304, text_place);
    fill (hex1);
    rect (410, 0, 280, boxsize);
    fill (hex2);
    rect (690,0,280, boxsize);
    fill (text_color);
    text (hex2, 1012, text_place);
  }
  
function title_line () {
	console.log("title_line start");
	
	title_graphic = createGraphics(1100,100);
	title_graphic.background(bg_col);

	//title_graphic.textAlign(CENTER, CENTER);
	title_graphic.textSize(23)
	push();
		title_graphic.fill(text_color);
		title_graphic.text("PANTONE",0, 0, 106, 32);
		//title_graphic.fill(200);
		//title_graphic.rect(0,0,106,32);
		title_graphic.fill(text_color);
		title_graphic.translate(106+42,0);
		title_graphic.text ("NCS", 0, 0, 45, 32);
		title_graphic.translate(45+111,0);	
		title_graphic.text ("HEX", 0, 0, 43, 32);
		title_graphic.translate(43+78,0);	
		title_graphic.text ("Full Vision Color", 0, 0, 173, 32);
		title_graphic.translate(173+107,0);	
		title_graphic.text ("Deuteranopia", 0, 0, 154, 32);
		title_graphic.translate(154+170,0);	
		title_graphic.text ("HEX", 0, 0, 43, 32);		
	pop();
	
	console.log("title_line end");
}


function bar_graphicf(bar_graphic,klaser, pantone, ncs, hex1, hex2) {
	//console.log("bar_graphic start");
	
	bar_graphic = createGraphics(1400,60);
	bar_graphic.textSize(textsizenum);

	bar_graphic.fill (text_color);
	
	let z = 76;
	//nr klastra
	bar_graphic.text(klaser, 0, 0 + text_place );
	
	//pasek
	bar_graphic.rect(43, 0, 3, boxsize);
	
	//text pantone
	bar_graphic.text(pantone, 0+z, 0 + text_place );
	
	//text ncs
	bar_graphic.text(ncs, 0+148+z, 0 + text_place);
	
	//text HEX #1
	bar_graphic.text (hex1, 0+304+z, 0 + text_place);
	
	bar_graphic.fill (hex1);
	bar_graphic.rect (0+410+z, 0, 280, boxsize);
	bar_graphic.fill (hex2);
	bar_graphic.rect (0+690+z, 0, 280, boxsize);
	bar_graphic.fill (text_color);
	bar_graphic.text (hex2, 0+1012+z, 0 + text_place);		
}


//var filejson1 = []; // Global object to hold results from the loadJSON ca

function preload() {
	//filejson1 = loadJSON('assets/jasiekdata.json');
	//filejson1 = loadStrings('assets/jasiekdata.txt');
}


function setup(data) {
	console.log("function setup start");
	frameRate(60);
	//console.log(publicSpreadsheetUrl);
	//console.log("filejson1:",filejson1);
	//console.log("testdane2:",testdane2);
	noStroke();
	createCanvas(w, h);

	console.log("function setup end");
	noLoop();
}

function start_boxes() {
	console.log("function start_boxes start");
	push();
	
	//draw title, move it down, save value moved to transformY
	transformY=transformY+43;
	image(title_graphic, titxoffset, 43);
	
	//set start position for drawing boxes
	transformX=transformX+xoffset;
	transformY=transformY+66;
	transformY_box  = 0;
	
	for (i = 0; i < testdane.length; i++) {
		
		if (testdane[i].NrWKlastrze == 1 ) { 
			transformY_box = transformY;
			boxes[i] = new pasek(transformY,parseInt(testdane[i].Klaster),parseInt(testdane[i].NrWKlastrze), testdane[i].PANTONE, testdane[i].NCS, "#"+testdane[i].HexFullVision, "#"+testdane[i].HexDeuteranopia, true,1);
			boxes[i].makegraphic();
			boxes[i].savtopic();
			boxes[i].bar_img.save('photo'+i, 'png');
			transformY=transformY+boxsize+30;
			//bar_graphicf(boxes_graph[i],parseInt(testdane[i].Klaster), testdane[i].PANTONE, testdane[i].NCS, "#"+testdane[i].HexFullVision, "#"+testdane[i].HexDeuteranopia);
			//console.log("boxes graph:",boxes_graph[i]);
		};		
		

		if (testdane[i].NrWKlastrze != 1 ) { 
		//vector to move hidden bars
			transformY_box += boxsize;
			transformY_hid=transformY_box;
			//console.log("transformY_box:",transformY_box,"transformY_hid:",transformY_hid);	
			boxes[i] = new pasek(transformY_hid, parseInt(testdane[i].Klaster),parseInt(testdane[i].NrWKlastrze),testdane[i].PANTONE, testdane[i].NCS, "#"+testdane[i].HexFullVision, "#"+testdane[i].HexDeuteranopia, false,0);
			boxes[i].makegraphic();
			boxes[i].savtopic()
		};
		
	};
	
	
	checkmaxclus();
	
	pop();
	console.log(boxes);
	console.log("function start_boxes end");	
}

function checkmaxclus() {
	
	for (i = 0; i < testdane.length; i++) {
		for (j = 0; j < 100; j++) {
			if (typeof testdane[i+j] != "undefined") {
				if (testdane[i].Klaster == testdane[i+j].Klaster) {
					boxes[i].maxcluster = parseInt(testdane[i+j].NrWKlastrze);
					//console.log("i:",i,"j:",j,"testdane[i+j].NrWKlastrze:",testdane[i+j].NrWKlastrze);
				};
			};
		};	
	};
}	


function mousePressed() {
	if (expanding == false) {
		
		clicked_klaster = 0;
		
		for (i = 0; i < testdane.length; i++) {
			
			if (typeof boxes[i] != "undefined" && boxes[i].expanded == false) {
			
				if (	   mouseX >= boxes[i].x && mouseX <= boxes[i].x +1100
						&& mouseY >= boxes[i].y && mouseY <= boxes[i].y +60
						&& boxes[i].display_block == true		) { 
					

					clickclusmax = boxes[i].maxcluster;
					console.log("boxes[i].maxcluster:",clickclusmax);
					
					
					if (boxes[i].maxcluster > 1) {
						
						expanding = true;
						clicked_klaster = testdane[i].Klaster;
						clicked_box = i;
						boxes[i].expanded = true;					
						console.log("clicked box:",i);
						console.log("clicked klaster:",clicked_klaster);
						life = 0
						//set expanded in each box
						/*for (m = 0; m <= boxes.length; m++) {
							if (boxes[m].klaster == clicked_klaster) {
									boxes[m].expanded = true;
								};
							};
						};*/
						

						loop();
					};
				};
				
			if (clicked_klaster == boxes[i].klaster) {
				boxes[i].display_block = true;	
			};
				
			};
		};
	};
}



function draw() {
	frameRate(60);
	console.log("deltaTime:",deltaTime);
	
	if (start_draw == true) {
		
		let transformY = 0;
		let transformX = 0;
		
		background(bg_col);
		
		push();
			transformY+43;
			translate(0,43);
			image(title_graphic, 180, 0);
		pop();

		if (expanding === false) {
			
			for (i = 0; i < testdane.length; i++) {

				if ( boxes[i].display_block == true ) { 
				//console.log("i:",i,"boxes nr:",boxes[i].nr ,"boxes graph:",boxes_graph[i]);
					boxes[i].display();

				};
			};
		};

		//expanding logic
		if (expanding === true) {
			for (i = 0; i < testdane.length; i++) {
			
				//boxes above clicked klaster - just show them
				if ( boxes[i].klaster < clicked_klaster) { 
					boxes[i].display();
				};			
			
				//boxes below clicked cluster - move them 
				if (boxes[i].klaster > clicked_klaster) { 
	
					//since no drawing - delta time will be big in first draw run, to omit it - condition that deltaTime must be smaller then 30
					if (deltaTime > 20 ) {}
					else {
						//moving boxes speed - depended on max number of boxes in cluster
						boxes[i].y += clickclusmax * 2 * (deltaTime / 20);
						
						
					};
					
					//when boxes reach desitnation point - stop them and set them to exact position, boxes are no longer expanding
					if (boxes[i].y>=boxes[i].deafultY+(clickclusmax-1)*60) {
						//console.log("boxes[",i,"]:",boxes.length,"KONIEC");
						expanding = false;
						boxes[i].y=boxes[i].deafultY+(clickclusmax-1)*60;
						boxes[i].deafultY = boxes[i].y;
						
						noLoop();
						//set expanded in each box after reached end of expanding
						for (m = 0; m < testdane.length; m++) {
							//console.log("boxes[",m,"]:",boxes[m].klaster);
							if (boxes[m].klaster == clicked_klaster) {
									boxes[m].expanded = true;
									//console.log("boxes[",m,"]:",boxes[m]);
							};
						};
					};
					
					boxes[i].display();
				};
				
				
				//clicked box 
				if ( boxes[i].klaster == clicked_klaster) { 
				
				//show boxes under main box
					if  (boxes[i].NrWKlastrze !== 1) {
						//life = (life >= 0) ? life += 30 : 255
						push();
						tint(255, life); 
						life = (life >= 0) ? life += 5 : 255
						boxes[i].display_block = true;	
						boxes[i].display();
						
						if (expanding == false){
							
						}
						pop();

					}
					else {
						boxes[i].display();
					};
					
					//last box (doesnt have any boxes below it
					if (boxes[i].klaster == boxes[testdane.length-1].klaster) {
						expanding = false;
						noLoop();
					};
					
				};	
			};
		};
		
	}

	//show fps in corner
	let fps = frameRate();
	fill(0);
	stroke(0);
	text("FPS: " + fps.toFixed(2), 30, 30);	
	
}


class pasek {
	
	constructor (transY,klaser, NrWKlastrze, pantone, ncs, hex1, hex2, disp, opa) {
			this.nr = i;
			this.x = transformX;
			this.y = transY;
			this.deafultY = transY;
			this.width = 1085;
			this.heigth = boxsize;

			this.klaster = klaser;
			this.NrWKlastrze = NrWKlastrze;
			this.pantone = pantone;
			this.ncs = ncs;
			this.hex1 = hex1;
			this.hex2 = hex2;
			this.textsizenum = textsizenum;
			this.text_place = this.y + text_place;
			this.text_color = text_color;
			
			this.display_block = disp;
			this.opacity = opa;
			this.bar_graphic = createGraphics(1400,60);
			this.bar_img =createImage(1400, 60);
			this.expanded = false;
			this.maxcluster = 0;
			//this.length = testdane.length;
	}
	

	makegraphic() {

		this.bar_graphic.textSize(textsizenum);

		this.bar_graphic.fill(text_color);
		
		let z = 76;
		//nr klastra
		this.bar_graphic.text(/*this.klaster*/this.nr, 0, 0 + text_place );
		
		//pasek
		this.bar_graphic.rect(43, 0, 3, boxsize);
		
		//text pantone
		this.bar_graphic.text(this.pantone, 0+z, 0 + text_place );
		
		//text ncs
		this.bar_graphic.text(this.ncs, 0+148+z, 0 + text_place);
		
		//text HEX #1
		this.bar_graphic.text (this.hex1, 0+304+z, 0 + text_place);
		
		this.bar_graphic.fill (this.hex1);
		this.bar_graphic.rect (0+410+z, 0, 280, boxsize);
		this.bar_graphic.fill (this.hex2);
		this.bar_graphic.rect (0+690+z, 0, 280, boxsize);
		this.bar_graphic.fill (text_color);
		this.bar_graphic.text (this.hex2, 0+1012+z, 0 + text_place);	
	}
	
	savtopic() {
		this.bar_img = this.bar_graphic.get();
	}	
	

	display() {
		if (this.display_block == true) {
			image(this.bar_img, this.x, this.y);
		};

	}
	
	
	
}
	





