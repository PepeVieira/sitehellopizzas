///////////////////////////////////////////////////////////////////////////
// Handling of obstacles
ModuleLine.itestCollision = 1;

var groupIndex = 0

// Called with object to be filled or NULL if there is nothing selected
function addObstacle (newGeometry)
{
	groupIndex++;

	EnvironmentCollision.reset()

	if (newGeometry)
		EnvironmentCollision.addObstacle (newGeometry, kDontRenderGeometry);

	// Find out where the user clicked the mouse
	var ret = EnvironmentBrush.query (kBrushGetMouseInfo);

	// Create a new module and place it at the mouse position
	var newModule = new ModuleLine;

	if (newModule.frame)
		newModule.frame.setPosition (ret.mousepos);
	newModule.groupIndex = groupIndex;

	Engine.addModule (newModule);
		
	//Engine.message (" Making new module at (", ret.mousepos.x, ", ", ret.mousepos.y, ")");

	// Create default geometry for each click separately so that there 
	// can be a different symbol per click
	if (currentLeaf == defaultLeaf)
	{
		defaultLeaf = new Geometry (defaultLeaf);
		currentLeaf = defaultLeaf;
	}
	ModuleLeaf.geometry = currentLeaf;
	ModuleLeaf.geometry.setColor (currentLeafColor);

	if (currentFlower == defaultFlower)
	{
		defaultFlower= new Geometry (defaultFlower);
		currentFlower = defaultFlower;
	}

	ModuleFlower.geometry = currentFlower ;
	ModuleFlower.geometry.setColor (currentFlowerColor);

	Engine.setParameter (kIncrementalRender, 0)

	// This will create a new undo transaction
	RenderAPI.command (kCommandNewGroup)
}

// This tells Deco framework what method to call when the user clicks inside a shape.
// The shape is sent as the parameter of the method - see above.
Engine.exposeGeometry ("obstacle", "addObstacle");

var rendererName = RenderAPI.getParameter (kRenderAPIname);


///////////////////////////////////////////////////////////////////////////
// Method called at the beginning of each simulation step
ModuleLine.iAnimatePatern = 0;
ModuleLine.iframeStep = 0;

var frameNum = 0
var growing = 0

// Called at the beginning of each growth (simulation) step
function StartEach () 
{
	if (ModuleLine.iAnimatePatern > 0 && ModuleLine.iframeStep == 0)
		ModuleLine.iframeStep = 1;
			
	if(growing)
	{
		if (rendererName == "Flash" && ModuleLine.iAnimatePatern && ModuleLine.iframeStep > 0)
			if ((frameNum % ModuleLine.iframeStep) == 0 && frameNum != 0)
				RenderAPI.command (kCommandNextFrame);
		frameNum++
	}
	growing = 0;
   	return kCallAgain; 
}


///////////////////////////////////////////////////////////////////////////
// Object ModuleLine - module defining branches
function ModuleLine (frame, dist, br_level, br_count, br_dist, groupIndex)
{
	if (!frame)
	{
		this.frame = new Frame2d;  // stores position and orientation
		
		var len = ModuleLine.flength;
		this.frame.setSize (len);
		
		this.frame.rotateDeg (Initial.iangle + 90);
		
		this.br_level = 0;
		this.br_count = 0;
		this.br_dist = len;
		this.dist = len;
		this.groupIndex = 0;
	}
	else
	{
		this.frame = frame;
		this.br_level = br_level;
		this.br_count = br_count;
		this.br_dist = br_dist;
		this.dist = dist;
		this.groupIndex = groupIndex;
	}
	//Engine.message ("Module line created");
	growing = 1;
	this.tested = 0;
}


