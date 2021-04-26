var roundCorners = 0.0;

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
// Object Module


Module.iartType = 1;






Module.ibranchOn = 0;
Module.icalligraphic = 1;


Module.fsymbolScalex = 1;
Module.fsymbolScaley = 1;
Module.fsymbolScaley1 = 1;
Module.fsymbolRotate1 = 0;
Module.fsymbolRotate2 = 0;
Module.isymbolRotate = 1;

var mouseInfo = 0;
var index = 1;

var makeNewGroup = false
//RenderAPI.command (kCommandNewGroup)

function Module (frame)
{
	this.frame = frame;
	this.index = index++;
	this.seed = -1;
	this.pressure = 30;
	this.bearing = 0;
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
		if (this.visible == 1)
		{
			//roundCorners = 0.2
			//system.setModuleParameter (this, "call", "render", 1);
			//this.visible = 2;
		}
		else if (this.visible == 2)
		{
			system.setModuleParameter (this, "call", "render", 0);
			roundCorners = 0;
			this.visible = 3;
		}

		//if (lastPositionValid)
		{
			// first time after button down
			makeNewGroup = true;
		}
			
		lastPositionValid = 0;
		return kCallAgain
	}

	if (this.visible)
		return kCallAgain;
		
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
	
	return kCallAgain;
}


var frame = new Frame2d;
var frameB;

var p3;

var prestemWidth = 0;
var firstTime = 0;
var stemLength;

var petalNumber;
var branchNumber = 0;

var brNumber = 0;



var stemWidth;
var stemBlock;
var stemRoughness;

var FbranchON;

var FmainBranchStartsFrom;
var FmainBranchStartAngleRange1;
var FmainBranchStartAngleRange2;
var FmainBranchWidth;
var FmainBranchLength;
var FmainBranchBlock;
var FmainBranchDirection;
var FmainBranchCurl;

var FmainBranchLengthBack = 0;

var FchildBranchStartsFrom;
var FchildBranchFrequency;
var FchildBranchStartAngleRange1;
var FchildBranchStartAngleRange2;
var FchildBranchWidth;
var FchildBranchLength;
var FchildBranchBlock;
var FchildBranchDirection;
var FchildBranchCurl;

var petal2ON
var petalColor;
var petalColorR;
var petalColorG;
var petalColorB;
var petal2Type;
var petal2Frequency;
var petal2Size;


var LbranchON;

var LmainBranchStartsFrom;
var LmainBranchStartAngleRange1;
var LmainBranchStartAngleRange2;
var LmainBranchWidth;
var LmainBranchLength;
var LmainBranchBlock;
var LmainBranchDirection;
var LmainBranchCurl;

var LmainBranchLengthBack = 0;

var LchildBranchStartsFrom;
var LchildBranchFrequency;
var LchildBranchStartAngleRange1;
var LchildBranchStartAngleRange2;
var LchildBranchWidth;
var LchildBranchLength;
var LchildBranchBlock;
var LchildBranchDirection;
var LchildBranchCurl;

var LbudON

var LbudType;
var LbudFrequency;
var LbudSize;

var layerBase;

// how to rotate based on the screen orientation  memo
//				frame.rotateDeg (Math.atan2 (this.frame.heading().x, this.frame.heading().y) * 180 / 3.14
//			                 - 90);

Module.prototype.render = function (api, env)
{

	if (makeNewGroup)
	{
		petalNumber = 200;
		firstTime = 0;
	
		treeInitialize(Module.iartType);
	
		treeSize = Module.fsymbolScaley * 0.1;	
						
		brNumber = 0;
		api.setParameter (kRenderOrder, kRenderOnTop);

		petalColorR = Module.vcolor.x;
		petalColorG = Module.vcolor.y;
		petalColorB = Module.vcolor.z;
		
		
		stemWidth = stemWidth * treeSize;
		FmainBranchLength = FmainBranchLength * treeSize;
		FmainBranchBlock = FmainBranchBlock * treeSize;
		FchildBranchLength = FchildBranchLength * treeSize;
		FchildBranchBlock = FchildBranchBlock * treeSize;
		
		
		
		
		RenderAPI.command (kCommandNewGroup)
		makeNewGroup = false;
	}

	if (this.seed < 0)
	{			
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

				if (FbranchON >= 0){
					brBlock(api,frame,frameB,stemWidth,prestemWidth,0);
				}


					temp =  Math.random()+1;
		
					for( i = 0; i < temp; i++)
					{

						LmainBranch(api,fInbetween(frame, frameB,Math.random()*10),FmainBranchBlock,stemWidth,brNumber, brNumber-FmainBranchStartsFrom);
						
						api.setParameter (kRenderOrder, kRenderOnTop);
						RenderAPI.setParameter(kRenderID,branchNumber);
						branchNumber++;						
						
						FmainBranch(api,fInbetween(frame, frameB,Math.random()*10),FmainBranchBlock,stemWidth,brNumber, brNumber-FmainBranchStartsFrom);

					}

				brNumber++;

				prestemWidth = stemWidth;
				p3 = p2;
				frameB = new Frame2d(frame);

		}


			
	//Engine.removeModule (this);
	//Engine.setModuleParameter (this, "call", "render", 0);
		
	return kDontCallAgain; 
}


