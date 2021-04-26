
///////////////////////////////////////////////////////////////////////////
// Object rand
rand.seed = 1

function rand()
{
    rand.seed = (rand.seed*9301+49297) % 233280;
	return rand.seed/(233280.0);
}

///////////////////////////////////////////////////////////////////////////

function addNewPath (pathGeometry)
{
	return;
}

// The current Deco version always expects the first exposed object to be an
// obstacle, even if it is not used, like in this model.
Engine.exposeGeometry ("brush path", "addNewPath");


///////////////////////////////////////////////////////////////////////////
// Define Module's default geometry and expose it so that it can be changed

// define default geometry
var frame = new Frame2()
var geometry = new Geometry()
geometry.addPoint()

// I defined Module.geometry as an array. With a small change in update method,
// you can add to the array, instead of replacing the first symbol. Then by
// adding new elements you will be brushing all of them at once not just
// the one you added last.
Module.geometry = new Array()
Module.geometry[0] = geometry
Module.geometry[1] = geometry


var defaultGeometry = true;

var lastUpdate = 0;
var currentStrokeColor = new Vector3 (0,0,0);
var currentFillColor = new Vector3 (0,0,0);


///////////////////////////////////////////////////////////////////////////
// Object Module
Module.fbrushWidth = 0.25;
Module.fbrushHeight = 0.25;
Module.fbrushAngle = 0;
Module.isymbolRandomScale = 0;
Module.icalligraphic = 1;


Module.fsymbolScalex = 1;
Module.fsymbolScaley = 1;
Module.fsymbolRotate1 = 0;
Module.fsymbolRotate2 = 0;
Module.isymbolRotate = 1;
Module.isymbolRandomRotate = 0;

var mouseInfo = 0;
var index = 1;

var makeNewGroup = false
//RenderAPI.command (kCommandNewGroup)

function Module (frame)
{
	this.frame = frame;
	this.geometry = Module.geometry;
	this.index = index++;
	this.seed = -1;
	this.pressure = 30;
	this.bearing = 0;
	this.lastUpdate = 0;
	this.visible = 0;

	//Engine.error ("adding module ", this.index);
	
	Engine.addModule (this); // We have to add module before setting its parameters
	Engine.setModuleParameter (this, "call", "render", 0);
	Engine.setModuleParameter (this, "save render calls", 0);
}


var lastPositionValid = 0;
var lastPosition;

Module.prototype.produce = function (system)
{
	// Get mouse info
	mouseInfo = EnvironmentBrush.query (kBrushGetMouseInfo);

	//Engine.message ("mouse dragging ", mouseInfo.dragging);
	//Engine.message ("button down ", mouseInfo.buttondown);

	if (!mouseInfo.buttondown)
	{
		system.setModuleParameter (this, "call", "render", 0);
		//if (lastPositionValid)
		{
			// first time after button down
			makeNewGroup = true;
		}
			
		lastPositionValid = 0;
		return kCallAgain
	}
	
	// Use the current geometry
	this.geometry = Module.geometry;
	
	this.frame.setPosition (mouseInfo.mousepos);
	if (mouseInfo.mousedir)
	{
		// Switch x and y in atan2 since for us 0 degrees is along y axis
		this.frame.rotateDeg (Math.atan2 (mouseInfo.mousedir.x, mouseInfo.mousedir.y) * 180 / 3.14)
	}
	
	system.setModuleParameter (this, "call", "render", 1);
	this.visible = 1;
	//Engine.message ("making module ", this.index, " visible");

	Engine.setParameter (kIncrementalRender, 0)
	
	var module = new Module (new Frame2d);
	
	// we can't undo the module that adds new modules
	system.setModuleParameter (module, kModuleDontUndo, 1);

	// Now we can undo the current module
	system.setModuleParameter (this, kModuleDontUndo, 0);

	this.lastPosition = lastPositionValid ? lastPosition : this.frame.position();
	lastPositionValid = 1;
	lastPosition = this.frame.position();
	
	return kDontCallAgain;
}


