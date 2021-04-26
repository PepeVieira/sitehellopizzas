
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
	RenderAPI.command (kCommandNewGroup)
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
Module.fbrushWidth = 0.5;
Module.fcomplexity = 1;
Module.ibrushAngle = 0;
Module.isymbolRandomScale = 0;
Module.icalligraphic = 1;


Module.fsymbolScalex = 1;
Module.fsymbolScaley = 1;
Module.fsymbolRotate1 = 0;
Module.fsymbolRotate2 = 0;
Module.isymbolRotate = 1;
Module.isymbolRandomRotate = 0;

Module.ianimation = 0;

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

var prestemWidth = 0;
var firstTime = 0;
var stemLength;

var branchNumber = 0;

var brNumber = 15;



var stemWidth;
var stemBlock;
var becomingThinnerRatio;
var stemRoughness;


var mainBranchStartsFrom;
var mainBranchFrequency;
var mainBranchStartAngleRange1;
var mainBranchStartAngleRange2;
var mainBranchWidth;
var mainBranchLength;
var mainBranchBlock;



var childBranchStartsFrom;
var childBranchFrequency;
var childBranchStartAngleRange1;
var childBranchStartAngleRange2;
var childBranchWidth;
var childBranchLength;
var childBranchBlock;

var skipFirst = true;

function StartEach ()
{
	if (firstTime % 3 == 0 && Module.ianimation == 1)
	{
		if (!skipFirst)
			RenderAPI.command (kCommandNextFrame);
	}

}


// how to rotate based on the screen orientation  memo
//				frame.rotateDeg (Math.atan2 (this.frame.heading().x, this.frame.heading().y) * 180 / 3.14
//			                 - 90);

Module.prototype.render = function (api, env)
{

//		var frameS1;
//		var frameS2;
		var firstStem = 0;

	if (makeNewGroup)
	{

		
		
		firstTime = 0;
		skipFirst = false;
		
		treeSize = 0.1 * Module.fsymbolScaley;
		stemWidth =  Module.fbrushWidth;
		stemBlock = 0.01;
		becomingThinnerRatio = 0.89 + ( 0.1* Module.fcomplexity);
		stemRoughness = 0.3;
		

		mainBranchStartsFrom = 5;
		mainBranchFrequency = 2 * Module.fcomplexity;
		mainBranchStartAngleRange1 = 5;
		mainBranchStartAngleRange2 = 80;
		mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
		mainBranchWidth = 0.4;
		mainBranchLength = 80 * Module.fcomplexity;
		mainBranchBlock = 0.6;


		childBranchStartsFrom = 1;
		childBranchFrequency = 2 * Module.fcomplexity; 
		childBranchStartAngleRange1 = 5;
		childBranchStartAngleRange2 = 80;
		childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
		childBranchWidth = 0.8;
		childBranchLength = 60;
		childBranchBlock = 0.3;



		
		

		stemWidth = stemWidth * treeSize;
		mainBranchLength = mainBranchLength * treeSize;
		mainBranchBlock = mainBranchBlock * treeSize;
		childBranchLength = childBranchLength * treeSize;
		childBranchBlock = childBranchBlock * treeSize;
		
		
		
		
		makeNewGroup = false;
	}

	if (this.seed < 0)
	{
		mouseInfo = EnvironmentBrush.query (kBrushGetMouseInfo);

		//if (!mouseInfo.dragging)
		//	return kCallAgain
			
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

				prestemWidth = stemWidth;
				firstTime = 1;
				frameB = new Frame2d(frame);
				p3 = p1;
				stemLength = Math.random()*stemBlock;
				brNumber = 15.0;

		} else if ((p2-p3).length() > stemLength){

				stemLength = Math.random()*0.01;
				firstTime++;

				var temp = (p2-p3).length();
				if (temp >= 3){
					stemN = 10;
				} else {
					stemN = temp*10/3;
				}
			


				brBlockStem(api,frame,frameB,stemWidth,prestemWidth,stemN);			



				if (firstTime >= mainBranchStartsFrom) // branch
				{
					temp =  ((Math.random() * 200 - 100) + mainBranchFrequency*8)/100;
					
					for( i = 0; i < temp; i++)
					{
					
					RenderAPI.setParameter(kRenderID,branchNumber);
					branchNumber++;		
					
		
					mainBranch(api,fInbetween(frame, frameB,Math.random()*10),mainBranchBlock,stemWidth,brNumber, firstTime-mainBranchStartsFrom);
					}
				}
				prestemWidth = stemWidth;
				p3 = p2;
				frameB = new Frame2d(frame);

		}

		if (brNumber > 1){
			brNumber = brNumber -0.5;
		} 


		
	return kDontCallAgain; 
}