function treeInitialize(flowerType){
	
		switch(flowerType)
		{


			case 1: // Garden Flowers
			
			stemWidth =  0.3; //Module.fbrushWidth;
			stemBlock = 0.01;
			stemRoughness = 0.01* Module.fsymbolScaley;
		

			if (Module.ibranchOn == 1)
			{
				FbranchON = 1;
			} else {
				FbranchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			}
			FpetalsON = 1; // 0.. OFF, 1.. ON		
			petal2ON = 0; // 0.. OFF, 1.. ON
			petal2Type = 0;
			petal2Frequency = 5;  // %
			petal2Size = 1;

			FmainBranchStartAngleRange1 = 0;
			FmainBranchStartAngleRange2 = 1;
			FmainBranchStartAngleRange2 = FmainBranchStartAngleRange2 - FmainBranchStartAngleRange1;
			FmainBranchWidth = 0.99;   
			FmainBranchLength = 20;
			FmainBranchBlock = 0.1;
			FmainBranchDirection = "curl3";  // straight, parallel, curl, curl2, curl3, vine
			FmainBranchCurl = -20/Module.fsymbolScaley;

			FchildBranchStartsFrom = 150;
			FchildBranchFrequency = 30;
			FchildBranchStartAngleRange1 = 85;
			FchildBranchStartAngleRange2 = 95;
			FchildBranchStartAngleRange2 = FmainBranchStartAngleRange2 - FmainBranchStartAngleRange1;
			FchildBranchWidth = 0.6;   
			FchildBranchLength = 0.5* Module.fsymbolScaley;
			FchildBranchBlock = 1.5;
			FchildBranchDirection = "curl3"; // straight, parallel, up, down, curl, curl3, vine
			FchildBranchCurl = -5;

			petalType = 0;
			petalSize = 3* Module.fsymbolScaley;			


			if (Module.ibranchOn == 1)
			{
				LbranchON = 1;
			} else {
				LbranchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			}
			LleavesON = 1; // 0.. OFF, 1.. ON		
			LbudON = 1; // 0.. OFF, 1.. ON
			LbudType = 0;
			LbudFrequency = 5;  // %
			LbudSize = 1;

			LmainBranchStartAngleRange1 = 1;
			LmainBranchStartAngleRange2 = 60;
			LmainBranchStartAngleRange2 = LmainBranchStartAngleRange2 - LmainBranchStartAngleRange1;
			LmainBranchWidth = 0.7;   
			LmainBranchLength = 1* Module.fsymbolScaley1;
			LmainBranchBlock = 0.4;
			LmainBranchDirection = "curl";  // straight, parallel, curl, curl2, curl3, vine
			LmainBranchCurl = -2;

			LchildBranchStartsFrom = 1;
			LchildBranchFrequency = 15;   //  1 = 100%
			LchildBranchStartAngleRange1 = 10;
			LchildBranchStartAngleRange2 = 100;
			LchildBranchStartAngleRange2 = LmainBranchStartAngleRange2 - LmainBranchStartAngleRange1;
			LchildBranchWidth = 0.80;   
			LchildBranchLength = 0.5* Module.fsymbolScaley1;
			LchildBranchBlock = 0.25;
			LchildBranchDirection = "curl"; // straight, parallel, up, down, curl, curl3, vine
			LchildBranchCurl = 2;

			LleafType = 2;
			LleafSize = 2* Module.fsymbolScaley1;
			
			break;
			

			case 2: // rose
			
			stemWidth =  0.5; //Module.fbrushWidth;
			stemBlock = 0.01;
			stemRoughness = 0.01* Module.fsymbolScaley;
		


			if (Module.ibranchOn == 1)
			{
				FbranchON = 0;
			} else {
				FbranchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			}
			FpetalsON = 1; // 0.. OFF, 1.. ON		
			petal2ON = 0; // 0.. OFF, 1.. ON
			petal2Type = 0;
			petal2Frequency = 0;  // %
			petal2Size = 1;

			FmainBranchStartAngleRange1 = 0;
			FmainBranchStartAngleRange2 = 1;
			FmainBranchStartAngleRange2 = FmainBranchStartAngleRange2 - FmainBranchStartAngleRange1;
			FmainBranchWidth = 0.99;   
			FmainBranchLength = 20;
			FmainBranchBlock = 0.1;
			FmainBranchDirection = "curl3";  // straight, parallel, curl, curl2, curl3, vine
			FmainBranchCurl = -80/Module.fsymbolScaley;

			FchildBranchStartsFrom = 100;
			FchildBranchFrequency = 15;   //  1 = 100%
			FchildBranchStartAngleRange1 = 90;
			FchildBranchStartAngleRange2 = 90;
			FchildBranchStartAngleRange2 = FmainBranchStartAngleRange2 - FmainBranchStartAngleRange1;
			FchildBranchWidth = 0.99;   
			FchildBranchLength = 1* Module.fsymbolScaley;
			FchildBranchBlock = 1.5;
			FchildBranchDirection = "straight"; // straight, parallel, up, down, curl, curl3, vine
			FchildBranchCurl = -3;

			petalType = 1;
			petalSize = 2.5* Module.fsymbolScaley;			


			if (Module.ibranchOn == 1)
			{
				LbranchON = 1;
			} else {
				LbranchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			}
			LleavesON = 1; // 0.. OFF, 1.. ON		
			LbudON = 0; // 0.. OFF, 1.. ON
			LbudType = 0;
			LbudFrequency = 5;  // %
			LbudSize = 1;

			LmainBranchStartAngleRange1 = 1;
			LmainBranchStartAngleRange2 = 100;
			LmainBranchStartAngleRange2 = LmainBranchStartAngleRange2 - LmainBranchStartAngleRange1;
			LmainBranchWidth = 0.7;   
			LmainBranchLength =0.4* Module.fsymbolScaley1;
			LmainBranchBlock = 0.4;
			LmainBranchDirection = "curl";  // straight, parallel, curl, curl2, curl3, vine
			LmainBranchCurl = -2;

			LchildBranchStartsFrom = 1;
			LchildBranchFrequency = 40;   //  1 = 100%
			LchildBranchStartAngleRange1 = 10;
			LchildBranchStartAngleRange2 = 160;
			LchildBranchStartAngleRange2 = LmainBranchStartAngleRange2 - LmainBranchStartAngleRange1;
			LchildBranchWidth = 0.80;   
			LchildBranchLength = 0.6* Module.fsymbolScaley1;
			LchildBranchBlock = 0.5;
			LchildBranchDirection = "vine"; // straight, parallel, up, down, curl, curl3, vine
			LchildBranchCurl = 3;

			LleafType = 0;
			LleafSize = 2.5* Module.fsymbolScaley1;


			break;



			case 3: // Poinsettia
			
			stemWidth =  0.5; //Module.fbrushWidth;
			stemBlock = 0.01;
			stemRoughness = 0.01* Module.fsymbolScaley;
		


			if (Module.ibranchOn == 1)
			{
				FbranchON = 0;
			} else {
				FbranchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			}
			FpetalsON = 1; // 0.. OFF, 1.. ON		
			petal2ON = 0; // 0.. OFF, 1.. ON
			petal2Type = 0;
			petal2Frequency = 0;  // %
			petal2Size = 1;

			FmainBranchStartAngleRange1 = 0;
			FmainBranchStartAngleRange2 = 1;
			FmainBranchStartAngleRange2 = FmainBranchStartAngleRange2 - FmainBranchStartAngleRange1;
			FmainBranchWidth = 0.99;   
			FmainBranchLength = 20;
			FmainBranchBlock = 0.1;
			FmainBranchDirection = "curl3"; // straight, parallel, curl, curl2, curl3, vine
			FmainBranchCurl = -80/Module.fsymbolScaley;

			FchildBranchStartsFrom = 100;
			FchildBranchFrequency = 15;   //  1 = 100%
			FchildBranchStartAngleRange1 = 90;
			FchildBranchStartAngleRange2 = 90;
			FchildBranchStartAngleRange2 = FmainBranchStartAngleRange2 - FmainBranchStartAngleRange1;
			FchildBranchWidth = 0.99;   
			FchildBranchLength = 1* Module.fsymbolScaley;
			FchildBranchBlock = 1.5;
			FchildBranchDirection = "straight"; // straight, parallel, up, down, curl, curl3, vine
			FchildBranchCurl = -3;

			petalType = 2;
			petalSize = 4* Module.fsymbolScaley;			


			if (Module.ibranchOn == 1)
			{
				LbranchON = 1;
			} else {
				LbranchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			}
			LleavesON = 1; // 0.. OFF, 1.. ON		
			LbudON = 0; // 0.. OFF, 1.. ON
			LbudType = 0;
			LbudFrequency = 5;  // %
			LbudSize = 1;

			LmainBranchStartAngleRange1 = 1;
			LmainBranchStartAngleRange2 = 100;
			LmainBranchStartAngleRange2 = LmainBranchStartAngleRange2 - LmainBranchStartAngleRange1;
			LmainBranchWidth = 0.7;   
			LmainBranchLength =0.4* Module.fsymbolScaley1;
			LmainBranchBlock = 0.4;
			LmainBranchDirection = "curl"; // straight, parallel, curl, curl2, curl3, vine
			LmainBranchCurl = -2;

			LchildBranchStartsFrom = 1;
			LchildBranchFrequency = 40;   //  1 = 100%
			LchildBranchStartAngleRange1 = 10;
			LchildBranchStartAngleRange2 = 160;
			LchildBranchStartAngleRange2 = LmainBranchStartAngleRange2 - LmainBranchStartAngleRange1;
			LchildBranchWidth = 0.80;   
			LchildBranchLength = 0.6* Module.fsymbolScaley1;
			LchildBranchBlock = 0.5;
			LchildBranchDirection = "vine"; // straight, parallel, up, down, curl, curl3, vine
			LchildBranchCurl = 3;

			LleafType = 4;
			LleafSize = 3* Module.fsymbolScaley1;




			
			break;



			case 4: // berry
			
			stemWidth =  0.5;
			stemBlock = 0.01;
			stemRoughness = 0.01* Module.fsymbolScaley;
		


			if (Module.ibranchOn == 1)
			{
				FbranchON = 0;
			} else {
				FbranchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			}
			FpetalsON = 1; // 0.. OFF, 1.. ON		
			petal2ON = 0; // 0.. OFF, 1.. ON
			petal2Type = 0;
			petal2Frequency = 0;  // %
			petal2Size = 1;

			FmainBranchStartAngleRange1 = 0;
			FmainBranchStartAngleRange2 = 1;
			FmainBranchStartAngleRange2 = FmainBranchStartAngleRange2 - FmainBranchStartAngleRange1;
			FmainBranchWidth = 0.99;  //  1 = 100%
			FmainBranchLength = 20;
			FmainBranchBlock = 0.1;
			FmainBranchDirection = "curl3"; // straight, parallel, curl, curl2, curl3, vine
			FmainBranchCurl = -80/Module.fsymbolScaley;

			FchildBranchStartsFrom = 90;
			FchildBranchFrequency = 5;   //  %
			FchildBranchStartAngleRange1 = 90;
			FchildBranchStartAngleRange2 = 90;
			FchildBranchStartAngleRange2 = FmainBranchStartAngleRange2 - FmainBranchStartAngleRange1;
			FchildBranchWidth = 1;   
			FchildBranchLength = 2* Module.fsymbolScaley;
			FchildBranchBlock = 1.5;
			FchildBranchDirection = "straight"; // straight, parallel, up, down, curl, curl3, vine
			FchildBranchCurl = -3;

			petalType = 4;
			petalSize = 0.8* Module.fsymbolScaley;			


			if (Module.ibranchOn == 1)
			{
				LbranchON = 1;
			} else {
				LbranchON = -1;  //    0.. OFF, 1.. Main Branch ON,   2.. Main Branch and Child Branch ON,  3.. Child Branch ON
			}
			LleavesON = 1; // 0.. OFF, 1.. ON		
			LbudON = 0; // 0.. OFF, 1.. ON
			LbudType = 0;
			LbudFrequency = 5;  // %
			LbudSize = 1;

			LmainBranchStartAngleRange1 = 1;
			LmainBranchStartAngleRange2 = 100;
			LmainBranchStartAngleRange2 = LmainBranchStartAngleRange2 - LmainBranchStartAngleRange1;
			LmainBranchWidth = 0.7;   
			LmainBranchLength =0.4* Module.fsymbolScaley1;
			LmainBranchBlock = 0.4;
			LmainBranchDirection = "curl";// straight, parallel, curl, curl2, curl3, vine
			LmainBranchCurl = -2;

			LchildBranchStartsFrom = 1;
			LchildBranchFrequency = 30;   //  1 = 100%
			LchildBranchStartAngleRange1 = 10;
			LchildBranchStartAngleRange2 = 160;
			LchildBranchStartAngleRange2 = LmainBranchStartAngleRange2 - LmainBranchStartAngleRange1;
			LchildBranchWidth = 0.80;   
			LchildBranchLength = 0.6* Module.fsymbolScaley1;
			LchildBranchBlock = 0.5;
			LchildBranchDirection = "vine"; // straight, parallel, up, down, curl, curl3, vine
			LchildBranchCurl = 3;

			LleafType = 5;
			LleafSize =5* Module.fsymbolScaley1;


			break;





			default:		
			break;
		}

}

