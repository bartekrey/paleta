//source for data load in
//var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1YA618b11VTKyFVs_1j-IgV_aCOEzRtfhqmVVb_trKKQ/edit?usp=sharing';

//text color
var text_color = 0;
var strokevar = 0;

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
var h = 8000;

//background color
var bg_col = 300;

//define var for array that will store each pasek separately
var boxes = {};
var kwadrats = {};
var boxes_graph = {};
var move_Y = [];

//define flag to determine if blocks will be in expanding moment
var expanding = false;
var start_draw = false;

//set how many squares to change view there are
var kwardat_count = 10;
//set size of kwadrat
var kwardat_side = 90;
//set kwadrat x position
var kwardat_X = 1400;






function init() {
	/*
	if (window.localStorage.getItem("testJSON") != null) {
		window.localStorage.removeItem("testJSON");
	}
	//console.log("function init start");
	Tabletop.init( { key: publicSpreadsheetUrl,
							callback: usedata,
							simpleSheet: true 
			} )
			
	//console.log("function init end");
	*/
	//usedata();
}

var myJSON = {};

window.addEventListener('DOMContentLoaded', init)

//function usedata(data) {
	
function usedata() {
	//console.log("function use data start");
	//console.log(data);
	//saveJSON(data, 'jasiekdata.json');
	
	//myJSON = JSON.stringify(data);
	//window.localStorage.setItem("testJSON", myJSON);
	
	//generate title line in "title_grapgic" offscreen - this is not shown on canvas yet
	title_line ();
	
	// count global vars that need to be counted at webapge start
	text_place = boxsize - (boxsize - textsizenum)/2 ;
	//console.log("text_place:",text_place);
	
	
	//load in data to 
	//testdane = JSON.parse(window.localStorage.getItem('testJSON'));
	//testdane = filejson1;
	//testdane = testdane2
	console.log(testdane);
	
	start_boxes();
	start_kwardat();
	start_draw = true;
	redraw();
	
	//console.log("function use data end");
}


function title_line () {
	//console.log("title_line start");
	
	title_graphic = createGraphics(1100,100);
	title_graphic.background(bg_col);

	//title_graphic.textAlign(CENTER, CENTER);
	title_graphic.textSize(23)
	//push();
		title_graphic.stroke(strokevar);
		//title_graphic.noStroke();
		title_graphic.fill(text_color);
		title_graphic.text("PANTONE",0, 0, 106, 32);
		//title_graphic.fill(200);
		//title_graphic.rect(0,0,106,32);
		//title_graphic.fill(text_color);
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

	title_img = title_graphic.get();
	//pop();
	
	//console.log("title_line end");
}

//var filejson1 = []; // Global object to hold results from the loadJSON ca

function preload() {
	//filejson1 = loadJSON('assets/jasiekdata.json');
	//filejson1 = loadStrings('assets/jasiekdata.txt');
}


function setup(data) {
	//console.log("function setup start");
	frameRate(60);
	//console.log(publicSpreadsheetUrl);
	//console.log("filejson1:",filejson1);
	//console.log("testdane2:",testdane2);
	noStroke();
	createCanvas(w, h);

	//console.log("function setup end");
	noLoop();
	usedata();
}

function start_boxes() {
	//console.log("function start_boxes start");
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
			//boxes[i].bar_img.save('photo'+i, 'png');
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
	//console.log(boxes);
	//console.log("function start_boxes end");	
}


