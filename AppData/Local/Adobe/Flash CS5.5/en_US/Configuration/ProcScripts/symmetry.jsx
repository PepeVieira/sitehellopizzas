var rendererName = RenderAPI.getParameter (kRenderAPIname);

if (rendererName == "Flash")
	RenderAPI.setParameter (kUseSingleShape, 1); // Use single shape 


function Deactivate ()
{
	SymmetryHandles.ishow = 0;
	
	// Force calling of render - disable incremental mode 
	Engine.setParameter (kIncrementalRender, 0);
	return 1; // redraw
}

///////////////////////////////////////////////////////////////////////////
// Handling of obstacles
Module.itestCollision = 1;

function addObstacle (newGeometry)
{
	EnvironmentCollision.addObstacle (newGeometry, kDontRenderGeometry);
}

Engine.exposeGeometry ("obstacle", "addObstacle");

RenderAPI.lineWidth (1) // one pixel - used by handles

///////////////////////////////////////////////////////////////////////////
// Define Module's default geometry and expose it so that it can be changed
var defaultGeometry = new Geometry;

// define default geometry
var frame = new Frame2();
var pointArray = new Array(4);
pointArray[0] = new Vector3(0.2, 0.2, 0.0);
pointArray[1] = new Vector3(-0.2, 0.2, 0.0);
pointArray[2] = new Vector3(-0.2, -0.2, 0.0);
pointArray[3] = new Vector3(0.2, -0.2, 0.0);
defaultGeometry.addPolygon(pointArray, 4);
//Module.geometry.addLineStrip (frame);

Module.geometry = defaultGeometry;

var currentColor = new Vector3 (0,0,0)

function updateGeometry (newGeometry, changeType, newColor)
{	
	if (newGeometry)
		Module.geometry = newGeometry;
	else
	{
		if (newColor)
		{
			currentColor = newColor
		}
		Module.geometry = new Geometry (defaultGeometry);
	}

	// Make a copy so that the newly assigned symbols affect only the new geometry
	//Engine.message ("updating geometry ");
}

Engine.exposeGeometry ("$$$/IDS_PI_PROC_MODULE=Module:", "updateGeometry", defaultGeometry);


var moduleUpdated = false; // used to prevent updating handles

///////////////////////////////////////////////////////////////////////////
// Include SymetryHandles Module
Engine.evalFile ("SymmetryHandles.jsx"); 

function GetUndoData ()
{
	var array = new Array(4)
	array[0] = new UndoData (handles)
	array[1] = new UndoData (handles2)

	array[2] = SymmetryHandles.itype1
	array[3] = SymmetryHandles.itype2

	//Engine.message ("GetUndoData called")
	return array
}

function SetUndoData (data)
{
	SetHandleData (handles, data[0])
	SetHandleData (handles2, data[1])

	SymmetryHandles.itype1 = data[2]
	SymmetryHandles.itype2 = data[3]

	handles.setSymmetry ()
	handles2.setSymmetry ()

	Engine.setParameter (kIncrementalRender, 0)
	EnvironmentCollision.reset()
	//Engine.message ("SetUndoData called")
}

///////////////////////////////////////////////////////////////////////////
// Object Module

var pickedModule;
var moduleID = 0;

function Module (frame, visible)
{
	this.frame = frame;
	this.visible = visible;
	this.placed = false
	this.id = moduleID++ 
	this.renderCount = 0
	
	//Engine.message ("adding new module");
	
	Engine.addModule (this); // We have to add module before setting its parameters
	Engine.setModuleParameter (this, "call", "render", visible);
	Engine.setModuleParameter (this, "save render calls", 0);
}

Module.prototype.produce = function (system)
{
	// Make a local version of Module for faster execution
	var module = Module;
	
	if (this.placed)
		return kDontCallAgain

	// Get mouse info
	var ret = EnvironmentBrush.query (kBrushGetMouseInfo);
	
	if (drawModules < 3)
	{
		// drawModules is by default set to 3 (two bits) but if an handle is being updated
		// it is set to 0 and a new geometry should not be produced
		system.setParameter (kIncrementalRender, 0);
		return kCallAgain
	}
		
	var frame = handles.getFrame();
		
	if (!this.visible)
	{
		// If the module is not visible, it waits for button down and then
		// places itself at the location of the mouse
		
		if (ret.buttondown)
		{
			this.visible = 1;
			// Use the current geometry
			this.geometry = Module.geometry
			Module.geometry.setColor (kStrokeColor, 0,0,0,0) // no stroke
			Module.geometry.setColor (kFillColor, currentColor)
			
			this.frame.setPosition (frame.toLocalCoords (ret.mousepos));
			system.setModuleParameter (this, "call", "render", 1);
			//system.message (" Making module visible at (", this.frame.position().x, ", ", this.frame.position().y, ")");
			system.setParameter (kIncrementalRender, 0);

			RenderAPI.command (kCommandNewGroup)

			moduleUpdated = true
		}
		return kCallAgain;
	}
	
	// If the module is visible and the mouse button is still down, move it
	// with the mouse
	if (ret.buttondown)
	{
		this.frame.setPosition (frame.toLocalCoords (ret.mousepos));
		// Force calling of render in incremental mode
		system.setModuleParameter (this, "call", "render", 1);
		system.setParameter (kIncrementalRender, 0);
		
		moduleUpdated = true
			
		return kCallAgain;	
	}
	
	// Otherwise stop producing and create a new module that will wait for 
	// a new mouse button down event
	var module = new Module (new Frame2d, 0 /* not visible */);

	// we can't undo the module that adds new modules
	system.setModuleParameter (module, kModuleDontUndo, 1);

	moduleUpdated = false;

	this.placed = true
	// Now we can undo it
	system.setModuleParameter (this, kModuleDontUndo, 0);
	
    	return kDontCallAgain; 
}