function mainBranch(api,frame,branchBlock,stemWidth,brNumber, n)
{
	
					var branchDirection = 0.5;
					var branchDirection2 = 1;
					var branchDirection3;
					
					var lShadow = Math.random()*0.5 + 0.5;

					var frame1 = new Frame2d(frame);
					var frame2 = new Frame2d(frame);

					var branchWidth = stemWidth*mainBranchWidth;
					var branchWidth1= stemWidth*mainBranchWidth;

					var length = 0;
					var block;

					var i = 0;
					var mb = 0;


					while (length < mainBranchLength)
					{
						mb++;
						frame1 = frame2;
						frame2 = new Frame2d(frame1);


						if (i == 0)
						{
							if(Math.random()>0.999){
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
							
						}else{


									

									if (Math.random() > 0.95){
										frame2.rotateDeg(-branchDirection3/2);
										branchDirection3 = branchDirection3 - branchDirection3/2;
									} else {
										var bd = Math.random()*30-15;
										branchDirection3 = branchDirection3 + bd;
										frame2.rotateDeg(bd);
									}



						}
					
						block = branchBlock + (Math.random()*stemRoughness*branchBlock-stemRoughness*branchBlock/2)*treeSize;
						length = length + block;
						frame2.translate (block ,(Math.random()*stemRoughness - stemRoughness/2)*treeSize);


							brBlock(api, frame1, frame2, branchWidth, branchWidth1,(branchDirection2 == 1));


						if (childBranchFrequency > Math.random()*100 && mb >= childBranchStartsFrom)
							childBranch(api,frame1, childBranchBlock , branchWidth,2,branchDirection3,lShadow,(branchDirection2 == 1));

							branchWidth = branchWidth1;

								branchWidth1 = branchWidth1 * becomingThinnerRatio;
						i++;
						}
					

										if ( n < 2){
												mainBranchLength = mainBranchLength * (1+(1-becomingThinnerRatio)/3);
										} else {
												mainBranchLength = mainBranchLength * (1-(1-becomingThinnerRatio)/3);
										}

						
}


function childBranch(api,frame,branchBlock,stemWidth,brNumber,branchDirection4,lShadow,r)
{

	
					var branchDirection = 0.5;
					var branchDirection2 = 1;
					var branchDirection3;
					
					var chShadow = (Math.random()*0.5+0.5)*lShadow;

					var frame1 = new Frame2d(frame);
					var frame2 = new Frame2d(frame);

					var branchWidth = stemWidth*childBranchWidth;
					var branchWidth1= stemWidth*childBranchWidth;

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
								branchDirection2 = 1;
							}else{
								branchDirection3 = (Math.random()*childBranchStartAngleRange2+childBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.1;
								branchDirection2 = -1;
							}
							
						}else{
							
										if (Math.random() > 0.95){
										frame2.rotateDeg(-branchDirection3/2);
										branchDirection3 = branchDirection3 - branchDirection3/2;
									} else {
										var bd = Math.random()*20-10;
										branchDirection3 = branchDirection3 + bd;
										frame2.rotateDeg(bd);
									}									
									

						}
					
						block = branchBlock + (Math.random()*stemRoughness*branchBlock-stemRoughness*branchBlock/2)*treeSize;
						length = length + block;
						frame2.translate (block ,(Math.random()*stemRoughness - stemRoughness/2)*treeSize);


						brBlock(api, frame1, frame2, branchWidth, branchWidth1);




							branchWidth = branchWidth1;

								branchWidth1 = branchWidth1 * becomingThinnerRatio;

						i++;
						}
}




