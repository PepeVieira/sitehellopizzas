var rendererName = RenderAPI.getParameter (kRenderAPIname);

if (rendererName == "Flash")
	RenderAPI.setParameter (kUseSingleShape, 1);

///////////////////////////////////////////////////////////////////////////
var defaultGeometry = new Geometry
var frame = new Frame2();
var pointArray = new Array(4);
pointArray[0] = new Vector3(0.2, 0.2, 0.0);
pointArray[1] = new Vector3(-0.2, 0.2, 0.0);
pointArray[2] = new Vector3(-0.2, -0.2, 0.0);
pointArray[3] = new Vector3(0.2, -0.2, 0.0);
defaultGeometry.addPolygon(pointArray, 4);

var currentGeometry = defaultGeometry;
var currentColor = new Vector3 (0,0,0);

Module.geometry = defaultGeometry;

var groupIndex = 0

var objectSizeX = 0.4;
var objectSizeY = 0.4;

function addObstacle (newGeometry)
{
	//Engine.message ("addObstacle called")

	//if (!newGeometry)
	//	return;    // no fill when we click outside any shape

	groupIndex++;

	EnvironmentCollision.reset()

	if (newGeometry)
		EnvironmentCollision.addObstacle (newGeometry, kDontRenderGeometry)

	// Create default geometry for each click separately so that there 
	// can be a different symbol per click
	if (currentGeometry == defaultGeometry)
	{
		defaultGeometry = new Geometry (defaultGeometry);
		currentGeometry = defaultGeometry;
		objectSizeX = 0.4;
		objectSizeY = 0.4;
	}
	else
	{
		var bbox = currentGeometry.getValue (kGetBoundingBox)
		objectSizeX = bbox[1].x - bbox[0].x;
		objectSizeY = bbox[1].y - bbox[0].y;
	}

	Module.geometry = currentGeometry;
	Module.geometry.setColor (kStrokeColor, 0,0,0,0); // no stroke
	Module.geometry.setColor (kFillColor, currentColor);

	var ret = EnvironmentBrush.query (kBrushGetMouseInfo);

	// place the module
	var newModule = new Module;
	if (newModule.frame)
		newModule.frame.setPosition (ret.mousepos);
	newModule.groupIndex = groupIndex;

	Engine.addModule (newModule);
		
	//Engine.message (" Making new module at (", ret.mousepos.x, ", ", ret.mousepos.y, ")");

	Engine.setParameter (kIncrementalRender, 0)

	//if (groupIndex > 1)
	RenderAPI.command (kCommandNewGroup)
}


Engine.exposeGeometry ("obstacle", "addObstacle");

///////////////////////////////////////////////////////////////////////////
// Method called at the beginning of each simulation step
Module.iframeStep = 0;

var frameNum = 0
var growing = 0

function StartEach () 
{
	if(growing)
      {
		if (rendererName == "Flash" && Module.iframeStep > 0)
			if ((frameNum % Module.iframeStep) == 0)
				RenderAPI.command (kCommandNextFrame);
		frameNum++
	}
	growing = 0;
   	return kCallAgain; 
}


///////////////////////////////////////////////////////////////////////////
// Set Module's default geometry and expose it so that it can be changed

function newModule  (newGeometry,  changeType, newColor)
{
	if (newGeometry)
		currentGeometry = newGeometry;
	else
	{
		currentGeometry = defaultGeometry;
		if (newColor)
			currentColor = newColor;
	}
}
Engine.exposeGeometry ("$$$/IDS_PI_PROC_FILL=Fill:", "newModule", defaultGeometry);


///////////////////////////////////////////////////////////////////////////
// Module 
function Module (frame, groupIndex)
{
	this.frame = frame ? frame : new Frame2d;
	this.parent = 0;
	this.groupIndex = groupIndex;
	this.visible = 0  // make invisible first - so that we can check environment
}