var frame = new Frame2d;
var frameB;

var p3;


var firstTime = 0;
var stemLength;

var leafNumber;
var branchNumber = 0;

var brNumber = 15;


var stemBlock;
var becomingThinnerRatio;
var stemRoughness;

var branchON;

var mainBranchStartsFrom;
var mainBranchFrequency;
var mainBranchStartAngleRange1;
var mainBranchStartAngleRange2;

var mainBranchLength;
var mainBranchBlock;
var mainBranchDirection;
var mainBranchCurl;

var childBranchStartsFrom;
var childBranchFrequency;
var childBranchStartAngleRange1;
var childBranchStartAngleRange2;

var childBranchLength;
var childBranchBlock;
var childBranchDirection;
var childBranchCurl;


var leafColorR;
var leafColorG;
var leafColorB;


var distanceFromStemR;


Module.prototype.render = function (api, env)
{
	


	if (makeNewGroup)
	{
		leafNumber = 200;
		firstTime = 0;
		
		fireSize = 0.020;
		stemWidth =  1.5;
		stemBlock = 0.01;
		becomingThinnerRatio = 0.85;
		stemRoughness = 0.15;
			
		mainBranchStartsFrom = 0;
		mainBranchFrequency = 100; // %
		mainBranchStartAngleRange1 = 70;
		mainBranchStartAngleRange2 = 90;
		mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
		mainBranchLength = 10*Module.fsize;
		mainBranchBlock = 0.8*Module.fsize;

		childBranchStartsFrom = 0;
		childBranchFrequency = 10;   //  %
		childBranchStartAngleRange1 = 60;
		childBranchStartAngleRange2 = 100;
		childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
		childBranchLength = 6*Module.fsize;
		childBranchBlock = 1.2*Module.fsize;


		distanceFromStemR = 0;

		leafSize = 2*Module.fsize;

		leafColorR = Module.vcolor1.x;
		leafColorG = Module.vcolor1.y;
		leafColorB = Module.vcolor1.z;
	


		stemWidth = stemWidth * fireSize;
		mainBranchLength = mainBranchLength * fireSize;
		mainBranchBlock = mainBranchBlock * fireSize;
		childBranchLength = childBranchLength * fireSize;
		childBranchBlock = childBranchBlock * fireSize;
		

		RenderAPI.command (kCommandNewGroup)
		makeNewGroup = false;
	}

	if (this.seed < 0)
	{
		mouseInfo = EnvironmentBrush.query (kBrushGetMouseInfo);

		
		if (mouseInfo.pressure)
			this.pressure = mouseInfo.pressure;

		if (mouseInfo.bearing)
			this.bearing = mouseInfo.bearing
			
		// this is the first time the module is rendered, collect mouse info
		this.seed = rand.seed;
	}
	else
		rand.seed = this.seed; // to make sure that subsequent renders have the same seed
		

	var i;
	
	// If we have a parent, let us assume that we move the frame between p1 and p2 
	// (we ignore any rotation or the fact that the path between parent's frame and
	// this frame may not be linear)
	var p2 = this.frame.position();
	var p1 = this.lastPosition;	
	
		frame = new Frame2d (this.frame);

		frame.rotateDeg (- 90);
			
		RenderAPI.setParameter(kRenderID,branchNumber);
		branchNumber++;

		frame.translate (Math.random()*stemRoughness*2/5 - stemRoughness/5, Math.random()*stemRoughness*2/5 - stemRoughness/5);

		if (firstTime == 0){

				firstTime = 1;
				frameB = new Frame2d(frame);
				p3 = p1;
				stemLength = Math.random()*stemBlock;
				brNumber = 15.0;
		} else {
//	if ((p2-p3).length() > stemLength){

				stemLength = Math.random()*0.01;
				firstTime++;


					temp =  7;
					
					for( i = 0; i < temp; i++)
					{
					
					RenderAPI.setParameter(kRenderID,branchNumber);
					branchNumber++;		

					distanceFromStemR += 0.01;	
					
					mainBranch(api,fInbetween(frame, frameB,Math.random()*10),mainBranchBlock,brNumber,distanceFromStemR,firstTime);
					}




				p3 = p2;
				frameB = new Frame2d(frame);

		}

		if (brNumber > 1){
			brNumber = brNumber -0.5;
		} 

					
	return kDontCallAgain; 
}