function brBlock(api,frame1,frame2,stemWidth1,stemWidth2)
{


				api.pushMatrix();	

				frame2.translate (0,-stemWidth2/2);
				var fp0 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2);
				var fp1 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,-stemWidth2/2);

				api.Color (kStrokeColor, 0.5,0.2,0.1,0);
				api.Color (kFillColor, Module.vcolor.x,Module.vcolor.y,Module.vcolor.z);

				api.setFrame (frame1);
				var verts = new Array(4);
				verts[0] = new Vector3(fp0.x, fp0.y);
				verts[1] = new Vector3(fp1.x, fp1.y);
				verts[2] = new Vector3(0, stemWidth1/2);
				verts[3] = new Vector3(0,-stemWidth1/2);

				api.Polygon(verts);
				
				api.popMatrix();	

} 

function brBlockStem(api,frame1,frame2,stemWidth1,stemWidth2,stemN)
{
	var i =1;
	var frameS1;
	var frameS2;
				for (i = 1; i < stemN; i=i+10/stemN){
					if (i == 1){

						frameS1 = new Frame2d(frame1);

						frameS2 = fInbetween(frame1, frame2,i);
						frameS2.translate (Math.random()*0.1-0.05,Math.random()*0.1-0.05);
						brBlock(api,frameS1,frameS2,stemWidth1,stemWidth2);
						frameS1 = new Frame2d(frameS2);

					} else {

						frameS2 = fInbetween(frame1, frame2,i);
						frameS2.translate (Math.random()*0.1-0.05,Math.random()*0.1-0.05);
						brBlock(api,frameS1,frameS2,stemWidth1,stemWidth2);
						frameS1 = new Frame2d(frameS2);					

					}
				}
			

				frameS2 = new Frame2d(frame2);
				brBlock(api,frameS1,frameS2,stemWidth1,stemWidth2); 

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
Module.vcolor = new Vector4(1,1,0.85,1.0); // the beam color

// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (-Initial.fwinsize, Initial.fwinsize, -Initial.fwinsize, Initial.fwinsize, 
					 -Initial.fwinsize*1.5, Initial.fwinsize*1.5);

Engine.setParameter (kRunSimulation, 1);


/////////////////////////////////////////////////////////////////////////////
Module.fbeamWidth = Module.fbrushWidth / 5;

Module.variableUpdated = function (varname)
{
	//Engine.message ("variableUpdated called with parameter ", varname);
	if (varname == "fbeamWidth")
		Module.fbrushWidth = Module.fbeamWidth * 5;
}

// Menu name, followed by 
var menuModule1, menuModule2;

menuModule1 = [
		"Module",
		["vcolor", Module.vcolor, "$$$/IDS_PI_PROC_LIGHTNING_COLOR=Lightning color:", [0,1]],
		["fsymbolScaley", Module.fsymbolScaley, "$$$/IDS_PI_PROC_LIGHTNING_SCALE=Lightning Scale:", [0.1, 1], 1, "%"],
		["sdiv", "divider", " ", [0,0]],
		["ianimation", Module.ianimation, "$$$/IDS_PI_PROC_ANIMATION=Animation", [0, 1]],
];


menuModule2 = [
		"Module",
		["fbeamWidth", Module.fbeamWidth, "$$$/IDS_PI_PROC_BEAM_WIDTH=Beam Width:", [0.023, 0.44], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
		["fcomplexity", Module.fcomplexity, "$$$/IDS_PI_PROC_COMPLEXITY=Complexity:", [0, 1], 1, "%"],
];

// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule1, "Module", menuModule2);

Engine.setInitialObject (initial);

