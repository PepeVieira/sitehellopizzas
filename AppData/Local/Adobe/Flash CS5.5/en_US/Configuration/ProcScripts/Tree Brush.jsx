
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
//var currentStrokeColor = new Vector3 (0,0,0);
//var currentFillColor = new Vector3 (0,0,0);


///////////////////////////////////////////////////////////////////////////
// Object Module
//Module.fmainBranchFrequency = 99;
//Module.fchildBranchFrequency = 20;


Module.iartType = 3;






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

	//Engine.setParameter (kIncrementalRender, 0)
	
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

var leafNumber;
var branchNumber = 0;

var brNumber = 0;



var stemWidth;
var stemBlock;
var becomingThinnerRatio;
var stemRoughness;

var branchON;

var mainBranchStartsFrom;
var mainBranchFrequency;
var mainBranchStartAngleRange1;
var mainBranchStartAngleRange2;
var mainBranchWidth;
var mainBranchLength;
var mainBranchBlock;
var mainBranchDirection;
var mainBranchCurl;

var mainBranchLengthBack = 0;

var childBranchStartsFrom;
var childBranchFrequency;
var childBranchStartAngleRange1;
var childBranchStartAngleRange2;
var childBranchWidth;
var childBranchLength;
var childBranchBlock;
var childBranchDirection;
var childBranchCurl;

var flowerON
var leafColor;
var leafColorR;
var leafColorG;
var leafColorB;
var flowerType;
var flowerFrequency;
var flowerSize;

var layerBase;

// how to rotate based on the screen orientation  memo
//				frame.rotateDeg (Math.atan2 (this.frame.heading().x, this.frame.heading().y) * 180 / 3.14
//			                 - 90);