function FmainBranch(api,frame,branchBlock,stemWidth,brNumber, n)
{
	
					var branchDirection = 0.5;
					var branchDirection2 = 1;
					var branchDirection3;
					
					var lShadow = Math.random()*0.5 + 0.5;

					var frame1 = new Frame2d(frame);
					var frame2 = new Frame2d(frame);

					var branchWidth = stemWidth*FmainBranchWidth;
					var branchWidth1= stemWidth*FmainBranchWidth;

					var length = 0;
					var block;

					var i = 0;
					var mb = 0;


					while (length < FmainBranchLength)
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
								branchDirection3 = -(Math.random()*FmainBranchStartAngleRange2+FmainBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.9;
								branchDirection2 = 1;
							}else{
								branchDirection3 = (Math.random()*FmainBranchStartAngleRange2+FmainBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.1;
								branchDirection2 = -1;
							}
							
						}else{
								switch(FmainBranchDirection)
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
									var bd = Math.random()*FmainBranchCurl*branchDirection2;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);
									break;
									
									case "curl2":			
									var bd = ((brNumber -FmainBranchStartsFrom)/4 * FmainBranchCurl -1)*branchDirection2;
									if (bd > 5) bd = 5;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);									
									break;
									
									case "curl3":
									var bd = length*FmainBranchCurl*branchDirection2*0.1;
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

						if (FbranchON == 1 || FbranchON == 2 )
						{
							brBlock(api, frame1, frame2, branchWidth, branchWidth1,(branchDirection2 == 1));
						}

						if (FchildBranchFrequency > Math.random()*100 && mb >= FchildBranchStartsFrom)
							FchildBranch(api,frame1, FchildBranchBlock , branchWidth,2,branchDirection3,lShadow,(branchDirection2 == 1),i);

							branchWidth = branchWidth1;

						i++;
						}
					
					
						
}