function StartEachRender () // called at the beginning of each render step
{
	EnvironmentCollision.reset()
}

Module.prototype.render = function (api, env)
{
	if (Module.itestCollision)
	{
		EnvironmentCollision.pushMatrix();
		EnvironmentCollision.setFrame (api.getFrame());
		this.geometry.render (EnvironmentCollision, kRenderGeometryBBox);

		// Test collision
		if (EnvironmentCollision.collides ())
		{
			// Skip rendering
			EnvironmentCollision.popMatrix();
			return kCallAgain;
		}
		EnvironmentCollision.popMatrix();
	}
	
	//Engine.message ("render on ", this.id, " at ", api.getFrame().position().x, ", ", api.getFrame().position().y)
	this.geometry.render (api);
	
    return kCallAgain; 
}


/////////////////////////////////////////////////////////////////////////////
// Initial is the object that creates the initial module or a set of modules
function Initial () {}

Initial.prototype.produce = function (system)
{
	system.setParameter (kApplyFrame, 1)

	// Symmetry - module should be added to the system before modules that 
	// are part of the symmetry
	handles = new SymmetryHandles (new Frame2(), 1, 0 /* frame is absolute */, 0);

	var frame2 = new Frame2();
	frame2.rotateDeg (90);
	handles2 = new SymmetryHandles (frame2, 2, 1 /* frame is relative */, handles);
	
	RenderAPI.command (kCommandNewGroup)  // new group for the handles

	handles.symmetry.addModule (handles2.symmetry) 
	handles.symmetry.addModule (handles2)
	

	var frame = new Frame2();
	var initialModule = new Module (frame, 0 /* not visible */);
						 
	// Add the module to the symmmetry
	handles2.symmetry.addModule (initialModule);
	
	Engine.setParameter (kIncrementalRender, 0);
}

var initial = new Initial()

// Static variables defining initial state
// Prefix integer variables with i and float variables with f
Initial.fwinsize = 10;

Engine.addEnvironment ("Brush");
Engine.addEnvironment ("Collision", kEnvDontProcessEvents);

EnvironmentCollision.setParameter (kGrowGrid, 1)

// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (-Initial.fwinsize, Initial.fwinsize, -Initial.fwinsize, Initial.fwinsize, 
			   -Initial.fwinsize*1.5, Initial.fwinsize*1.5);

Engine.setParameter (kRunSimulation, 1)
RenderAPI.setParameter ("DeleteGroupShape", 1)

Initial.itype = 3;

Initial.variableUpdated = function (varname)
{
	EnvironmentCollision.reset();
//	Engine.message ("variableUpdated called with parameter ", varname, ", type is ", Initial.itype);
	SymmetryHandles.itype2 = kSymmetryNone;
	if (Initial.itype == 1)
		SymmetryHandles.itype1 = kSymmetryLineReflection;
	else if (Initial.itype == 2)
		SymmetryHandles.itype1 = kSymmetryPointReflection;
	else if (Initial.itype == 3)
		SymmetryHandles.itype1 = kSymmetryRotation;
	else if (Initial.itype == 4)
	{
		SymmetryHandles.itype1 = kSymmetryTranslation;
		SymmetryHandles.itype2 = kSymmetryTranslation;
	}

	Engine.setParameter (kIncrementalRender, 0);
	handles.setSymmetry();
	handles2.setSymmetry();
}


/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
//   [variable name, initial value, menu item name, range ]
var menu1 = [
	"Symmetry Handles",
	["itype", Initial.itype, "", ["$$$/IDS_PI_PROC_REFLECT_ACROSS_LINE=Reflect Across Line", 
                                    "$$$/IDS_PI_PROC_REFLECT_ACROSS_POINT=Reflect Across Point", 
                                    "$$$/IDS_PI_PROC_ROTATE_AROUND=Rotate Around", 
                                    "$$$/IDS_PI_PROC_GRID_TRANSLATION=Grid Translation"]],
	["sdiv", "divider", " ", [0,0]]
];

var menu2 = [
	"Module",
	["itestCollision", Module.itestCollision, "$$$/IDS_PI_PROC_TEST_COLLISIONS=Test collisions", [0, 1]],
];

// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Initial", menu1, "Module", menu2);

Engine.setInitialObject (initial);