Module.prototype.render = function (api, env)
{

	if (makeNewGroup)
	{
		leafNumber = 200;
		firstTime = 0;
	
		treeInitialize(Module.iartType);
	
			treeSize = Module.fsymbolScaley * 0.07;
//			mainBranchFrequency = Module.fmainBranchFrequency;
//			childBranchFrequency = Module.fchildBranchFrequency;
						
						
						
			brNumber = 0;
			
			
			
			
			
			
			
			
	

		
		leafColor = 0; // 0.. regular green, 1.. yellow orange, 2.. dark green

		switch(leafColor)
		{
			case 0:
			leafColorR = Module.vcolor.x;
			leafColorG = Module.vcolor.y;
			leafColorB = Module.vcolor.z;
			break;
			
			case 1:
			leafColorR = 1;
			leafColorG = 0.7;
			leafColorB = 0;
			break;
			
			case 2:
			leafColorR = 0.2;
			leafColorG = 0.6;
			leafColorB = 0.1;
			break;
			
			default:		
			leafColorR = 0.3;
			leafColorG = 1;
			leafColorB = 0.1;
			break;
		}	
		
		

		stemWidth = stemWidth * treeSize;
		mainBranchLength = mainBranchLength * treeSize;
		mainBranchBlock = mainBranchBlock * treeSize;
		childBranchLength = childBranchLength * treeSize;
		childBranchBlock = childBranchBlock * treeSize;
		
		
		
		
		RenderAPI.command (kCommandNewGroup)
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

		
		//if (Module.isymbolRandomRotate)
		//	frame.rotateDeg (Math.random() * 360);
		//else
		//	frame.rotateDeg ( (i % 2) == 0 ? Module.fsymbolRotate1 : Module.fsymbolRotate2);
		

			
		
		
//		RenderAPI.setParameter(kRenderID,branchNumber);
//		branchNumber++;

		frame.translate (Math.random()*stemRoughness*2/5 - stemRoughness/5, Math.random()*stemRoughness*2/5 - stemRoughness/5);

		if (firstTime == 0){
				prestemWidth = stemWidth;
				firstTime = 1;
				frameB = new Frame2d(frame);
				p3 = p1;
				stemLength = Math.random()*stemBlock;

		} else if ((p2-p3).length() > stemLength){

				stemLength = Math.random()*0.01;
				firstTime++;

		
		if (brNumber <= 1){
			RenderAPI.setParameter(kRenderID,branchNumber);
			branchNumber++;
			layerBase = branchNumber;
		} else {
			api.setParameter (kRenderOrder, kRenderBelow, layerBase);
			RenderAPI.setParameter(kRenderID,branchNumber);
			branchNumber++;
		}

				if (branchON >= 0){
					brBlock(api,frame,frameB,stemWidth,prestemWidth,0);
				}


				if (brNumber >= mainBranchStartsFrom) // branch
				{
					temp =  ((Math.random() * 200 - 100) + mainBranchFrequency*8)/100;
					
					for( i = 0; i < temp; i++)
					{
					
					api.setParameter (kRenderOrder, kRenderOnTop);
					RenderAPI.setParameter(kRenderID,branchNumber);
					branchNumber++;		
					
					mainBranch(api,fInbetween(frame, frameB,Math.random()*10),mainBranchBlock,stemWidth,brNumber, brNumber-mainBranchStartsFrom);
					}
				}
				brNumber++;

				prestemWidth = stemWidth;
				p3 = p2;
				frameB = new Frame2d(frame);

		}




		if (stemWidth >0.06){
			stemWidth = stemWidth * becomingThinnerRatio;
		} else {
			stemWidth = 0.03;
		}

			
	//Engine.removeModule (this);
	//Engine.setModuleParameter (this, "call", "render", 0);
		
	return kDontCallAgain; 
}


function treeInitialize(treeType){
	
		switch(treeType)
		{
			case 32: //Oak tree
									

			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.07* Module.fsymbolScaley;
		
			treeShape = 2;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;
			mainBranchStartAngleRange1 = 30;
			mainBranchStartAngleRange2 = 90;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 16 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.5;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -1;

			childBranchStartsFrom = 0;
			childBranchFrequency = 50;
			childBranchStartAngleRange1 = 40;
			childBranchStartAngleRange2 = 90;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.99;  // 1 = 100%
			childBranchLength = 3 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -0.5;

			leafType = 1;
			leafSize = 1;									
									
			break;
									
			case 6: // Cupressus


			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 25 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 1;
			childBranchFrequency = 10;
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 3;
			leafSize = 1;

			break;									
							
			case 14: //Poplar 01
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.15 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 0;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 6;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 90;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 25 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 1;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 0.8;
			
			
			break;
							
			case 39: //Winter tree 01
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.4 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 1;
			flowerFrequency = 99;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 90;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.5;  // 1 = 100%
			mainBranchLength = 25 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.8;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.8;

			childBranchStartsFrom = 3;
			childBranchFrequency = 10;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 55;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 10 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.4;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 1.2;			
				
			break;
				
			
			case 40: // Winter tree 02
				
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.5* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
			
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 1;
			flowerFrequency = 99;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 6;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 100;
			mainBranchStartAngleRange2 = 150;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 27* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.8;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 3;

			childBranchStartsFrom = 3;
			childBranchFrequency = 10;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 10* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "parallel"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 1.2;
				
			break;

			case 20: //Winter Icicles              ( Winter Tree A   03)

			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.4* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 1;
			flowerFrequency = 99;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 6;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 30;
			mainBranchStartAngleRange2 = 90;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 25* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -2;

			childBranchStartsFrom = 3;
			childBranchFrequency = 8;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 14* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.4;
			childBranchDirection = "down"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -2;

			leafType = 1;
			leafSize = 1.2;


			break;

			case 41: // Winter tree 04
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.5 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 1;
			flowerFrequency = 99;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 30* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "straight"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 3;
			childBranchFrequency = 10;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 10* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 1;

			leafType = 2;
			leafSize = 0.6;			
			
			break;

			case 17: // Winter Bare			(Winter tree B   05)
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.5* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 1;
			flowerFrequency = 99;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 6;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 30* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -2;

			childBranchStartsFrom = 1;
			childBranchFrequency = 10;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 2;
			leafSize = 0.6;			
			
			break;

			case 38: // Willow 01
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.5* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 1;
			flowerFrequency = 99;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 7;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 80;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 30* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -2;

			childBranchStartsFrom = 3;
			childBranchFrequency = 5;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 20* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "down"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -2;

			leafType = 2;
			leafSize = 0.6;			
			
			
			
			break;

			case 10: // Ginkgo
			
			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.3* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 1;
			flowerFrequency = 99;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 5;
			mainBranchFrequency = 90;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 100;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 30* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.5;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.25;

			childBranchStartsFrom = 3;
			childBranchFrequency = 50;   // %
			childBranchStartAngleRange1 = 45;
			childBranchStartAngleRange2 = 55;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.99;  // 1 = 100%
			childBranchLength = 5* Module.fsymbolScaley * 0.7;
			childBranchBlock = 1.2;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 1.2;
			
			
			break;

			case 9: // Garden Plant
			
			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.4 * Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 0;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 1; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 7;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 15* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -6;

			childBranchStartsFrom = 1;
			childBranchFrequency = 10;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 3* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.2;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 2;
			leafSize = 2;
		
			
			
			
			break;


			case 33: // Poplar 02
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.4* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 25* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 1;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 0.8;
			
			
			
			break;


			case 16: // vine
			
			stemWidth =  0.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.6* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 1; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 70;   // %
			mainBranchStartAngleRange1 = 7;
			mainBranchStartAngleRange2 = 100;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 15* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "vine"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -6;

			childBranchStartsFrom = 2;
			childBranchFrequency = 5;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.99;  // 1 = 100%
			childBranchLength = 3* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.2;
			childBranchDirection = "vine"; // straight, parallel, up, down, curl, curl3, vine

			leafType = 1;
			leafSize = 0.25;			
			
			
			break;

			case 21: // Acer
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.4* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 35* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -1;

			childBranchStartsFrom = 20;
			childBranchFrequency = 30;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 0.8;
			
			
			
			break;
			
			
			case 2:  // ash
			
			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.2* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 7;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.5;  // 1 = 100%
			mainBranchLength = 35* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl2"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 2;

			childBranchStartsFrom = 5;
			childBranchFrequency = 25;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 0.8;
			
			
			
			break;			
			
			
			
			
			
			
			
			case 4:  // birch 1
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 6;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 75;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 45* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -0.01;

			childBranchStartsFrom = 5;
			childBranchFrequency = 25;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 20;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 4* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 0.8;
			
			
			
			break;			



			case 12:  // maple 1
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2* Module.fsymbolScaley * 0.7;
		
			treeShape = 3;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 75;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.9;  // 1 = 100%
			mainBranchLength = 25* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl2"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 2;

			childBranchStartsFrom = 5;
			childBranchFrequency = 25;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 20;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 4* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 0.8;
			
			
			
			break;			



			case 28:  //grass 03
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 6;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 55;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.9;  // 1 = 100%
			mainBranchLength = 25* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 1;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -1;

			childBranchStartsFrom = 15;
			childBranchFrequency = 15;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 20;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 4* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -1;

			leafType = 3;
			leafSize = 0.8;
			
			
			
			break;		



			case 22:  // Aspen 1
			
			stemWidth =  1.6;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.2* Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 79;   // %
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 65;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.5;  // 1 = 100%
			mainBranchLength = 28* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -0.5;

			childBranchStartsFrom = 25;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 20;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 10* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "straight"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 1;

			leafType = 1;
			leafSize = 0.8;
			
			
			
			break;			



			case 34:  // redwood
			
			stemWidth =  1.6;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.2* Module.fsymbolScaley * 0.7;
		
			treeShape = 2;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 90;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.5;  // 1 = 100%
			mainBranchLength = 12* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -0.5;

			childBranchStartsFrom = 1;
			childBranchFrequency = 25;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 20;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 5* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "straight"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 1;

			leafType = 1;
			leafSize = 0.8;
			
			
			
			break;			

			case 19: // Winter Evergreen			(Winter tree C    06)
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.15 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 6;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 90;
			mainBranchStartAngleRange2 = 140;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 25 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 1;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "down"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 3;
			leafSize = 0.8;
			
			
			break;



			case 23:  //Birch 2


			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 3;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 88;
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 25 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.4;

			childBranchStartsFrom = 1;
			childBranchFrequency = 5;
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -2;

			leafType = 1;
			leafSize = 1;

			break;				

			case 1:  // appricot tree


			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 58;
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 60;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 50 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 2;
			mainBranchDirection = "vine"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.4;

			childBranchStartsFrom = 2;
			childBranchFrequency = 75;
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -2;

			leafType = 1;
			leafSize = 1;

			break;				

			case 26:  // fantacy 01


			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 0;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 1; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;
			mainBranchStartAngleRange1 = 30;
			mainBranchStartAngleRange2 = 110;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 50 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 2;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.4;

			childBranchStartsFrom = 0;
			childBranchFrequency = 95;
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 3;
			childBranchDirection = "up"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -2;

			leafType = 3;
			leafSize = 1;

			break;				


			case 5:  // Christmas Tree 01


			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 0;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 1; // 0.. OFF, 1.. ON
			flowerType = 1;
			flowerFrequency = 10;  // %
			flowerSize = 1.2;

			mainBranchStartsFrom = 2;
			mainBranchFrequency = 99;
			mainBranchStartAngleRange1 = 40;
			mainBranchStartAngleRange2 = 100;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 50 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 1;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.4;

			childBranchStartsFrom = 0;
			childBranchFrequency = 79;
			childBranchStartAngleRange1 = 30;
			childBranchStartAngleRange2 = 60;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 3 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 2;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -1;

			leafType = 3;
			leafSize = 2.5;

			break;		
			


			case 15:  // Redbud


			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 1;
			mainBranchFrequency = 20;
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 20;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 60 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 5;
			mainBranchDirection = "vine"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.4;

			childBranchStartsFrom = 5;
			childBranchFrequency = 99;
			childBranchStartAngleRange1 = 30;
			childBranchStartAngleRange2 = 60;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 16 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.5;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -2;

			leafType = 1;
			leafSize = 2;

			break;		
			
			




			case 37:  // Trimmed Thin Tree


			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 3;
		
			branchON = 0;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 3;
			mainBranchFrequency = 99;
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 45;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 15 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 1;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.4;

			childBranchStartsFrom = 0;
			childBranchFrequency = 99;
			childBranchStartAngleRange1 = 30;
			childBranchStartAngleRange2 = 60;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 3 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "straight"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 1;

			leafType = 1;
			leafSize = 2;

			break;		
			
			
			case 36:  // Sycamore Tree


			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 2;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 3;
			mainBranchFrequency = 99;
			mainBranchStartAngleRange1 = 30;
			mainBranchStartAngleRange2 = 80;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.4;  // 1 = 100%
			mainBranchLength = 17 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 2;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.7;

			childBranchStartsFrom = 0;
			childBranchFrequency = 99;
			childBranchStartAngleRange1 = 30;
			childBranchStartAngleRange2 = 60;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 0.4;

			leafType = 1;
			leafSize = 1.5;

			break;		


			case 3:  // Aspen Tree 2

			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 3;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 2;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 5;
			mainBranchFrequency = 99;
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 40;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.4;  // 1 = 100%
			mainBranchLength = 30 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 3;
			mainBranchDirection = "vine"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 0;
			childBranchFrequency = 80;
			childBranchStartAngleRange1 = 30;
			childBranchStartAngleRange2 = 60;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 0.4;

			leafType = 1;
			leafSize = 1;

			break;	


			case 8:  // Cypress Tree

			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 2;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 2;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;
			mainBranchStartAngleRange1 = 20;
			mainBranchStartAngleRange2 = 80;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.4;  // 1 = 100%
			mainBranchLength = 25 * Module.fsymbolScaley * 0.7;
			mainBranchBlock =2;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -0.2;

			childBranchStartsFrom = 0;
			childBranchFrequency = 99;
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 30;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "straight"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 0.4;

			leafType = 1;
			leafSize = 1;

			break;	




			case 35: // root
			
			stemWidth =  1;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.6* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 8;
			mainBranchFrequency = 20;   // %
			mainBranchStartAngleRange1 = 7;
			mainBranchStartAngleRange2 = 100;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 30* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "vine"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -6;

			childBranchStartsFrom = 2;
			childBranchFrequency = 5;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.99;  // 1 = 100%
			childBranchLength = 10* Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "vine"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 0.25;			
			
			
			break;


			case 11: // grass 02
			
			stemWidth =  0.8;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.01* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 8;
			mainBranchFrequency = 40;   // %
			mainBranchStartAngleRange1 = 0;
			mainBranchStartAngleRange2 = 1;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.4;  // 1 = 100%
			mainBranchLength = 20* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.25;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -1

			childBranchStartsFrom = 2;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.6;  // 1 = 100%
			childBranchLength = 5* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.5;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -1;

			leafType = 1;
			leafSize = 0.25;			
			
			
			break;


			case 27: // Grass 01
			
			stemWidth =  0.8;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.95;
			stemRoughness = 0.01* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 8;
			mainBranchFrequency = 40;   // %
			mainBranchStartAngleRange1 = 0;
			mainBranchStartAngleRange2 = 1;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.4;  // 1 = 100%
			mainBranchLength = 20* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.25;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -2

			childBranchStartsFrom = 2;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.6;  // 1 = 100%
			childBranchLength = 5* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.5;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -2;

			leafType = 1;
			leafSize = 0.25;			
			
			
			break;

			case 7: // Curl Vine 01
			
			stemWidth =  0.4;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.01* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 8;
			mainBranchFrequency = 0.01;   // %
			mainBranchStartAngleRange1 = 0;
			mainBranchStartAngleRange2 = 1;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 50* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.1;
			mainBranchDirection = "curl3"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -10;

			childBranchStartsFrom = 2;
			childBranchFrequency = 0;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.6;  // 1 = 100%
			childBranchLength = 2* Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "curl3"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -5;

			leafType = 1;
			leafSize = 0.25;			
			
			
			break;
			
			
			case 29: // Grass 04
			
			stemWidth =  0.4;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.005* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 8;
			mainBranchFrequency = 1;   // %
			mainBranchStartAngleRange1 = 20;
			mainBranchStartAngleRange2 = 30;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 17* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.3;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -2;

			childBranchStartsFrom = 2;
			childBranchFrequency = 10;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.6;  // 1 = 100%
			childBranchLength = 25* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.1;
			childBranchDirection = "curl3"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -20;

			leafType = 1;
			leafSize = 0.25;			
			
			
			break;			
			
			
			
			
			case 30: // Grass 05
			
			stemWidth =  0.4;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.01* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 8;
			mainBranchFrequency = 1;   // %
			mainBranchStartAngleRange1 = 0;
			mainBranchStartAngleRange2 = 0;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 20* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.3;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -2;

			childBranchStartsFrom = 2;
			childBranchFrequency = 10;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.6;  // 1 = 100%
			childBranchLength = 30* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.1;
			childBranchDirection = "curl3"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -20;

			leafType = 1;
			leafSize = 0.25;			
			
			
			break;				
			
						
						
			case 31: // Grass 06
			
			stemWidth =  0.4;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.01* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 0;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 8;
			mainBranchFrequency = 1;   // %
			mainBranchStartAngleRange1 = 0;
			mainBranchStartAngleRange2 = 0;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 20* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.3;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -2;

			childBranchStartsFrom = 2;
			childBranchFrequency = 10;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 50;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.6;  // 1 = 100%
			childBranchLength = 10* Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "curl3"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -5;

			leafType = 1;
			leafSize = 0.25;			
			
			
			break;		
			


			case 42: // Palm Tree
			
			stemWidth =  2;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.96;
			stemRoughness = 0.01* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;
		
			branchON = 0;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON,   -1.. Stem OFF
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 1; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 25;
			mainBranchFrequency = 0.01;   // %
			mainBranchStartAngleRange1 = 0;
			mainBranchStartAngleRange2 = 1;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 45* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.1;
			mainBranchDirection = "curl3"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = -20;

			childBranchStartsFrom = 170;
			childBranchFrequency = 3;   // %
			childBranchStartAngleRange1 = 90;
			childBranchStartAngleRange2 = 90;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.6;  // 1 = 100%
			childBranchLength = 15* Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 10;

			leafType = 3;
			leafSize = 2;			
			
			
			break;
			
			
			case 24: // Bush with branch
			
			stemWidth =  0.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.01* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;

			branchON = 3;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON,   -1.. Stem OFF
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 0;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 90;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 12 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 1;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 1;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 4 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 2;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 24;

			leafType = 1;
			leafSize = 2;
			
			
			break;			
			
			
			case 25: // Bush with no branch
			
			stemWidth =  0.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.01* Module.fsymbolScaley * 0.7;
		
			treeShape = 1;

			branchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON,   -1.. Stem OFF
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 0;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 10;
			mainBranchStartAngleRange2 = 90;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 12 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 1;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 1;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 4 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 2;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 24;

			leafType = 1;
			leafSize = 2;
			
			
			break;			



			case 18:  // Winter Deciduous			(winter tree 07)


			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2 * Module.fsymbolScaley * 0.7;
		
			treeShape = 0;
		
			branchON = 2;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 0; // 0.. OFF, 1.. ON		
			flowerON = 0; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 10;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 1;
			mainBranchFrequency = 20;
			mainBranchStartAngleRange1 = 1;
			mainBranchStartAngleRange2 = 20;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.99;  // 1 = 100%
			mainBranchLength = 60 * Module.fsymbolScaley * 0.7;
			mainBranchBlock = 5;
			mainBranchDirection = "vine"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 0.4;

			childBranchStartsFrom = 5;
			childBranchFrequency = 99;
			childBranchStartAngleRange1 = 30;
			childBranchStartAngleRange2 = 60;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 16 * Module.fsymbolScaley * 0.7;
			childBranchBlock = 1;
			childBranchDirection = "vine"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = -2;

			leafType = 1;
			leafSize = 2;

			break;		



			case 13: // Orange Tree 
			
			stemWidth =  1.5;  
			stemBlock = 0.01;
			becomingThinnerRatio = 0.9;
			stemRoughness = 0.2* Module.fsymbolScaley * 0.7;
		
			treeShape = 2;
			
			branchON = 1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			leavesON = 1; // 0.. OFF, 1.. ON		
			flowerON = 1; // 0.. OFF, 1.. ON
			flowerType = 0;
			flowerFrequency = 5;  // %
			flowerSize = 1;

			mainBranchStartsFrom = 4;
			mainBranchFrequency = 99;   // %
			mainBranchStartAngleRange1 = 20;
			mainBranchStartAngleRange2 = 90;
			mainBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			mainBranchWidth = 0.7;  // 1 = 100%
			mainBranchLength = 15* Module.fsymbolScaley * 0.7;
			mainBranchBlock = 0.4;
			mainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			mainBranchCurl = 1;

			childBranchStartsFrom = 1;
			childBranchFrequency = 20;   // %
			childBranchStartAngleRange1 = 10;
			childBranchStartAngleRange2 = 100;
			childBranchStartAngleRange2 = mainBranchStartAngleRange2 - mainBranchStartAngleRange1;
			childBranchWidth = 0.80;  // 1 = 100%
			childBranchLength = 8* Module.fsymbolScaley * 0.7;
			childBranchBlock = 0.8;
			childBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			childBranchCurl = 2;

			leafType = 1;
			leafSize = 1;
			
			
			
			break;




			default:		
			break;
		}

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
								switch(mainBranchDirection)
								{
									case "straight":
									break;
									
									case "parallel":
									if (i <= 2)
									{
										frame2.rotateDeg(-branchDirection3/2);
									} 
									break;
									
									case "curl":
									var bd = Math.random()*mainBranchCurl*branchDirection2;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);
									break;
									
									case "curl2":			
									var bd = ((brNumber -mainBranchStartsFrom)/4 * mainBranchCurl -1)*branchDirection2;
									if (bd > 5) bd = 5;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);									
									break;
									
									case "curl3":
									var bd = length*mainBranchCurl*branchDirection2*0.1;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);
									break;									
									
									
									case "vine":
									var bd = Math.random()*50-25;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);
									break;
									
									default:		
									frame2.rotateDeg (Math.random()*5*branchDirection2);
									break;
								}
						}
					
						block = branchBlock + (Math.random()*stemRoughness*branchBlock-stemRoughness*branchBlock/2)*treeSize;
						length = length + block;
						frame2.translate (block ,(Math.random()*stemRoughness - stemRoughness/2)*treeSize);

						if (branchON == 1 || branchON == 2 )
						{
							brBlock(api, frame1, frame2, branchWidth, branchWidth1,(branchDirection2 == 1));
						}

						if (childBranchFrequency > Math.random()*100 && mb >= childBranchStartsFrom)
							childBranch(api,frame1, childBranchBlock , branchWidth,2,branchDirection3,lShadow,(branchDirection2 == 1));

							branchWidth = branchWidth1;
							if(branchWidth1 > 0.02){
								branchWidth1 = branchWidth1 * becomingThinnerRatio;
							}
						i++;
						}
					
								switch(treeShape)
								{
									case 0:
									mainBranchLength = mainBranchLength * (1-(1-becomingThinnerRatio)/3);
									break;
									
									case 1:
									break;
									
									case 2:
										if ( n < 2){
												mainBranchLength = mainBranchLength * (1+(1-becomingThinnerRatio)/3);
										} else {
												mainBranchLength = mainBranchLength * (1-(1-becomingThinnerRatio)/3);
										}
									break;	

									case 3:
										if (n == 0 && mainBranchLengthBack == 0){

											mainBranchLengthBack = mainBranchLength;
										}
										if (n < 3.14*2){
											
											mainBranchLength = (Math.sin(n/2))*mainBranchLengthBack*1.5;

										} else {
											mainBranchLength = 0.01;
										}
									
									break;
									
									
									default:		
									
									break;
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
								switch(childBranchDirection)
								{
									case "straight":
									break;
									
									case "parallel":
									if (i <= 2)
									{
										frame2.rotateDeg(-branchDirection3/2);
									} 
									break;
									
									case "up":
									if (i <= 2)
									{
										frame2.rotateDeg((-branchDirection3-branchDirection4)/2);
									} 	
									break;
								
									case "down":
									if (i <= 2)
									{
										frame2.rotateDeg((-branchDirection3-branchDirection4+180)/2);
									} 		
									break;
									
									case "curl":
									frame2.rotateDeg(Math.random()*childBranchCurl*branchDirection2);
									break;
									
									
									case "curl3":
									var bd = length*mainBranchCurl*branchDirection2*0.1;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);
									break;									
									
									
									case "vine":
									frame2.rotateDeg(Math.random()*50-25);
									break;
									
									default:		
									frame2.rotateDeg (Math.random() *5*branchDirection2);
									break;
								}
						}
					
						block = branchBlock + (Math.random()*stemRoughness*branchBlock-stemRoughness*branchBlock/2)*treeSize;
						length = length + block;
						frame2.translate (block ,(Math.random()*stemRoughness - stemRoughness/2)*treeSize);

						if (branchON == 2 || branchON == 3)
							brBlock(api, frame1, frame2, branchWidth, branchWidth1,r);
						if (leavesON == 1)
							leavesBlock(api,frame1,chShadow);

							branchWidth = branchWidth1;
							if(branchWidth1 > 0.02){
								branchWidth1 = branchWidth1 * becomingThinnerRatio;
							}
						i++;
						}
}