Module.prototype.produce = function (system)
{
	if (this.groupIndex < groupIndex)
	{
		system.removeModule (this);
		return kDontCallAgain;
	}

	// Make a local version of Module for faster execution
	var module = Module
		
	var frame1 = new Frame2d (this.frame)
	frame1.translate (module.flength1 + objectSizeX * Module.fsceneScale, 0)
	var newModule1 = new Module (frame1, this.groupIndex)
	system.addModule (newModule1)
	newModule1.parent = this

	var frame2 = new Frame2d (this.frame)
	frame2.translate (0, module.flength2 + objectSizeY * Module.fsceneScale)
	var newModule2 = new module (frame2, this.groupIndex);
	system.addModule (newModule2);
	newModule2.parent = this

	var frame3 = new Frame2d (this.frame)
	frame3.translate (-(module.flength1 + objectSizeX * Module.fsceneScale), 0)
	var newModule3 = new module (frame3, this.groupIndex);
	system.addModule (newModule3);
	newModule3.parent = this

	var frame4 = new Frame2d (this.frame)
	frame4.translate (0, -(module.flength2 + objectSizeY * Module.fsceneScale))
	var newModule4 = new module (frame4, this.groupIndex);
	system.addModule (newModule4);
	newModule4.parent = this
    
	growing = 1

    return kDontCallAgain; // Stop calling produce for this module
}


// Render module
Module.prototype.render = function (api, byenv) 
{
	//Engine.setModuleParameter (this, "save render calls", 0);
	if (this.visible || byenv == 1)
	{
		api.pushMatrix ()
		api.setFrame (this.frame);
		api.scale (Module.fsceneScale, Module.fsceneScale)
		Module.geometry.render (api, byenv);
		api.popMatrix ()
		this.visible = 1
		return kDontCallAgain
	}
	this.visible = 1

	return kCallAgain; 
}


Module.prototype.environmentCollision = function (system, environment)
{
	if (this.groupIndex < groupIndex)
	{
		system.removeModule (this);
		return kDontCallAgain;
	}

   	// First test if the connection doesn't cross any boundary
	if (this.parent)
	{ 
		environment.Line (this.parent.frame, this.frame) // connect the parent
		// send the module (this) and the ignore module (parent) so that 
		// we don't collide with the parent's flower
		if (environment.collides (this, this.parent /* ignore module */, kDontAddGeometry))
		{
			system.removeModule (this);
			return kDontCallAgain;
		}
	}
		
    	this.render (environment, 1);
    	// Send module so that we can test connections to children without colliding with the flower
	if (!this.parent)
	{
    		if (environment.collides ())
        		system.removeModule (this)
    	}
    	else if (environment.collides (this, this.parent /* ignore module */))
    	{
        	system.removeModule (this)
    	}
	
	return kDontCallAgain; // Stop calling the method once the module is tested
}


// Static variables defining module's parameters
// Prefix integer variables with i and float variables with f
Module.flength1 = 1.0;
Module.flength2 = 1.0;
Module.fsceneScale = 1;
Module.sdiv = "divider";


/////////////////////////////////////////////////////////////////////////////
// Apply frame before each render
Engine.setParameter ("apply frame", 0);

RenderAPI.lineWidth (1.5);

Engine.setParameter (kRunSimulation, 1);
Engine.setSceneBBox (-10 / Module.fsceneScale, 10 / Module.fsceneScale, -10 / Module.fsceneScale, 10 / Module.fsceneScale);

Engine.addEnvironment ("Brush");
Engine.addEnvironment ("Collision", kEnvDontProcessEvents);

function Start()
{
	// Set size of the scene, but after all environments that need bbox are specified
	Engine.setSceneBBox (-10 / Module.fsceneScale, 10 / Module.fsceneScale, -10 / Module.fsceneScale, 10 / Module.fsceneScale);
	//Engine.message ("scene scale: ", Module.fsceneScale);
}

Module.variableUpdated = function (varname)
{
	//Engine.message ("variableUpdated called with parameter ", varname);
	if (varname == "fsceneScale")
		Start();
}

/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
//   [variable name, initial value, menu item name, range ]
var menu2 = 
[
	"Module parameters",
	["flength1", Module.flength1, "$$$/IDS_PI_PROC_HORIZONTAL_SPACING=Horizontal spacing:", [0, 5], "1, $$$/IDS_PI_PROC_PIXELS=px"],
	["sdiv", Module.sdiv, " ", [0,0]],
	["flength2", Module.flength2, "$$$/IDS_PI_PROC_VERTICAL_SPACING=Vertical spacing:", [0, 5], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
	["sdiv", Module.sdiv, " ", [0,0]],
	["fsceneScale", Module.fsceneScale , "$$$/IDS_PI_PROC_PATTERN_SCALE=Pattern scale:", [0.5, 3], "%"]
];

// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menu2);