// This method is called for each module that has been added to the Engine, at each
// growth (simulation) step.
ModuleLine.prototype.produce = function (system)
{
	if (this.groupIndex < groupIndex)
	{
		system.removeModule (this); // system is the procedural Engine class
		return kDontCallAgain;
	}

	// Make a local version of ModuleLine for faster execution
	var module = ModuleLine;
	var len = module.flength;
	
	// Create a branch if a certain distance is reached
	var branch_created = false;
	if (this.br_count <= 119 && this.br_dist > module.br_dist)
	{
		var brframe = new Frame2(this.frame);
		brframe.advance (1.0);
		
		if ((this.br_count % 3) != 2)
		{
			// Leaf
			// Switch the angle based on the count and branch level
			var angle = (this.br_count %2) == 1 ? -60 : 60
			brframe.rotateDeg (angle)
			brframe.setSize (Initial.fsceneScale)
			var sinAngle = 0.5  // Math.sin(60)
			// Since geometry is centered at 0,0 in local coordinates
			// advance by half the size in y. Advance by 0.5*sizeX*sin(angle) to
			// connect at a corner of the bounding box
			brframe.advance (leafSizeY * 0.5 + 0.5 * sinAngle * leafSizeX)
			
			var newModule = new ModuleLeaf (brframe, this.groupIndex);
			system.addModule (newModule);
			branch_created = true;
		} 
		else
		{
			// Switch the angle based on the count and branch level
			var angle = (this.br_count %2) == 1 ? -80 : 80
			brframe.rotateDeg (angle)
			brframe.setSize (len);
			
			var newModule = new module (brframe, len, this.br_level + 1, 0, len, this.groupIndex);
			system.addModule (newModule);
			branch_created = true;
		}
	} 
	
	if (this.dist > ModuleLine.flower_dist)
	{
		var flframe = new Frame2 (this.frame);
		flframe.advance (1.0); // advance the segment
		flframe.setSize (Initial.fsceneScale);
		flframe.advance (flowerSizeY * 0.5 + 0.15);
		var newModule = new ModuleFlower (flframe, this, this.groupIndex);
		system.addModule (newModule);
		return kDontCallAgain;
	} 
	
	var newframe = new Frame2(this.frame)
	newframe.advance (1.0)

     	newframe.setSize (len)
   
	// Modify frame direction to create the wiggle
	var d = (this.dist + 3 /* initial phase */ ) * ModuleLine.wiggleAmplitude;
	d = d - Math.floor (d);   // frac(d)
	angle = d < 0.5 ? ModuleLine.wiggleAngle : -ModuleLine.wiggleAngle;
	newframe.rotateDeg (angle * len)
    
    
	var newModule;
	if (branch_created)
		newModule = new module (newframe, this.dist + len, this.br_level, 
						this.br_count + 1, len, this.groupIndex);
	else
		newModule = new module (newframe, this.dist + len, this.br_level, this.br_count,
						this.br_dist + len, this.groupIndex);
    system.addModule (newModule);

    return kDontCallAgain; // Stop calling produce for this module
}

// Static variables defining module's parameters
// Prefix integer variables with i and float variables with f
ModuleLine.flength = 0.24827;

ModuleLine.max_br_level = 4         // Maximum level at which branches occurs
ModuleLine.br_dist = 0.25           // Distance between branches
ModuleLine.flower_dist = 3          // Distance at which the branch is terminated by a flower
ModuleLine.wiggleAngle = 30         // Increase this value to make the wiggle more pronounced
ModuleLine.wiggleAmplitude = 0.25

ModuleLine.prototype.render = function (api)
{
	if (!	this.tested)
		return kCallAgain;
	api.Color(Initial.vcolor.x, Initial.vcolor.y, Initial.vcolor.z);
   	api.Line ();
	return kDontCallAgain
}



ModuleLine.prototype.environmentCollision = function (system, environment)
{
	this.tested = 1;
	if (this.groupIndex < groupIndex)
	{
		system.removeModule (this);
		return kDontCallAgain;
	}
	// Send the geometry to the environment
	this.render (environment);
    	if (environment.query ())
    	{
        	system.removeModule (this);
    	}
   	return kDontCallAgain; // Stop calling the method once the module is tested
}