function brBlock(api,frame1,frame2,stemWidth1,stemWidth2,r)
{
	
	
	
		var r1, r2, r3, r4, r5, r6, r7;
		if (r == 1){
			r1 = 1;
			r2 = 0.75;
			r3 = 0.5;
			r4 = 0.25;
			
			r5 = 1;
			r6 = 0.66;
			r7 = 0.33
		} else {
			r1 = 0.25;
			r2 = 0.5;
			r3 = 0.75;
			r4 = 1;
			
			r5 = 0.33;
			r6 = 0.66;
			r7 = 1;
		}

		var brr = Module.vcolorBr.x;
		var brg = Module.vcolorBr.y;
		var brb = Module.vcolorBr.z;
	
	
	
		if (stemWidth1 > 0.1)
		{
				api.pushMatrix();	

				frame2.translate (0,-stemWidth2/2);
				var fp0 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/4);
				var fp1 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/4);
				var fp2 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/4);
				var fp3 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/4);
				var fp4 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,-stemWidth2/2);

				api.Color (kStrokeColor, 0.5,0.2,0.1,0);
				api.Color (kFillColor, brr*r1,brg*r1,brb*r1);

				api.setFrame (frame1);
				var verts = new Array(4);
				verts[0] = new Vector3(fp0.x, fp0.y);
				verts[1] = new Vector3(fp1.x, fp1.y);
				verts[2] = new Vector3(0, -stemWidth1/4);
				verts[3] = new Vector3(0,-stemWidth1/2);

				api.Polygon(verts);
				
				api.Color (kFillColor, brr*r2,brg*r2,brb*r2);

				verts[0] = new Vector3(fp1.x, fp1.y);
				verts[1] = new Vector3(fp2.x, fp2.y);
				verts[2] = new Vector3(0, 0);
				verts[3] = new Vector3(0,-stemWidth1/4);		
				
				api.Polygon(verts);				
				
				api.Color (kFillColor, brr*r3,brg*r3,brb*r3);

				verts[0] = new Vector3(fp2.x, fp2.y);
				verts[1] = new Vector3(fp3.x, fp3.y);
				verts[2] = new Vector3(0, stemWidth1/4);
				verts[3] = new Vector3(0,0);		
				
				api.Polygon(verts);								
				
				api.Color (kFillColor, brr*r4,brg*r4,brb*r4);

				verts[0] = new Vector3(fp3.x, fp3.y);
				verts[1] = new Vector3(fp4.x, fp4.y);
				verts[2] = new Vector3(0, stemWidth1/2);
				verts[3] = new Vector3(0, stemWidth1/4);		
				
				api.Polygon(verts);				
		
				
				api.popMatrix();	

		} else if (stemWidth1 > 0.075){
			
				api.pushMatrix();	

				frame2.translate (0,-stemWidth2/2);
				var fp0 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/3);
				var fp1 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/3);
				var fp2 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/3);
				var fp3 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,-stemWidth2/2);

				api.Color (kStrokeColor, 0.5,0.2,0.1,0);
				api.Color (kFillColor, brr *r5,brg*r5,brb*r5);

				api.setFrame (frame1);
				var verts = new Array(4);
				verts[0] = new Vector3(fp0.x, fp0.y);
				verts[1] = new Vector3(fp1.x, fp1.y);
				verts[2] = new Vector3(0, -stemWidth1/6);
				verts[3] = new Vector3(0,-stemWidth1/2);

				api.Polygon(verts);

				api.Color (kFillColor, brr*r6,brg*r6,brb*r6);
				var verts = new Array(4);
				verts[0] = new Vector3(fp1.x, fp1.y);
				verts[1] = new Vector3(fp2.x, fp2.y);
				verts[2] = new Vector3(0, stemWidth1/6);
				verts[3] = new Vector3(0, -stemWidth1/6);

				api.Polygon(verts);
				api.Color (kFillColor, brr*r7,brg*r7,brb*r7);				
				var verts = new Array(4);
				verts[0] = new Vector3(fp2.x, fp2.y);
				verts[1] = new Vector3(fp3.x, fp3.y);
				verts[2] = new Vector3(0, stemWidth1/2);
				verts[3] = new Vector3(0,stemWidth1/6);

				api.Polygon(verts);
				
				api.popMatrix();				
			
			
		} else if (stemWidth1 > 0.04){
		
				api.pushMatrix();	

				frame2.translate (0,-stemWidth2/2);
				var fp0 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/2);
				var fp1 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2/2);
				var fp2 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,-stemWidth2/2);

				api.Color (kStrokeColor, 0.5,0.2,0.1,0);
				api.Color (kFillColor, brr*r1,brg*r1,brb*r1);

				api.setFrame (frame1);
				var verts = new Array(4);
				verts[0] = new Vector3(fp0.x, fp0.y);
				verts[1] = new Vector3(fp1.x, fp1.y);
				verts[2] = new Vector3(0, 0);
				verts[3] = new Vector3(0,-stemWidth1/2);

				api.Polygon(verts);

				api.Color (kFillColor, brr*r4,brg*r4,brb*r4);
				var verts = new Array(4);
				verts[0] = new Vector3(fp1.x, fp1.y);
				verts[1] = new Vector3(fp2.x, fp2.y);
				verts[2] = new Vector3(0, stemWidth1/2);
				verts[3] = new Vector3(0, 0);

				api.Polygon(verts);

				
				api.popMatrix();	

		} else {

				api.pushMatrix();	

				frame2.translate (0,-stemWidth2/2);
				var fp0 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2);
				var fp1 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,-stemWidth2/2);

				api.Color (kStrokeColor, 0.5,0.2,0.1,0);
				api.Color (kFillColor, brr*0.5,brg*0.5,brb*0.5);

				api.setFrame (frame1);
				var verts = new Array(4);
				verts[0] = new Vector3(fp0.x, fp0.y);
				verts[1] = new Vector3(fp1.x, fp1.y);
				verts[2] = new Vector3(0, stemWidth1/2);
				verts[3] = new Vector3(0,-stemWidth1/2);

				api.Polygon(verts);
				
				api.popMatrix();	

		}

} 


