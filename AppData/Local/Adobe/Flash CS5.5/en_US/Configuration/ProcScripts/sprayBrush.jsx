
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

var defaultGeometry = true;

var lastUpdate = 0;
var currentStrokeColor = new Vector3 (0,0,0);
var currentFillColor = new Vector3 (0,0,0);


function updateGeometry (newGeometry, changeType, newColor)
{	
	if (!newGeometry)
	{
		Module.geometry[0] = geometry; // default geometry
		if (newColor)
			geometry.setColor (newColor);

		// Menu for default symbol
		Engine.makeMenu ("Module", menuModule1b, "Module", menuModule2);
	}
	// Add geometry to the array
	else 
	{
		// just replace the item 0 (You can try to add new array element)
		Module.geometry[0] = newGeometry
		//Module.geometry.push (newGeometry);
		defaultGeometry = false;

		// Menu for library symbol
		Engine.makeMenu ("Module", menuModule1, "Module", menuModule2);
	}

	lastUpdate++;
}

// This will make it possible for the user to change the default spray symbol.
// The updateGeometry callback is called when the user changes the symbol.
Engine.exposeGeometry ("$$$/IDS_PI_PROC_SPRAY=Spray:", "updateGeometry");


///////////////////////////////////////////////////////////////////////////
// Object Module
Module.fbrushWidth = 2;
Module.fbrushHeight = 2;
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
		if (lastPositionValid)
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

Module.prototype.render = function (api, env)
{
	if (makeNewGroup)
	{
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
		
	var numSymbols = 0;
	var radx = Module.fbrushWidth * 0.5;
	var rady = Module.fbrushHeight * 0.5;

	numSymbols = 1 + this.pressure / 4;

	var i;
	
	// If we have a parent, let us assume that we move the frame between p1 and p2 
	// (we ignore any rotation or the fact that the path between parent's frame and
	// this frame may not be linear)
	var p2 = this.frame.position();
	var p1 = this.lastPosition;	
	
	// keep constant density as the mouse speed changes
	numSymbols = 1 + Math.floor (numSymbols * (p2-p1).length() * 1);
	//Engine.message ("Num symbols: ", numSymbols)

	for (i = 0; i < numSymbols; i++)
	{		
		// Generate a random point in the rectangle given by the brush radii
		var x = -radx + rand() * 2 * radx;
		var y = -rady + rand() * 2 * rady;
		
		// Make it an ellipse
		if (x*x / (radx*radx) + y*y / (rady*rady) > 1)
		{
			i--;
			continue;
		}

		// Make length (size along the path bigger) and then reduce the width based on the
		// distance from the center
		var scalex = Module.fsymbolScalex;// * 0.2 * (1 + this.pressure / 45);
		var scaley = Module.fsymbolScaley;// * 0.2 * (1 + this.pressure / 45);
		
		if (Module.isymbolRandomScale)
		{
			var r = rand();
			scaley *= r;
			scalex *= r * (0.8 + rand() * 0.4);  // only vary a bit from the other value
		}

		if (Module.icalligraphic)
		{
			// rotate based on brush bearing
			var angle = (Module.fbrushAngle) / 180 * 3.14;
			var x2 = x * Math.cos (-angle) - y * Math.sin (-angle)
			var y2 = x * Math.sin (-angle) + y * Math.cos (-angle)
			
			frame = new Frame2d (this.frame);
			frame.reset();
			frame.setPosition (p1 + i / numSymbols * (p2 - p1));
			frame.translate (x2, y2);
			frame.scale (scalex, scaley);
			if (Module.isymbolRotate)
 			{
				frame.rotateDeg (Math.atan2 (this.frame.heading().x, this.frame.heading().y) * 180 / 3.14
			                 - 90);
			}
		}
		else
		{
			frame = new Frame2d (this.frame);
			frame.setPosition (p1 + i / numSymbols * (p2 - p1));
			frame.translate (x, y);
			frame.scale (scalex, scaley);
			frame.rotateDeg (- 90);
		}
		
		if (Module.isymbolRandomRotate)
			frame.rotateDeg (rand() * 360);
		else
			frame.rotateDeg ( (i % 2) == 0 ? Module.fsymbolRotate1 : Module.fsymbolRotate2);
		
			
		api.pushMatrix ();
		api.setFrame (frame);		     

		// Choose a random geometry from the array
		var geometryIndex = Math.floor ( rand() * Module.geometry.length - 0.001)
		if (geometryIndex < 0)
			geometryIndex = 0;
		else if (geometryIndex >= Module.geometry.length)
			geometryIndex = Module.geometry.length - 1

		this.geometry[geometryIndex].render (api);
		
		api.popMatrix ();
	}
	
	//Engine.removeModule (this);
	//Engine.setModuleParameter (this, "call", "render", 0);
		
	return kDontCallAgain; 
}


// This environment assures that even if you paint over the same area over and over
// the desnity of symbols will not increase beyond a certain limit. Doesn't take
// into account the symbol size, it considers only the symbol center.
Module.prototype.environmentPointGrid = function (system, environment)
{
	if (!this.visible)
		return kCallAgain
		
	if (environment.collides (this.frame.position(), kPointGridAddWhenNoCollision))
	{
		system.removeModule (this);
	}
	return kDontCallAgain
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

	EnvironmentPointGrid.initialize (1, 512, 512);
}

var initial = new Initial()

// Static variables defining initial state
// Prefix integer variables with i and float variables with f
Initial.fwinsize = 5;

Engine.addEnvironment ("Brush");

Engine.addEnvironment ("PointGrid");

// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (-Initial.fwinsize, Initial.fwinsize, -Initial.fwinsize, Initial.fwinsize, 
					 -Initial.fwinsize*1.5, Initial.fwinsize*1.5);