function FchildBranch(api,frame,branchBlock,stemWidth,brNumber,branchDirection4,lShadow,r,i2)
{

	
					var branchDirection = 0.5;
					var branchDirection2 = 1;
					var branchDirection3;
					
					var chShadow = (Math.random()*0.5+0.5)*lShadow;

					var frame1 = new Frame2d(frame);
					var frame2 = new Frame2d(frame);

					var branchWidth = stemWidth*FchildBranchWidth;
					var branchWidth1= stemWidth*FchildBranchWidth;

					var length = 0;
					var block;

					var i = 0;


						frame1 = frame2;
						frame2 = new Frame2d(frame1);

						if (i == 0)
						{
								branchDirection3 = (Math.random()*FchildBranchStartAngleRange2+FchildBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.1;
								branchDirection2 = -1;

							
						}else{
								switch(FchildBranchDirection)
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
									frame2.rotateDeg(Math.random()*FchildBranchCurl*branchDirection2);
									break;
									
									
									case "curl3":
									var bd = length*FmainBranchCurl*branchDirection2*0.1;
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
						frame2.translate (block /*+Math.random()*stemRoughness - stemRoughness/2 */,(Math.random()*stemRoughness - stemRoughness/2)*treeSize);

						if (FbranchON == 2 || FbranchON == 3)
							brBlock(api, frame1, frame2, branchWidth, branchWidth1,r);
						if (FpetalsON == 1)
							petalsBlock(api,frame1,chShadow,i2);



						i++;

}


function LmainBranch(api,frame,branchBlock,stemWidth,brNumber, n)
{
	
					var branchDirection = 0.5;
					var branchDirection2 = 1;
					var branchDirection3;
					
					var lShadow = Math.random()*0.5 + 0.5;

					var frame1 = new Frame2d(frame);
					var frame2 = new Frame2d(frame);

					var branchWidth = stemWidth*LmainBranchWidth;
					var branchWidth1= stemWidth*LmainBranchWidth;

					var length = 0;
					var block;

					var i = 0;
					var mb = 0;


					while (length < LmainBranchLength)
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
								branchDirection3 = -(Math.random()*LmainBranchStartAngleRange2+LmainBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.9;
								branchDirection2 = 1;
							}else{
								branchDirection3 = (Math.random()*LmainBranchStartAngleRange2+LmainBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.1;
								branchDirection2 = -1;
							}
							
						}else{
								switch(LmainBranchDirection)
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
									var bd = Math.random()*LmainBranchCurl*branchDirection2;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);
									break;
									
									case "curl2":			
									var bd = ((brNumber -LmainBranchStartsFrom)/4 * LmainBranchCurl -1)*branchDirection2;
									if (bd > 5) bd = 5;
									branchDirection3 = branchDirection3 + bd;
									frame2.rotateDeg(bd);									
									break;
									
									case "curl3":
									var bd = length*LmainBranchCurl*branchDirection2*0.1;
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
						frame2.translate (block /*+Math.random()*stemRoughness - stemRoughness/2 */,(Math.random()*stemRoughness - stemRoughness/2)*treeSize);

						if (LbranchON == 1 || LbranchON == 2 )
						{
							brBlock(api, frame1, frame2, branchWidth, branchWidth1,(branchDirection2 == 1));
						}

						if (LchildBranchFrequency > Math.random()*100 && mb >= LchildBranchStartsFrom)
							LchildBranch(api,frame1, LchildBranchBlock /*(Math.random()*branchWidth*0.2+0.5)*treeSize */ , branchWidth,2,branchDirection3,lShadow,(branchDirection2 == 1));


						i++;
						}
					
	
						
}

function LchildBranch(api,frame,branchBlock,stemWidth,brNumber,branchDirection4,lShadow,r)
{

	
					var branchDirection = 0.5;
					var branchDirection2 = 1;
					var branchDirection3;
					
					var chShadow = (Math.random()*0.5+0.5)*lShadow;

					var frame1 = new Frame2d(frame);
					var frame2 = new Frame2d(frame);

					var branchWidth = stemWidth*LchildBranchWidth;
					var branchWidth1= stemWidth*LchildBranchWidth;

					var length = 0;
					var block;

					var i = 0;

					while (length < LchildBranchLength)
					{
						frame1 = frame2;
						frame2 = new Frame2d(frame1);

						if (i == 0)
						{
								branchDirection3 = (Math.random()*LchildBranchStartAngleRange2+LchildBranchStartAngleRange1);
								frame2.rotateDeg (branchDirection3);
								frame1.rotateDeg (branchDirection3);
								branchDirection = 0.1;
								branchDirection2 = -1;

							
						}else{
								switch(LchildBranchDirection)
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
									frame2.rotateDeg(Math.random()*LchildBranchCurl*branchDirection2);
									break;
									
									
									case "curl3":
									var bd = length*LmainBranchCurl*branchDirection2*0.1;
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

						if (LbranchON == 2 || LbranchON == 3)
							brBlock(api, frame1, frame2, branchWidth, branchWidth1,r);
						if (LleavesON == 1)
							leavesBlock(api,frame1,chShadow);

						i++;
						}
}



function brBlock(api,frame1,frame2,stemWidth1,stemWidth2,r)
{
	
	
				api.pushMatrix();	

				frame2.translate (0,-stemWidth2/2);
				var fp0 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,stemWidth2);
				var fp1 = frame1.toLocalCoords(frame2.position());
				frame2.translate (0,-stemWidth2/2);

				api.Color (kStrokeColor, 0.5,0.2,0.1,0);
				api.Color (kFillColor, Module.vcolorBr.x,Module.vcolorBr.y,Module.vcolorBr.z);

				api.setFrame (frame1);
				var verts = new Array(4);
				verts[0] = new Vector3(fp0.x, fp0.y);
				verts[1] = new Vector3(fp1.x, fp1.y);
				verts[2] = new Vector3(0, stemWidth1/2);
				verts[3] = new Vector3(0,-stemWidth1/2);

				api.Polygon(verts);		
			
				api.popMatrix();	



} 


function petalsBlock(api,frame,lShadow,n)
{
		var frameL = new Frame2d(frame);
		var lColor = (Math.random()*0.5+0.5)*lShadow;

		if (petal2ON == 1 && petal2Frequency > Math.random()*100){


			switch(petal2Type)
			{
					case 0:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/4;

						api.Color (kStrokeColor, 0,0,0,0);
						api.Color (kFillColor, Module.vcolorFr.x * fColor,Module.vcolorFr.y*fColor,Module.vcolorFr.z*fColor);
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize *petal2Size, 0.6*treeSize *petal2Size);
			
						verts[2] = new Vector3(0.9*treeSize *petal2Size, 0.8*treeSize *petal2Size);
						verts[3] = new Vector3(1.3*treeSize *petal2Size, 0.6*treeSize *petal2Size);
				
						verts[4] = new Vector3(1.7*treeSize *petal2Size,0*treeSize *petal2Size);
						verts[5] = new Vector3(1.3*treeSize *petal2Size, -0.6*treeSize *petal2Size);

						verts[6] = new Vector3(0.9*treeSize *petal2Size,-0.8*treeSize *petal2Size);
						verts[7] = new Vector3(0.5*treeSize *petal2Size, -0.6*treeSize *petal2Size);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;
									
					case 1:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/8;

						api.Color (kStrokeColor, 0,0,0,0);
				
					
					api.Color (kFillColor, Module.vcolorFr.x * fColor,Module.vcolorFr.y*fColor,Module.vcolorFr.z*fColor);
						
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize *petal2Size, 0.6*treeSize *petal2Size);
			
						verts[2] = new Vector3(0.9*treeSize *petal2Size, 0.8*treeSize *petal2Size);
						verts[3] = new Vector3(1.3*treeSize *petal2Size, 0.6*treeSize *petal2Size);
				
						verts[4] = new Vector3(1.7*treeSize *petal2Size,0*treeSize *petal2Size);
						verts[5] = new Vector3(1.3*treeSize *petal2Size, -0.6*treeSize *petal2Size);

						verts[6] = new Vector3(0.9*treeSize *petal2Size,-0.8*treeSize *petal2Size);
						verts[7] = new Vector3(0.5*treeSize *petal2Size, -0.6*treeSize *petal2Size);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;
								
								
								
					case 2:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/4;

						api.Color (kStrokeColor, 0,0,0,0);
						api.Color (kFillColor, Module.vcolorFr.x * fColor,Module.vcolorFr.y*fColor,Module.vcolorFr.z*fColor);
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05) *petal2Size, 0.6*treeSize+(Math.random()*0.1-0.05) *petal2Size);
			
						verts[2] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05) *petal2Size, 0.8*treeSize+(Math.random()*0.1-0.05) *petal2Size);
						verts[3] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05) *petal2Size, 0.6*treeSize+(Math.random()*0.1-0.05) *petal2Size);
				
						verts[4] = new Vector3(1.7*treeSize+(Math.random()*0.1-0.05) *petal2Size,0*treeSize+(Math.random()*0.1-0.05) *petal2Size);
						verts[5] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05) *petal2Size, -0.6*treeSize+(Math.random()*0.1-0.05) *petal2Size);

						verts[6] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05) *petal2Size,-0.8*treeSize+(Math.random()*0.1-0.05) *petal2Size);
						verts[7] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05) *petal2Size, -0.6*treeSize+(Math.random()*0.1-0.05) *petal2Size);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;				
					
					
						
					default:		

					break;
								}





				
		} else {
			
				var lR = petalColorR*lColor * 1.8;
				if (lR > 1) lR =1;
				var lG = petalColorG*lColor * 1.8;
				if (lG > 1 ) lG =1;
				var lB = petalColorB*lColor * 1.8;
				if (lB > 1) lB = 1;
			
				if (petalType == 0){

//RenderAPI.setParameter (kRoundPolygonCorners, roundCorners);

				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.5*treeSize*petalSize, 0.4*treeSize*petalSize);
				
				verts[2] = new Vector3(0.9*treeSize*petalSize, 0.5*treeSize*petalSize);
				verts[3] = new Vector3(1.3*treeSize*petalSize, 0.4*treeSize*petalSize);
				
				verts[4] = new Vector3(1.7*treeSize*petalSize,0*treeSize*petalSize);
				verts[5] = new Vector3(1.3*treeSize*petalSize, -0.4*treeSize*petalSize);

				verts[6] = new Vector3(0.9*treeSize*petalSize,-0.5*treeSize*petalSize);
				verts[7] = new Vector3(0.5*treeSize*petalSize, -0.4*treeSize*petalSize);
				
				
				api.Polygon(verts);
				api.popMatrix();	

//RenderAPI.setParameter (kRoundPolygonCorners, 0);
				
				
		} else if (petalType == 1){  // rose
			
				petalSize2 = 140/n;
				lR *= petalSize2;
				if (lR > 1) lR =1;
				lG *= petalSize2;
				if (lG > 1 ) lG =1;
				lB *= petalSize2;
				if (lB > 1) lB = 1;
			
				
				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR , lG , lB );
				api.pushMatrix();
				api.setFrame (frameL);

				var verts = new Array(10);

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.1*treeSize*petalSize * petalSize2, 0.7*treeSize*petalSize * petalSize2);
				
				verts[2] = new Vector3(0.5*treeSize*petalSize * petalSize2, 0.9*treeSize*petalSize * petalSize2);
				verts[3] = new Vector3(1.0*treeSize*petalSize * petalSize2, 0.7*treeSize*petalSize * petalSize2);
				
				verts[4] = new Vector3(1.2*treeSize*petalSize * petalSize2,0.3*treeSize*petalSize * petalSize2);
				verts[5] = new Vector3(1.4*treeSize*petalSize * petalSize2, 0*treeSize*petalSize * petalSize2);

				verts[6] = new Vector3(1.2*treeSize*petalSize * petalSize2,-0.3*treeSize*petalSize * petalSize2);
				verts[7] = new Vector3(1.0*treeSize*petalSize * petalSize2, -0.7*treeSize*petalSize * petalSize2);

				verts[8] = new Vector3(0.5*treeSize*petalSize * petalSize2,-0.9*treeSize*petalSize * petalSize2);
				verts[9] = new Vector3(0.1*treeSize*petalSize * petalSize2, -0.7*treeSize*petalSize * petalSize2);

				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (petalType == 2){ 
					
				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				var w = 0.03; //Math.random()*0.25-0.125;

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.2*treeSize*petalSize, 0.2*treeSize*petalSize+w);
				
				verts[2] = new Vector3(0.5*treeSize*petalSize, 0.3*treeSize*petalSize+w);
				verts[3] = new Vector3(0.9*treeSize*petalSize, 0.2*treeSize*petalSize+w);
				
				verts[4] = new Vector3(1.3*treeSize*petalSize,0*treeSize*petalSize);
				verts[5] = new Vector3(0.9*treeSize*petalSize, -0.2*treeSize*petalSize-w);

				verts[6] = new Vector3(0.5*treeSize*petalSize,-0.3*treeSize*petalSize-w);
				verts[7] = new Vector3(0.2*treeSize*petalSize, -0.2*treeSize*petalSize-w);
				
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (petalType == 3){
					
				frameL.rotateDeg (Math.random()*90-45);
				
				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.0, 0.25*treeSize*petalSize);
				
				verts[2] = new Vector3(1.2*treeSize*petalSize, 0.9*treeSize*petalSize);
				verts[3] = new Vector3(0.1*treeSize*petalSize, 0.15*treeSize*petalSize);
				
				verts[4] = new Vector3(2*treeSize*petalSize,0*treeSize*petalSize);
				verts[5] = new Vector3(0.1*treeSize*petalSize, -0.15*treeSize*petalSize);

				verts[6] = new Vector3(1.2*treeSize*petalSize,-0.9*treeSize*petalSize);
				verts[7] = new Vector3(0.0*treeSize*petalSize, -0.25*treeSize*petalSize);
				
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (petalType == 4){  // berry
			
				petalSize2 = 140/n;
				lR = Module.vcolorFr.x * petalSize2;
				if (lR > 1) lR =1;
				lG = Module.vcolorFr.y * petalSize2;
				if (lG > 1 ) lG =1;
				lB = Module.vcolorFr.z * petalSize2;
				if (lB > 1) lB = 1;
			
				
				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR , lG , lB );
				api.pushMatrix();
				api.setFrame (frameL);

				var verts = new Array(10);

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.1*treeSize*petalSize * petalSize2, 0.7*treeSize*petalSize * petalSize2);
				
				verts[2] = new Vector3(0.5*treeSize*petalSize * petalSize2, 0.9*treeSize*petalSize * petalSize2);
				verts[3] = new Vector3(1.0*treeSize*petalSize * petalSize2, 0.7*treeSize*petalSize * petalSize2);
				
				verts[4] = new Vector3(1.2*treeSize*petalSize * petalSize2,0.3*treeSize*petalSize * petalSize2);
				verts[5] = new Vector3(1.4*treeSize*petalSize * petalSize2, 0*treeSize*petalSize * petalSize2);

				verts[6] = new Vector3(1.2*treeSize*petalSize * petalSize2,-0.3*treeSize*petalSize * petalSize2);
				verts[7] = new Vector3(1.0*treeSize*petalSize * petalSize2, -0.7*treeSize*petalSize * petalSize2);

				verts[8] = new Vector3(0.5*treeSize*petalSize * petalSize2,-0.9*treeSize*petalSize * petalSize2);
				verts[9] = new Vector3(0.1*treeSize*petalSize * petalSize2, -0.7*treeSize*petalSize * petalSize2);

				
				api.Polygon(verts);
				api.popMatrix();	
				
		}
	}		


} 