function leavesBlock(api,frame,lShadow)
{
		var frameL = new Frame2d(frame);
		var lColor = (Math.random()*0.5+0.5)*lShadow;

		if (flowerON == 1 && flowerFrequency > Math.random()*100){


			switch(flowerType)
			{
					case 0:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/4;

						api.Color (kStrokeColor, 0,0,0,0);
						api.Color (kFillColor, Module.vcolorFl.x * fColor,Module.vcolorFl.y*fColor,Module.vcolorFl.z*fColor);
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize *flowerSize, 0.6*treeSize *flowerSize);
			
						verts[2] = new Vector3(0.9*treeSize *flowerSize, 0.8*treeSize *flowerSize);
						verts[3] = new Vector3(1.3*treeSize *flowerSize, 0.6*treeSize *flowerSize);
				
						verts[4] = new Vector3(1.7*treeSize *flowerSize,0*treeSize *flowerSize);
						verts[5] = new Vector3(1.3*treeSize *flowerSize, -0.6*treeSize *flowerSize);

						verts[6] = new Vector3(0.9*treeSize *flowerSize,-0.8*treeSize *flowerSize);
						verts[7] = new Vector3(0.5*treeSize *flowerSize, -0.6*treeSize *flowerSize);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;
									
					case 1:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/8;

						api.Color (kStrokeColor, 0,0,0,0);
								
					
					api.Color (kFillColor, Module.vcolorFl.x * fColor,Module.vcolorFl.y*fColor,Module.vcolorFl.z*fColor);
						
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize *flowerSize, 0.6*treeSize *flowerSize);
			
						verts[2] = new Vector3(0.9*treeSize *flowerSize, 0.8*treeSize *flowerSize);
						verts[3] = new Vector3(1.3*treeSize *flowerSize, 0.6*treeSize *flowerSize);
				
						verts[4] = new Vector3(1.7*treeSize *flowerSize,0*treeSize *flowerSize);
						verts[5] = new Vector3(1.3*treeSize *flowerSize, -0.6*treeSize *flowerSize);

						verts[6] = new Vector3(0.9*treeSize *flowerSize,-0.8*treeSize *flowerSize);
						verts[7] = new Vector3(0.5*treeSize *flowerSize, -0.6*treeSize *flowerSize);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;
								
								
								
					case 2:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/4;

						api.Color (kStrokeColor, 0,0,0,0);
						api.Color (kFillColor, Module.vcolorFl.x * fColor,Module.vcolorFl.y*fColor,Module.vcolorFl.z*fColor);
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05) *flowerSize, 0.6*treeSize+(Math.random()*0.1-0.05) *flowerSize);
			
						verts[2] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05) *flowerSize, 0.8*treeSize+(Math.random()*0.1-0.05) *flowerSize);
						verts[3] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05) *flowerSize, 0.6*treeSize+(Math.random()*0.1-0.05) *flowerSize);
				
						verts[4] = new Vector3(1.7*treeSize+(Math.random()*0.1-0.05) *flowerSize,0*treeSize+(Math.random()*0.1-0.05) *flowerSize);
						verts[5] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05) *flowerSize, -0.6*treeSize+(Math.random()*0.1-0.05) *flowerSize);

						verts[6] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05) *flowerSize,-0.8*treeSize+(Math.random()*0.1-0.05) *flowerSize);
						verts[7] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05) *flowerSize, -0.6*treeSize+(Math.random()*0.1-0.05) *flowerSize);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;				
					
					
						
					default:		

					break;
								}





				
		} else {
			
				var lR = leafColorR*lColor * 1.8;
				if (lR > 1) lR =1;
				var lG = leafColorG*lColor * 1.8;
				if (lG > 1 ) lG =1;
				var lB = leafColorB*lColor * 1.8;
				if (lB > 1) lB = 1;
			
				if (leafType == 0){

				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.5*treeSize*leafSize, 0.4*treeSize*leafSize);
				
				verts[2] = new Vector3(0.9*treeSize*leafSize, 0.5*treeSize*leafSize);
				verts[3] = new Vector3(1.3*treeSize*leafSize, 0.4*treeSize*leafSize);
				
				verts[4] = new Vector3(1.7*treeSize*leafSize,0*treeSize*leafSize);
				verts[5] = new Vector3(1.3*treeSize*leafSize, -0.4*treeSize*leafSize);

				verts[6] = new Vector3(0.9*treeSize*leafSize,-0.5*treeSize*leafSize);
				verts[7] = new Vector3(0.5*treeSize*leafSize, -0.4*treeSize*leafSize);
				
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (leafType == 1){

				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				verts[0] = new Vector3(0+(Math.random()*0.1-0.05)*leafSize, 0+(Math.random()*0.1-0.05)*leafSize);
				verts[1] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05)*leafSize, 0.4*treeSize+(Math.random()*0.1-0.05)*leafSize);
				
				verts[2] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05)*leafSize, 0.5*treeSize+(Math.random()*0.1-0.055)*leafSize);
				verts[3] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05)*leafSize, 0.4*treeSize+(Math.random()*0.1-0.05)*leafSize);
				
				verts[4] = new Vector3(1.7*treeSize+(Math.random()*0.1-0.05)*leafSize,0+(Math.random()*0.25-0.125)*leafSize);
				verts[5] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05)*leafSize, -0.4*treeSize+(Math.random()*0.1-0.05)*leafSize);

				verts[6] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05)*leafSize,-0.5*treeSize+(Math.random()*0.1-0.05)*leafSize);
				verts[7] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05)*leafSize, -0.4*treeSize+(Math.random()*0.1-0.05)*leafSize);					
					
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (leafType == 2){
					
				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				var w = Math.random()*0.25-0.125;

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.5*treeSize*leafSize, 0.4*treeSize*leafSize+w);
				
				verts[2] = new Vector3(0.9*treeSize*leafSize, 0.5*treeSize*leafSize+w);
				verts[3] = new Vector3(1.3*treeSize*leafSize, 0.4*treeSize*leafSize+w);
				
				verts[4] = new Vector3(1.7*treeSize*leafSize,0*treeSize*leafSize);
				verts[5] = new Vector3(1.3*treeSize*leafSize, -0.4*treeSize*leafSize-w);

				verts[6] = new Vector3(0.9*treeSize*leafSize,-0.5*treeSize*leafSize-w);
				verts[7] = new Vector3(0.5*treeSize*leafSize, -0.4*treeSize*leafSize-w);
				
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (leafType == 3){
					
				frameL.rotateDeg (Math.random()*90-45);
				
				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.0, 0.25*treeSize*leafSize);
				
				verts[2] = new Vector3(1.2*treeSize*leafSize, 0.9*treeSize*leafSize);
				verts[3] = new Vector3(0.1*treeSize*leafSize, 0.15*treeSize*leafSize);
				
				verts[4] = new Vector3(2*treeSize*leafSize,0*treeSize*leafSize);
				verts[5] = new Vector3(0.1*treeSize*leafSize, -0.15*treeSize*leafSize);

				verts[6] = new Vector3(1.2*treeSize*leafSize,-0.9*treeSize*leafSize);
				verts[7] = new Vector3(0.0*treeSize*leafSize, -0.25*treeSize*leafSize);
				
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} 
	}		


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
	system.setParameter (kApplyFrame, 0);
	//system.setParameter (kIncrementalRender, 0);

	var frame = new Frame2d();
	var initialModule = new Module (frame);
}