/////////////////////////////////////////////////////////////////////////////
// Module Flower
function ModuleFlower (frame, parent, groupIndex)
{
	this.parent = parent
	this.frame = frame
	this.groupIndex = groupIndex
	growing = 1
}

ModuleFlower.prototype.render = function (api, byenv)
{
	ModuleFlower.geometry.render (api)	
	return kDontCallAgain
}



ModuleFlower.prototype.environmentCollision = function (system, environment)
{
	if (this.groupIndex < groupIndex)
	{
		system.removeModule (this);
		return kDontCallAgain;
	}
   	// First test a line connecting the flower with the segment since there is
	// a gap between the last segment and the flower
	if (this.parent)
	{ 
		environment.Line (this.parent.frame.position() - this.frame.position(), 
					new Vector3(0,0,0)) // connect the parent
		if (environment.collides (kDontAddGeometry))
		{
			system.removeModule (this);
			return kDontCallAgain;
		}
	}

	// Send the geometry to the environment
   	this.render (environment, 1);
    	if (environment.collides ())
    	{
		system.removeModule (this);
    	}
   	return kDontCallAgain; // Stop calling the method once the module is tested
}

var defaultFlower = System.loadGeometry ("svg/curve1.svg")
var currentFlowerColor = new Vector3(0.9,0.9,0.0)
defaultFlower.setColor (currentFlowerColor);

var currentFlower = defaultFlower

/////////////////////////////////////////////////////////////////////////////
// Module Leaf
function ModuleLeaf (frame, groupIndex)
{
	this.frame = frame
	this.groupIndex = groupIndex
	growing = 1
}

ModuleLeaf.prototype.render = function (api, byenv)
{
   	ModuleLeaf.geometry.render (api);	
	return kDontCallAgain
}


ModuleLeaf.prototype.environmentCollision = function (system, environment)
{
	if (this.groupIndex < groupIndex)
	{
		system.removeModule (this);
		return kDontCallAgain;
	}
	// Send the geometry to the environment
    	this.render (environment, 1);
    	if (environment.collides ())
    	{
		system.removeModule (this);
    	}
   	return kDontCallAgain; // Stop calling the method once the module is tested
}

///////////////////////////////////////////////////////////////////////////

Engine.setParameter (kRunSimulation, 1);

///////////////////////////////////////////////////////////////////////////

function Initial() {}

var initial = new Initial()

// Static variables defining initial state
// Prefix integer variables with i and float variables with f
Initial.fwinsize = 10;
Initial.fposx = 0;
Initial.fposy = -7.0;
Initial.iangle = 0;
Initial.fsceneScale = 1;
Initial.color = new Vector3(0.6,0.3,0.3);
Initial.vcolor = new Vector3(0,0.85,0); // the branch color


// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (-10 / Initial.fsceneScale, 10 / Initial.fsceneScale, -10 / Initial.fsceneScale, 10 / Initial.fsceneScale);

Engine.addEnvironment ("Brush");
Engine.addEnvironment ("Collision",kEnvDontProcessEvents);

function Start()
{
	// Set size of the scene, but after all environments that need bbox are specified
	//Engine.message ("scene scale: ", Initial.fsceneScale);
	Engine.setSceneBBox (-10 / Initial.fsceneScale, 10 / Initial.fsceneScale, -10 / Initial.fsceneScale, 10 / Initial.fsceneScale);
}

// This method is called when a parameter of the object Initial is changed by the user
Initial.variableUpdated = function (varname)
{
	//Engine.message ("variableUpdated called with parameter ", varname);
	if (varname == "fsceneScale")
		Start();
}

/////////////////////////////////////////////////////////////////////////////
var defaultLeaf = new Geometry
var currentLeaf = defaultLeaf