function mainBranch(api,frame,branchBlock,brNumber,distanceFromStem,n)
{
	
					var branchDirection = 0.5;
					var branchDirection2 = 1;
					var branchDirection3;
					
					var lShadow = Math.random()*0.5 + 0.5;

					var frame1 = new Frame2d(frame);
					var frame2 = new Frame2d(frame);

					var length = 0;
					var block;

					var i = 0;


					while (length < mainBranchLength+0.1)
					{
						frame1 = frame2;
						frame2 = new Frame2d(frame1);


						if (i == 0)
						{
							if(Math.random()>0.8){
								var temp = Math.random()*45-22.5
								frame2.rotateDeg (temp);
								frame1.rotateDeg (temp);
								branchBlock = branchBlock/2;
							}else if (Math.random()>branchDirection){
								branchDirection3 = -(Math.random()*mainBranchStartAngleRange2+mainBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.9;
								branchDirection2 = 1;
							}else{
								branchDirection3 = (Math.random()*mainBranchStartAngleRange2+mainBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.1;
								branchDirection2 = -1;
							}
							
						}
					
						block = branchBlock + (Math.random()*stemRoughness*branchBlock-stemRoughness*branchBlock/2)*fireSize;
						length = length + block;
						distanceFromStem += block;
						frame2.translate (block ,(Math.random()*stemRoughness - stemRoughness/2)*fireSize);

						if (childBranchFrequency > Math.random()*100)
							childBranch(api,frame1, childBranchBlock , 2,branchDirection3,lShadow,(branchDirection2 == 1),distanceFromStem);

							
						i++;
						}

						if ( n < 5){
								mainBranchLength = mainBranchLength * 1.01;
						} else {
								mainBranchLength = mainBranchLength * 0.8;
						}
									
						
}


function childBranch(api,frame,branchBlock,brNumber,branchDirection4,lShadow,r,distanceFromStem)
{
	
					var branchDirection = 0.5;
					var branchDirection3;

					var frame1 = new Frame2d(frame);
					var frame2 = new Frame2d(frame);

					var length = 0;
					var block;

					var i = 0;

					while (length < childBranchLength)
					{
						frame1 = frame2;
						frame2 = new Frame2d(frame1);

						if (i == 0)
						{
							if(Math.random()>0.999){
								var temp = Math.random()*45-22.5;
								frame2.rotateDeg (temp);
								frame1.rotateDeg (temp);
								branchBlock = branchBlock/2;
							}else if (Math.random()>branchDirection){
								branchDirection3 = -(Math.random()*childBranchStartAngleRange2+childBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.9;
							}else{
								branchDirection3 = (Math.random()*childBranchStartAngleRange2+childBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.1;
							}
							
						}else{
								
									if (i <= 2)
									{
										frame2.rotateDeg((-branchDirection3-branchDirection4)/2);
									} else {
										frame2.rotateDeg(Math.random()*20-10);
									}
									
						}
					
						block = branchBlock + (Math.random()*stemRoughness*branchBlock-stemRoughness*branchBlock/2)*fireSize;
						length = length + block;
						distanceFromStem += block;
						frame2.translate (block ,(Math.random()*stemRoughness - stemRoughness/2)*fireSize);


						leavesBlock(api,frame1,(Math.random()*0.5+0.5)*lShadow,distanceFromStem);

						i++;
					}
}


var verts = new Array(8);

function leavesBlock(api,frame,lShadow,distanceFromStem)
{
		var frameL = new Frame2d(frame);
		var lColor = (Math.random()*0.5+0.5)*lShadow;

				var lR = leafColorR*lColor * 1.8 * (1/(distanceFromStem*distanceFromStem));
				if (lR > 1) lR =1;
				var lG = leafColorG*lColor * 1.8 * (2/distanceFromStem);
				if (lG > 1 ) lG =1;
				var lB = leafColorB*lColor * 1.8;
				if (lB > 1) lB = 1;
			
				var flameSize = 0.08 * Module.fsize;
				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);

				api.scale (27.5, 27.5);
	

				verts[0] = new Vector3(0+(Math.random()*0.05-0.025)*leafSize, 0+(Math.random()*0.05-0.025)*leafSize);
				verts[1] = new Vector3(0.5*flameSize+(Math.random()*0.05-0.025)*leafSize, 0.5*flameSize+(Math.random()*0.05-0.025)*leafSize);
				
				verts[2] = new Vector3(0.9*flameSize+(Math.random()*0.05-0.025)*leafSize, 0.6*flameSize+(Math.random()*0.05-0.025)*leafSize);
				verts[3] = new Vector3(1.3*flameSize+(Math.random()*0.05-0.025)*leafSize, 0.5*flameSize+(Math.random()*0.05-0.025)*leafSize);
				
				verts[4] = new Vector3(1.7*flameSize+(Math.random()*0.05-0.025)*leafSize,0+(Math.random()*0.05-0.025)*leafSize);
				verts[5] = new Vector3(1.3*flameSize+(Math.random()*0.05-0.025)*leafSize, -0.5*flameSize+(Math.random()*0.05-0.025)*leafSize);

				verts[6] = new Vector3(0.9*flameSize+(Math.random()*0.05-0.025)*leafSize,-0.6*flameSize+(Math.random()*0.05-0.025)*leafSize);
				verts[7] = new Vector3(0.5*flameSize+(Math.random()*0.05-0.025)*leafSize, -0.5*flameSize+(Math.random()*0.05-0.025)*leafSize);					
					
				
				api.Polygon(verts);
				api.popMatrix();	
				
				


} 

function fInbetween(frame1,frame2,lc) // lc = 0 - 10
{
	
				var fp1 = frame1.toLocalCoords(frame2.position());

				var frameBT = new Frame2d(frame1);
				frameBT.translate((fp1.x/10)*lc,(fp1.y/10)*lc);
				
				return frameBT;
}


/////////////////////////////////////////////////////////////////////////////
// Initial is the object that creates the initial module or a set of modules
function Initial () {}

Initial.prototype.produce = function (system)
{
	system.setParameter (kApplyFrame, 0)
	system.setParameter (kIncrementalRender, 0);

	var frame = new Frame2d();
	var initialModule = new Module (frame);

}

var initial = new Initial()

// Static variables defining initial state
// Prefix integer variables with i and float variables with f
Initial.fwinsize = 5;

Engine.addEnvironment ("Brush");


// Set size of the scene, but after all environments that need bbox are specified
//Engine.setSceneBBox (-Initial.fwinsize, Initial.fwinsize, -Initial.fwinsize, Initial.fwinsize, 
//					 -Initial.fwinsize*1.5, Initial.fwinsize*1.5);
Engine.setSceneBBox (0, 550, 0, 400);

Engine.setParameter (kRunSimulation, 1);


/////////////////////////////////////////////////////////////////////////////
Module.variableUpdated = function (varname)
{
	if (varname == "fsize")
	{
		Module.fsize = Module.fsize * 0.25;
	}
}


// Menu name, followed by 
var menuModule1, menuModule1b, menuModule2;

Module.fsize = 5;
Module.fsize = 1.25;
Module.vcolor1 = new Vector4(1,0.2,0,1.0); // the flame color


menuModule = [
		"Module",
		["fsize", Module.fsize, "$$$/IDS_PI_PROC_FLAME_SIZE=Flame size:", [2, 20], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
		//["fspeed", Modulefireflame.fspeed, "Fire speed", [0, 5]],	

		["vcolor1", Module.vcolor1, "$$$/IDS_PI_PROC_FLAME_COLOR=Flame color:", [0,1]],
];



// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule);

Engine.setInitialObject (initial);