Engine.setParameter (kRunSimulation, 1);


/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
var menuModule1, menuModule1b, menuModule2;

menuModule1 = [
		"Module",
		//["itestCollision", Module.itestCollision, "Test collisions", [0, 1]],
		//["icalligraphic", Module.icalligraphic, "Calligraphic brush", [0, 1]],
		["fsymbolScalex", Module.fsymbolScalex, "$$$/IDS_PI_PROC_SCALE_WIDTH=Scale width:", [0, 400], 1, "%"],
		["fsymbolScaley", Module.fsymbolScaley, "$$$/IDS_PI_PROC_SCALE_HEIGHT=Scale height:", [0, 400], 1, "%"],
		["sdiv", "divider", " ", [0,0]],
		["isymbolRandomScale", Module.isymbolRandomScale, "$$$/IDS_PI_PROC_RANDOM_SCALING=Random scaling", [0, 1]],
		//["fsymbolRotate1", Module.fsymbolRotate1, "Symbol angle 1:", [0, 360]],
		//["fsymbolRotate2", Module.fsymbolRotate2, "Symbol angle 2:", [0, 360]],
		["isymbolRotate", Module.isymbolRotate, "$$$/IDS_PI_PROC_ROTATE_SYMBOL=Rotate symbol", [0, 1]],
		["isymbolRandomRotate", Module.isymbolRandomRotate, "$$$/IDS_PI_PROC_RANDOM_ROTATION=Random rotation", [0, 1]],
];


menuModule1b = [
		"Module",
		["fsymbolScaley", Module.fsymbolScaley, "$$$/IDS_PI_PROC_SCALE=Scale:", [0, 400], 1, "%"],
		["sdiv", "divider", " ", [0,0]],
		["isymbolRandomScale", Module.isymbolRandomScale, "$$$/IDS_PI_PROC_RANDOM_SCALING=Random scaling", [0, 1]],
		//["fsymbolRotate1", Module.fsymbolRotate1, "Symbol angle 1:", [0, 360]],
		//["fsymbolRotate2", Module.fsymbolRotate2, "Symbol angle 2:", [0, 360]],
		//["isymbolRotate", Module.isymbolRotate, "Rotate symbol", [0, 1]],
		//["isymbolRandomRotate", Module.isymbolRandomRotate, "Random rotation", [0, 1]],
];


menuModule2 = [
		"Module",
		["fbrushWidth", Module.fbrushWidth, "$$$/IDS_PI_PROC_WIDTH=Width:", [0, 550], "$$$/IDS_PI_PROC_PIXELS=px"],
		["fbrushHeight", Module.fbrushHeight, "$$$/IDS_PI_PROC_HEIGHT=Height:", [0, 550], "$$$/IDS_PI_PROC_PIXELS=px"],
		["fbrushAngle", Module.fbrushAngle, "$$$/IDS_PI_PROC_ANGLE=Angle:", [0, 360], "$$$/IDS_PI_PROC_CW=CW"]
];

// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule1b, "Module", menuModule2);

Engine.setInitialObject (initial);