// define default leaf
var frameStart = new Frame2()
frameStart.advance (-0.4 - 0.07) // move back by half size and adjust since we are not attaching at a corner
frameStart.setSize (0.24)
var frameEnd = new Frame2(frameStart);
frameEnd.advance (1.0 / 0.3);

frameEnd.rotateDeg (140);   				
frameStart.rotateDeg (40);
defaultLeaf.addBezier (frameStart, frameEnd);
	
frameEnd.rotateDeg (80);   				
frameStart.rotateDeg (-80);
defaultLeaf.addBezier (frameStart, frameEnd);

defaultLeaf.instantiate (RenderAPI);
var currentLeafColor = new Vector3(0,0.85,0)
defaultLeaf.setColor (currentLeafColor);


ModuleLeaf.geometry = currentLeaf;
ModuleFlower.geometry = currentFlower;


var bbox = currentLeaf.getValue (kGetBoundingBox)
var leafSizeX = bbox[1].x - bbox[0].x
var leafSizeY = bbox[1].y - bbox[0].y

var bbox = currentFlower.getValue (kGetBoundingBox)
var flowerSizeX = bbox[1].x - bbox[0].x
var flowerSizeY = bbox[1].y - bbox[0].y

function newLeaf  (newGeometry,  changeType, newColor)
{
	if (newGeometry)
	{
		currentLeaf = newGeometry
	}
	else
	{
		currentLeaf = defaultLeaf
		if (newColor)
				currentLeafColor = newColor
	}	
	var bbox = currentLeaf.getValue (kGetBoundingBox)
	leafSizeX = bbox[1].x - bbox[0].x
	leafSizeY = bbox[1].y - bbox[0].y
	//Engine.message ("leaf size ", leafSizeX, " , ", leafSizeY)
}

Engine.exposeGeometry ("$$$/IDS_PI_PROC_LEAF=Leaf:", "newLeaf", defaultLeaf);

function newFlower  (newGeometry, changeType, newColor)
{
	if (newGeometry)
	{
		currentFlower = newGeometry;
	}
	else
	{
		currentFlower = defaultFlower;
		if (newColor)
				currentFlowerColor = newColor;
	}
	var bbox = currentFlower.getValue (kGetBoundingBox)
	flowerSizeX = bbox[1].x - bbox[0].x
	flowerSizeY = bbox[1].y - bbox[0].y
	//Engine.message ("flower size ", flowerSizeX, " , ", flowerSizeY)
}

Engine.exposeGeometry ("$$$/IDS_PI_PROC_FLOWER=Flower:", "newFlower", defaultFlower);

RenderAPI.lineWidth (1); // 1 pixel

/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
//   [variable name, initial value, menu item name, range ]
var menu1 = [
	"Initial parameters",
	["vcolor", Initial.vcolor, "$$$/IDS_PI_PROC_BRANCH_COLOR=Branch color:", [0,1]],
	["iangle", Initial.iangle, "$$$/IDS_PI_PROC_BRANCH_ANGLE=Branch angle:", [-180, 180], "$$$/IDS_PI_PROC_CW=CW"],
	["sdiv", "divider", " ", [0,0]],
	["fsceneScale", Initial.fsceneScale , "$$$/IDS_PI_PROC_PATTERN_SCALE=Pattern scale:", [0.5, 3], "%"],
	["sdiv", "divider", " ", [0,0]]
];
var menu2 = [
	"Module Line parameters",
	["flength", ModuleLine.flength, "$$$/IDS_PI_PROC_SEGMENT_LENGTH=Segment length:", [0.088, 0.87], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
	["sdiv", "divider", " ", [0,0]],
	["iAnimatePatern", 0, "$$$/IDS_PI_PROC_ANIMATE_PATTERN=Animate Pattern", [0, 1]],
	["iframeStep", ModuleLine.iframeStep, "$$$/IDS_PI_PROC_FRAME_STEP=Frame step:", [0, 100]]
];


//	["itestCollision", 1, "Test collisions", [0, 1]],

// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Initial", menu1, "ModuleLine", menu2);