var initial = new Initial()

// Static variables defining initial state
// Prefix integer variables with i and float variables with f
Initial.fwinsize = 5;

Engine.addEnvironment ("Brush");
Module.vcolor = new Vector4(0.2,0.6,0.1,1.0); // the leaves color
Module.vcolorBr = new Vector4(0.5,0.2,0.1,1.0); // the branch color
Module.vcolorFl = new Vector4(1,0.2, 0.5,1.0); // flower/fruit color

// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (-Initial.fwinsize, Initial.fwinsize, -Initial.fwinsize, Initial.fwinsize, 
					 -Initial.fwinsize*1.5, Initial.fwinsize*1.5);

Engine.setParameter (kRunSimulation, 1);



/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
var menuModule = [ "Module",

	["iartType", Module.iartType, "", // was "$$$/IDS_PI_PROC_TREE_STYLE=Tree style:", 
                                     [  "$$$/IDS_PI_PROC_APRICOT_TREE=Apricot Tree", 
									 "$$$/IDS_PI_PROC_ASH_TREE=Ash Tree", 
									 "$$$/IDS_PI_PROC_ASPEN_TREE=Aspen Tree", 
									 "$$$/IDS_PI_PROC_BIRCH_TREE=Birch Tree", 
									 "$$$/IDS_PI_PROC_CHRISTMAS_TREE=Christmas Tree", 
									 "$$$/IDS_PI_PROC_CUPRESSUS_TREE=Cupressus Tree", 
									 "$$$/IDS_PI_PROC_CURL_VINE=Curl Vine", 
									 "$$$/IDS_PI_PROC_CYPRESS_TREE=Cypress Tree", 
									 "$$$/IDS_PI_PROC_GARDEN_PLANT=Garden Plant", 
									 "$$$/IDS_PI_PROC_GINKGO_TREE=Ginkgo Tree", 
									 "$$$/IDS_PI_PROC_GRASS=Grass", 
									 "$$$/IDS_PI_PROC_MAPLE_TREE=Maple Tree", 
									 "$$$/IDS_PI_PROC_ORANGE_TREE=Orange Tree", 
									 "$$$/IDS_PI_PROC_POPLAR_TREE=Poplar Tree", 
									 "$$$/IDS_PI_PROC_REDBUD_TREE=Redbud Tree", 
									 "$$$/IDS_PI_PROC_VINE=Vine", 
									 "$$$/IDS_PI_PROC_WINTER_BARE=Winter Bare", 
									 "$$$/IDS_PI_PROC_WINTER_DECIDUOUS=Winter Deciduous",
									 "$$$/IDS_PI_PROC_WINTER_EVERGREEN=Winter Evergreen", 
									 "$$$/IDS_PI_PROC_WINTER_ICICLES=Winter Icicles", 
									 ]],



		["fsymbolScaley", Module.fsymbolScaley, "$$$/IDS_PI_PROC_TREE_SCALE=Tree scale:", [0.75, 1], 1, "%"],
		["vcolorBr", Module.vcolorBr, "$$$/IDS_PI_PROC_BRANCH_COLOR=Branch color:", [0,1]],
		["vcolor", Module.vcolor, "$$$/IDS_PI_PROC_LEAF_COLOR=Leaf color:", [0,1]],
		["vcolorFl", Module.vcolorFl, "$$$/IDS_PI_PROC_FLOWER_FRUIT_COLOR=Flower/Fruit color:", [0,1]],	
];


// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule);

Engine.setInitialObject (initial);