function leavesBlock(api,frame,lShadow)
{
		var frameL = new Frame2d(frame);
		var lColor = (Math.random()*0.5+0.5)*lShadow;

		if (LbudON == 1 && LbudFrequency > Math.random()*100){


			switch(LbudType)
			{
					case 0:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/4;

						api.Color (kStrokeColor, 0,0,0,0);
						api.Color (kFillColor, Module.vcolorFr.x * fColor,Module.vcolorFr.y*fColor,Module.vcolorFr.z*fColor);
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize *LbudSize, 0.6*treeSize *LbudSize);
			
						verts[2] = new Vector3(0.9*treeSize *LbudSize, 0.8*treeSize *LbudSize);
						verts[3] = new Vector3(1.3*treeSize *LbudSize, 0.6*treeSize *LbudSize);
				
						verts[4] = new Vector3(1.7*treeSize *LbudSize,0*treeSize *LbudSize);
						verts[5] = new Vector3(1.3*treeSize *LbudSize, -0.6*treeSize *LbudSize);

						verts[6] = new Vector3(0.9*treeSize *LbudSize,-0.8*treeSize *LbudSize);
						verts[7] = new Vector3(0.5*treeSize *LbudSize, -0.6*treeSize *LbudSize);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;
									
					case 1:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/8;

						api.Color (kStrokeColor, 0,0,0,0);
				
					
					api.Color (kFillColor, Module.vcolorFr.x * fColor,Module.vcolorFr.y*fColor,Module.vcolorFr.z*fColor);
						
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize *LbudSize, 0.6*treeSize *LbudSize);
			
						verts[2] = new Vector3(0.9*treeSize *LbudSize, 0.8*treeSize *LbudSize);
						verts[3] = new Vector3(1.3*treeSize *LbudSize, 0.6*treeSize *LbudSize);
				
						verts[4] = new Vector3(1.7*treeSize *LbudSize,0*treeSize *LbudSize);
						verts[5] = new Vector3(1.3*treeSize *LbudSize, -0.6*treeSize *LbudSize);

						verts[6] = new Vector3(0.9*treeSize *LbudSize,-0.8*treeSize *LbudSize);
						verts[7] = new Vector3(0.5*treeSize *LbudSize, -0.6*treeSize *LbudSize);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;
								
								
								
					case 2:
					
						frameL.rotateDeg (Math.random()*90-45);
			
						fColor = 1-(1-lColor)/4;

						api.Color (kStrokeColor, 0,0,0,0);
						api.Color (kFillColor, Module.vcolorFr.x * fColor,Module.vcolorFr.y*fColor,Module.vcolorFr.z*fColor);
						api.pushMatrix();
						api.setFrame (frameL);
						var verts = new Array(8);

						verts[0] = new Vector3(0, 0);
						verts[1] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05) *LbudSize, 0.6*treeSize+(Math.random()*0.1-0.05) *LbudSize);
			
						verts[2] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05) *LbudSize, 0.8*treeSize+(Math.random()*0.1-0.05) *LbudSize);
						verts[3] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05) *LbudSize, 0.6*treeSize+(Math.random()*0.1-0.05) *LbudSize);
				
						verts[4] = new Vector3(1.7*treeSize+(Math.random()*0.1-0.05) *LbudSize,0*treeSize+(Math.random()*0.1-0.05) *LbudSize);
						verts[5] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05) *LbudSize, -0.6*treeSize+(Math.random()*0.1-0.05) *LbudSize);

						verts[6] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05) *LbudSize,-0.8*treeSize+(Math.random()*0.1-0.05) *LbudSize);
						verts[7] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05) *LbudSize, -0.6*treeSize+(Math.random()*0.1-0.05) *LbudSize);
				
				
						api.Polygon(verts);
						api.popMatrix();		
					break;				
					
					
						
					default:		

					break;
								}





				
		} else {
			
				var lR = Module.vcolor1.x*lColor * 1.8;
				if (lR > 1) lR =1;
				var lG = Module.vcolor1.y*lColor * 1.8;
				if (lG > 1 ) lG =1;
				var lB = Module.vcolor1.z*lColor * 1.8;
				if (lB > 1) lB = 1;
			
				if (LleafType == 0){

				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.5*treeSize*LleafSize, 0.4*treeSize*LleafSize);
				
				verts[2] = new Vector3(0.9*treeSize*LleafSize, 0.5*treeSize*LleafSize);
				verts[3] = new Vector3(1.3*treeSize*LleafSize, 0.4*treeSize*LleafSize);
				
				verts[4] = new Vector3(1.7*treeSize*LleafSize,0*treeSize*LleafSize);
				verts[5] = new Vector3(1.3*treeSize*LleafSize, -0.4*treeSize*LleafSize);

				verts[6] = new Vector3(0.9*treeSize*LleafSize,-0.5*treeSize*LleafSize);
				verts[7] = new Vector3(0.5*treeSize*LleafSize, -0.4*treeSize*LleafSize);
				
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (LleafType == 1){

				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				verts[0] = new Vector3(0+(Math.random()*0.1-0.05)*LleafSize, 0+(Math.random()*0.1-0.05)*LleafSize);
				verts[1] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05)*LleafSize, 0.4*treeSize+(Math.random()*0.1-0.05)*LleafSize);
				
				verts[2] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05)*LleafSize, 0.5*treeSize+(Math.random()*0.1-0.055)*LleafSize);
				verts[3] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05)*LleafSize, 0.4*treeSize+(Math.random()*0.1-0.05)*LleafSize);
				
				verts[4] = new Vector3(1.7*treeSize+(Math.random()*0.1-0.05)*LleafSize,0+(Math.random()*0.25-0.125)*LleafSize);
				verts[5] = new Vector3(1.3*treeSize+(Math.random()*0.1-0.05)*LleafSize, -0.4*treeSize+(Math.random()*0.1-0.05)*LleafSize);

				verts[6] = new Vector3(0.9*treeSize+(Math.random()*0.1-0.05)*LleafSize,-0.5*treeSize+(Math.random()*0.1-0.05)*LleafSize);
				verts[7] = new Vector3(0.5*treeSize+(Math.random()*0.1-0.05)*LleafSize, -0.4*treeSize+(Math.random()*0.1-0.05)*LleafSize);					
					
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (LleafType == 2){
					
				frameL.rotateDeg (Math.random()*90-45);

				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				var w = Math.random()*0.25-0.125;

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.5*treeSize*LleafSize, 0.4*treeSize*LleafSize+w);
				
				verts[2] = new Vector3(0.9*treeSize*LleafSize, 0.5*treeSize*LleafSize+w);
				verts[3] = new Vector3(1.3*treeSize*LleafSize, 0.4*treeSize*LleafSize+w);
				
				verts[4] = new Vector3(1.7*treeSize*LleafSize,0*treeSize*LleafSize);
				verts[5] = new Vector3(1.3*treeSize*LleafSize, -0.4*treeSize*LleafSize-w);

				verts[6] = new Vector3(0.9*treeSize*LleafSize,-0.5*treeSize*LleafSize-w);
				verts[7] = new Vector3(0.5*treeSize*LleafSize, -0.4*treeSize*LleafSize-w);
				
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (LleafType == 3){
					
				frameL.rotateDeg (Math.random()*90-45);
				
				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.0, 0.25*treeSize*LleafSize);
				
				verts[2] = new Vector3(1.2*treeSize*LleafSize, 0.9*treeSize*LleafSize);
				verts[3] = new Vector3(0.1*treeSize*LleafSize, 0.15*treeSize*LleafSize);
				
				verts[4] = new Vector3(2*treeSize*LleafSize,0*treeSize*LleafSize);
				verts[5] = new Vector3(0.1*treeSize*LleafSize, -0.15*treeSize*LleafSize);

				verts[6] = new Vector3(1.2*treeSize*LleafSize,-0.9*treeSize*LleafSize);
				verts[7] = new Vector3(0.0*treeSize*LleafSize, -0.25*treeSize*LleafSize);
				
				
				api.Polygon(verts);
				api.popMatrix();	
				
		} else if (LleafType ==4){
			
				frameL.rotateDeg (Math.random()*90-45);
				
				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(8);

				var w = 0.03; //Math.random()*0.25-0.125;

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.2*treeSize*LleafSize, 0.2*treeSize*LleafSize+w);
				
				verts[2] = new Vector3(0.5*treeSize*LleafSize, 0.3*treeSize*LleafSize+w);
				verts[3] = new Vector3(0.9*treeSize*LleafSize, 0.2*treeSize*LleafSize+w);
				
				verts[4] = new Vector3(1.3*treeSize*LleafSize,0*treeSize*LleafSize);
				verts[5] = new Vector3(0.9*treeSize*LleafSize, -0.2*treeSize*LleafSize-w);

				verts[6] = new Vector3(0.5*treeSize*LleafSize,-0.3*treeSize*LleafSize-w);
				verts[7] = new Vector3(0.2*treeSize*LleafSize, -0.2*treeSize*LleafSize-w);

				api.Polygon(verts);
				api.popMatrix();	
		
		} else if (LleafType == 5){
			
				frameL.rotateDeg (Math.random()*90-45);
				
				api.Color (kStrokeColor, 0,0,0,0);
				api.Color (kFillColor, lR, lG, lB);
				api.pushMatrix();
				api.setFrame (frameL);
				var verts = new Array(16);

				var w = 0; //Math.random()*0.25-0.125;

				verts[0] = new Vector3(0, 0);
				verts[1] = new Vector3(0.2*treeSize*LleafSize, 0.1*treeSize*LleafSize+w);
				
				verts[2] = new Vector3(0.3*treeSize*LleafSize, 0.3*treeSize*LleafSize+w);
				verts[3] = new Vector3(0.5*treeSize*LleafSize, 0.3*treeSize*LleafSize+w);
				
				verts[4] = new Vector3(0.7*treeSize*LleafSize, 0.4*treeSize*LleafSize);
				verts[5] = new Vector3(0.9*treeSize*LleafSize, 0.2*treeSize*LleafSize-w);

				verts[6] = new Vector3(1.1*treeSize*LleafSize, 0.2*treeSize*LleafSize-w);
				verts[7] = new Vector3(1.1*treeSize*LleafSize, 0.1*treeSize*LleafSize-w);
				
				verts[8] = new Vector3(1.3*treeSize*LleafSize, 0*treeSize*LleafSize-w);

				verts[9] = new Vector3(1.1*treeSize*LleafSize, -0.1*treeSize*LleafSize+w);
				verts[10] = new Vector3(1.1*treeSize*LleafSize, -0.2*treeSize*LleafSize+w);

				verts[11] = new Vector3(0.9*treeSize*LleafSize, -0.2*treeSize*LleafSize+w);
				verts[12] = new Vector3(0.7*treeSize*LleafSize, -0.4*treeSize*LleafSize);
				
				verts[13] = new Vector3(0.5*treeSize*LleafSize, -0.3*treeSize*LleafSize-w);
				verts[14] = new Vector3(0.3*treeSize*LleafSize, -0.3*treeSize*LleafSize-w);
				
				verts[15 ] = new Vector3(0.2*treeSize*LleafSize, -0.1*treeSize*LleafSize-w);


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
	system.setParameter (kApplyFrame, 0)
	//system.setParameter (kIncrementalRender, 0);

	var frame = new Frame2d();
	var initialModule = new Module (frame);



}