function start_kwardat() {
	
	push();
	
	for (i = 0; i < kwardat_count; i++) {
			if (i <= 4) { kwadrats[i] = new kwardat(kwardat_side,kwardat_X,43+i*kwardat_side,25+i*25,255);};
			if (i > 4) { kwadrats[i] = new kwardat(kwardat_side,kwardat_X,43+i*kwardat_side,25+i*25,0);};			
			
			kwadrats[i].makeimg();
		};		

	pop();
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
	//click not during expanding
	if (expanding == false) {
		
		clicked_klaster = 0;
		
		for (i = 0; i < testdane.length; i++) {
			
			//identify button - not expanded case
			if (
					typeof boxes[i] != "undefined" 
					&& boxes[i].expanded == false 
					&& mouseX >= boxes[i].x 
					&& mouseX <= boxes[i].x +1100
					&& mouseY >= boxes[i].y 
					&& mouseY <= boxes[i].y +60
					&& boxes[i].display_block == true		
				) { 
					

					clickclusmax = boxes[i].maxcluster;
					//console.log("boxes[i].maxcluster:",clickclusmax);
					
					//only affect boxes that have more then 1 cluster
					if (boxes[i].maxcluster > 1) {
				
						clicked_klaster = testdane[i].Klaster;
						clicked_box = i;
						boxes[i].expanded = true;	
						
						//console.log("clicked box:",i);
						//console.log("clicked klaster:",clicked_klaster);
						//set expanded in each box
						/*for (m = 0; m <= boxes.length; m++) {
							if (boxes[m].klaster == clicked_klaster) {
									boxes[m].expanded = true;
								};
							};
						};*/
						
						for (g = 0; g < testdane.length; g++) {
			
							if (boxes[g].klaster == clicked_klaster) {
									boxes[g].expanded = true;
							};
			
							//boxes below clicked cluster - move them 
							if (boxes[g].klaster > clicked_klaster) { 
				
								var expand_y = JSON.parse(JSON.stringify(boxes[g].deafultY+(clickclusmax-1)*60));
								
								boxes[g].y = expand_y;
								boxes[g].deafultY = expand_y;

							};
						
				
							//clicked box 
							if ( boxes[g].klaster == clicked_klaster) { 
							//show boxes under main box
								boxes[g].display_block = true;	
							};

								
								//last box (doesnt have any boxes below it
							//if (boxes[i].klaster == boxes[testdane.length-1].klaster) 
								
						};	
					};
	
					redraw();
					
				};
			
			
			//identify button - expanded case	
			
			if  (	
					typeof boxes[i] != "undefined" 
					&& boxes[i].expanded == true
					&& mouseX >= boxes[i].x 
					&& mouseX <= boxes[i].x +1100
					&& mouseY >= boxes[i].y && mouseY <= boxes[i].y +60
					&& boxes[i].display_block == true		
				) { 
					//console.log("clicked on expanded bar");	
					//clicked_box = i;
					//console.log("clicked box:",i);
					clicked_klaster = testdane[i].Klaster;
					clickclusmax = boxes[i].maxcluster;
					//console.log("clicked box full:",boxes[i]);
					//console.log("clicked box x full:",boxes[i].x);
					//clicked_box = boxes[i];
					//clicked_box_x = boxes[i].x;
					//clicked_box_y = boxes[i].y;
					
					//console.log("clicked box:",clicked_box,"clicked box x:",clicked_box_x,"clicked box y:",clicked_box_y );
					
					let first_box = new pasek();
					let clicked_box = new pasek();
					
					let first_box_index = 0;
					for (m = 0; m < testdane.length; m++) {
						//find first box in claster
						//console.log("boxes[m].klaster:",boxes[m].klaster, "clicked_klaster", clicked_klaster);
						//console.log("boxes[m].NrWKlastrze:",boxes[m].NrWKlastrze);
						if (boxes[m].klaster == clicked_klaster && boxes[m].NrWKlastrze == 1) {
							//console.log("FOUND first box:",m );
							first_box_index = m;
							
							//first_box = boxes[m];
							//var first_box_x = boxes[m].x ;
							//var first_box_y = boxes[m].y ;
							
							//console.log("first box:",first_box,"first box x:",first_box_x,"first box y:",first_box_y );					
							//boxes[m].x = clicked_box_x;
							//boxes[m].y = clicked_box_y;
						};
					};

					first_box = boxes[first_box_index];
					clicked_box = boxes[i];
					clickclusmax = boxes[i].maxcluster;
					
					
					//console.log("first box:",first_box );
					//console.log("clicked box:",clicked_box );
					
					var cloned_first_box_y = JSON.parse(JSON.stringify(first_box.y));
					var cloned_clicked_box_y = JSON.parse(JSON.stringify(clicked_box.y));
					
					var cloned_first_box_NRWK = JSON.parse(JSON.stringify(first_box.NrWKlastrze));
					var cloned_clicked_box_NRWK = JSON.parse(JSON.stringify(clicked_box.NrWKlastrze));
					
					
					//console.log("cloned_first_box_y:",cloned_first_box_y );
					//console.log("cloned_clicked_box_y:",cloned_clicked_box_y );
					
					boxes[i] = first_box;
					boxes[first_box_index] = clicked_box;
					
					
					boxes[i].y = cloned_clicked_box_y;
					boxes[i].deafultY = cloned_clicked_box_y;
					boxes[i].NrWKlastrze = cloned_clicked_box_NRWK;
					
					boxes[first_box_index].y = cloned_first_box_y;
					boxes[first_box_index].deafultY = cloned_first_box_y;
					boxes[first_box_index].NrWKlastrze = cloned_first_box_NRWK;
					

					for (z = 0; z < testdane.length; z++) {
						//console.log("set false to expanded:",boxes[z].klaster,clicked_klaster );
						if (boxes[z].klaster > clicked_klaster) { 
			
							//console.log("boxes[z]");					
							//console.log("clickclusmax:",clickclusmax,"boxes[z].deafultY:",boxes[z].deafultY,"=", boxes[z].deafultY-(clickclusmax-1)*60);
							boxes[z].y=boxes[z].deafultY-(clickclusmax-1)*60;
							boxes[z].deafultY = boxes[z].y;
							//console.log("boxes[z].y",boxes[z].y);
						};					
					
											
						if (boxes[z].klaster == clicked_klaster) {
							
						//console.log("set false to expanded:",boxes[z].expanded );
							boxes[z].expanded = false;
							
						};
						
						
						if (boxes[z].klaster == clicked_klaster && boxes[z].NrWKlastrze != 1) {
							boxes[z].display_block = false;
						};
					};
					//console.log("first box:",first_box,"first box x:",first_box_x,"first box y:",first_box_y );					
					//console.log("clicked box:",clicked_box,"clicked box x:",clicked_box_x,"clicked box y:",clicked_box_y );					
					
					//boxes[clicked_box] = first_box;
					//boxes[clicked_box].x = first_box_x;
					
					//boxes[clicked_box].y = first_box_y;
					//console.log("all boxes:",boxes );	
					//console.log("boxes:",boxes);
					redraw();
			};
		};
	};


	for (k = 0; k < kwardat_count; k++) {
				
		if (
				typeof kwadrats[k] != "undefined" 
				&& mouseX >= kwadrats[k].x 
				&& mouseX <= kwadrats[k].x + kwardat_side
				&& mouseY >= kwadrats[k].y 
				&& mouseY <= kwadrats[k].y + kwardat_side 	
			) { 
				bg_col = kwadrats[k].bg;
				text_color = kwadrats[k].txtcol;
				if (k < 5) {strokevar = 255};
				if (k >= 5) {strokevar = 0};
				
				console.log("bg_col:",bg_col);
				console.log("text_color:",bg_col);
				console.log("text_color:",kwadrats[k]);
				title_line();
				//image(title_graphic, titxoffset, 43);
				//console.log("bg_col:",bg_col);
				//console.log("text_color:",bg_col);
				
				for (k1 = 0; k1 < testdane.length; k1++) {
					boxes[k1].makegraphic();
					boxes[k1].savtopic();
					//console.log("boxes[",k1,"]:",boxes[k1]);
				}
				
				redraw();
			};
	}
						
	
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
			image(title_img, 180, 0);
		pop();


		for (i = 0; i < testdane.length; i++) {
			boxes[i].display();
		};
		
		for (b = 0; b < kwardat_count; b++) {
			kwadrats[b].display();
			//console.log(kwadrats[b]);
		};		
	};

	//show fps in corner
	let fps = frameRate();
	push();
		stroke(0);
		fill(text_color);
		text("FPS: " + fps.toFixed(2), 30, 30);	
	pop()
	
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
			this.textcol = text_color;
			
			this.display_block = disp;
			this.opacity = opa;
			this.bar_graphic = createGraphics(1400,60);
			this.bar_img =createImage(1400, 60);
			this.expanded = false;
			this.maxcluster = 0;
			//this.length = testdane.length;
	}
	

	makegraphic() {
		push()
		console.log("text_color:",text_color);
		this.bar_graphic.textSize(textsizenum);

		this.bar_graphic.fill(text_color);
		this.bar_graphic.push();
		this.bar_graphic.stroke(strokevar);
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
		this.bar_graphic.pop();
		
		this.bar_graphic.noStroke();
		this.bar_graphic.fill (this.hex1);
		this.bar_graphic.rect (0+410+z, 0, 280, boxsize);
		this.bar_graphic.fill (this.hex2);
		this.bar_graphic.rect (0+690+z, 0, 280, boxsize);
		this.bar_graphic.fill (text_color);
		this.bar_graphic.stroke(strokevar);
		this.bar_graphic.text (this.hex2, 0+1012+z, 0 + text_place);	
		pop();
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



class kwardat {
	
	constructor (side,x,y,bg,inp_txt_col) {
			this.x = x;
			this.y = y;
			this.side = side;


			this.bg = bg;
			this.txtcol = inp_txt_col;
			
			this.sq_graphic = createGraphics(side,side);
			this.sq_img =createImage(side, side);

	}
	

	makeimg() {

		this.sq_graphic.noStroke();
		this.sq_graphic.fill(this.bg);
		//this.bar_graphic.noStroke();
		this.sq_graphic.rect(0, 0, this.side, this.side);
		this.sq_img = this.sq_graphic.get();

	}
	

	display() {
		
			image(this.sq_img, this.x, this.y);

	}
	
	
	
}