var initial = new Initial()

// Static variables defining initial state
// Prefix integer variables with i and float variables with f
Initial.fwinsize = 5;

Engine.addEnvironment ("Brush");
Module.vcolor = new Vector4(0.99,0.2,0.1,1.0); // the petals color
Module.vcolor1 = new Vector4(0.2,0.6,0.1,1.0); // the petals color

Module.vcolorBr = new Vector4(0.5,0.2,0.1,1.0); // the branch color
Module.vcolorFr = new Vector4(1,0.2, 0.5,1.0); // petal color

// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (-Initial.fwinsize, Initial.fwinsize, -Initial.fwinsize, Initial.fwinsize, 
					 -Initial.fwinsize*1.5, Initial.fwinsize*1.5);

Engine.setParameter (kRunSimulation, 1);



/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
var menuModule;


menuModule = [
		"Module",
	["iartType", Module.iartType, "", // was "$$$/IDS_FLOWER_TYPE=Flower type:", 
                                     [ "$$$/IDS_GARDEN_FLOWER=Garden flower",  "$$$/IDS_ROSE=Rose", "$$$/IDS_POINSETTIA=Poinsettia", "$$$/IDS_BERRY=Berry"]],
		["sdiv", "divider", " ", [0,0]],
		["vcolor", Module.vcolor, "$$$/IDS_FLOWER_COLOR=Flower color:", [0,1]],
		["fsymbolScaley", Module.fsymbolScaley, "$$$/IDS_PI_PROC_FLOWER_SIZE=Flower size:", [0.5, 2], 1, "%"],
		
		["vcolor1", Module.vcolor1, "$$$/IDS_PI_PROC_LEAF_COLOR=Leaf color:", [0,1]],
		["fsymbolScaley1", Module.fsymbolScaley1, "$$$/IDS_PI_PROC_LEAF_SIZE=Leaf size:", [0.5, 2], 1, "%"],
		["vcolorFr", Module.vcolorFr, "$$$/IDS_PI_PROC_FRUIT_COLOR=Fruit color:", [0,1]],			
		
	["ibranchOn", Module.ibranchOn, "$$$/IDS_PI_PROC_BRANCH=Branch", [0, 1]],
		["vcolorBr", Module.vcolorBr, "$$$/IDS_PI_PROC_BRANCH_COLOR=Branch color:", [0,1]],
];



// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule);

Engine.setInitialObject (initial);

