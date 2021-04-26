var rendererName = RenderAPI.getParameter (kRenderAPIname);

if (rendererName == "Flash")
	RenderAPI.setParameter (kUseSingleShape, 1);

///////////////////////////////////////////////////////////////////////////
// Object rand
rand.seed = 1

function rand()
{
    rand.seed = (rand.seed*9301+49297) % 233280;
	return rand.seed/(233280.0);
}

///////////////////////////////////////////////////////////////////////////
var frame = new Frame2();
var pointArray = new Array(4);
var defSize = 20;
pointArray[0] = new Vector3( defSize*0.5,  defSize*0.5, 0.0);
pointArray[1] = new Vector3(-defSize*0.5,  defSize*0.5, 0.0);
pointArray[2] = new Vector3(-defSize*0.5, -defSize*0.5, 0.0);
pointArray[3] = new Vector3( defSize*0.5, -defSize*0.5, 0.0);
var currentColor = new Array ();


var defaultGeometry = new Array()
var isDefaultGeometry = new Array()
var currentGeometry = new Array()
var objectSizeX = new Array()
var objectSizeY = new Array()
Module.geometry = new Array()

var enableGeometry = new Array()
var enabledGeometry = new Array()

var numModules = 4

for (var i = 0; i < numModules; i++)
{
	defaultGeometry[i] = new Geometry()
	defaultGeometry[i].addPolygon(pointArray, 4)
	defaultGeometry[i].setColor (kStrokeColor, 0,0,0,0); // no stroke
	defaultGeometry[i].setColor (kFillColor, 0,0,0);
	isDefaultGeometry[i] = true

	currentGeometry[i] = defaultGeometry[i]
	currentColor[i] = new Vector3 (0,0,0)

	Module.geometry[i] = defaultGeometry[i]
	objectSizeX[i] = defSize
	objectSizeY[i] = defSize
	enableGeometry[i] = 1
}


var groupIndex = 0


function addObstacle (newGeometry)
{
	//Engine.message ("addObstacle called")

	//if (!newGeometry)
	//	return;    // no fill when we click outside any shape

	groupIndex++;

	EnvironmentCollision.reset()
	EnvironmentCollision2.reset()

	// Add boundary obstacle
	//var size = 10 / Module.fsceneScale
	//Engine.setSceneBBox (-size, size, -size, size);
	var sizex = 550 / Module.fsceneScale
	var sizey = 400 / Module.fsceneScale
	Engine.setSceneBBox (0, sizex, 0, sizey);

	// Get bounding box back because the area may be stretched due to non-rectangular window
	var bbox = RenderAPI.getParameter (kUpdatedBoundingBox);

	var pointArray = new Array(5);
	pointArray[0] = bbox[0];
	pointArray[1] = new Vector3(bbox[1].x, bbox[0].y, 0.0);
	pointArray[2] = bbox[1]
	pointArray[3] = new Vector3(bbox[0].x, bbox[1].y, 0.0);
	pointArray[4] = bbox[0]

	var boundary = new Geometry()
	boundary.addLineStrip (pointArray);

	EnvironmentCollision.addObstacle (boundary, kDontRenderGeometry, "boundary" /* ID */);

	if (newGeometry)
		EnvironmentCollision.addObstacle (newGeometry, kDontRenderGeometry, "obstacle" /* ID */)

	// Create default geometry for each click separately so that there 
	// can be a different symbol per click
	for (var i = 0; i < numModules; i++)
	{
		if (isDefaultGeometry[i])
		{
			defaultGeometry[i] = new Geometry (defaultGeometry[i]);
			currentGeometry[i] = defaultGeometry[i];
			objectSizeX[i] = defSize
			objectSizeY[i] = defSize
		}
		else
		{
			var bbox = currentGeometry[i].getValue (kGetBoundingBox)
			objectSizeX[i] = bbox[1].x - bbox[0].x;
			objectSizeY[i] = bbox[1].y - bbox[0].y;
		}

		Module.geometry[i] = currentGeometry[i];
		Module.geometry[i].setColor (kStrokeColor, 0,0,0,0); // no stroke
		Module.geometry[i].setColor (kFillColor, currentColor[i]);
	}
	if (enabledGeometry.length > 0)
	{
		maxObjectSizeX = -1;
		maxObjectSizeY = -1;
		for (var i = 0; i < enabledGeometry.length; i++)
		{
			var index = enabledGeometry[i]
			if (objectSizeX[index] > maxObjectSizeX)
				maxObjectSizeX = objectSizeX[index]
			if (objectSizeY[index] > maxObjectSizeY)
				maxObjectSizeY = objectSizeY[index]
		}
	}
	else
	{
		maxObjectSizeX = defSize;
		maxObjectSizeY = defSize;
	}

	var ret = EnvironmentBrush.query (kBrushGetMouseInfo);

	// place the module
	var newModule = new Module;
	if (newModule.frame)
		newModule.frame.setPosition (ret.mousepos);
	newModule.groupIndex = groupIndex
	newModule.geometryIndex = 0
	newModule.angle = 0

	Engine.addModule (newModule);
		
	//Engine.message (" Making new module at (", ret.mousepos.x, ", ", ret.mousepos.y, ")");

	Engine.setParameter (kIncrementalRender, 0)

	//if (groupIndex > 1)
	RenderAPI.command (kCommandNewGroup)
}


Engine.exposeGeometry ("obstacle", "addObstacle");

var growing = 0


///////////////////////////////////////////////////////////////////////////
// Set Module's default geometry and expose it so that it can be changed

function updateGeometryIndex (index, newGeometry, changeType, newColor)
{	
	if (!newGeometry)
	{
		currentGeometry[index] = defaultGeometry[index]; // default geometry
		if (newColor)
		{
			//defaultGeometry[index].setColor (kStrokeColor, newColor);
			//defaultGeometry[index].setColor (kFillColor, newColor);
			//Engine.message ("color ", index, " changed");
			currentColor[index] = newColor;
		}
		isDefaultGeometry[index] = true
	}
	else 
	{
		currentGeometry[index] = newGeometry
		isDefaultGeometry[index] = false
	}

	var bbox = currentGeometry[index].getValue (kGetBoundingBox)
	objectSizeX[index] = bbox[1].x - bbox[0].x
	objectSizeY[index] = bbox[1].y - bbox[0].y
	//Engine.message ("Module ", index, " height is, ", Module.geometryHeight[index]);
}

function updateGeometry (newGeometry, changeType, newColor)
{	
	updateGeometryIndex (0, newGeometry, changeType, newColor)
}

function updateGeometry2 (newGeometry, changeType, newColor)
{	
	updateGeometryIndex (1, newGeometry, changeType, newColor)
}

function updateGeometry3 (newGeometry, changeType, newColor)
{	
	updateGeometryIndex (2, newGeometry, changeType, newColor)
}

function updateGeometry4 (newGeometry, changeType, newColor)
{	
	updateGeometryIndex (3, newGeometry, changeType, newColor)
}

function makeEnabled ()
{
	enabledGeometry.length = 0;
	for (var i = 0; i < numModules; i++)
		if (enableGeometry[i])
			enabledGeometry.push (i);
	setDirections();
}

function enableGeometry1 (enable)
{
	enableGeometry[0] = enable;
	makeEnabled();
}

function enableGeometry2 (enable)
{
	enableGeometry[1] = enable;
	makeEnabled();
}

function enableGeometry3 (enable)
{
	enableGeometry[2] = enable;
	makeEnabled();
}

function enableGeometry4 (enable)
{
	enableGeometry[3] = enable;
	makeEnabled();
}

makeEnabled(); // initialize the enabledGeometry array

// This will make it possible for the user to change the default spray symbol.
// The updateGeometry callback is called when the user changes the symbol.
Engine.exposeGeometry ("$$$/IDS_PI_PROC_TILE1=Tile 1:", "updateGeometry", "enableGeometry1");
Engine.exposeGeometry ("$$$/IDS_PI_PROC_TILE2=Tile 2:", "updateGeometry2", "enableGeometry2");
Engine.exposeGeometry ("$$$/IDS_PI_PROC_TILE3=Tile 3:", "updateGeometry3", "enableGeometry3");
Engine.exposeGeometry ("$$$/IDS_PI_PROC_TILE4=Tile 4:", "updateGeometry4", "enableGeometry4");


///////////////////////////////////////////////////////////////////////////
// Module 

Module.iLayout = 1;
Module.iPaintOverEdge = 0;
Module.iRandomOrder = 0;


function Module (frame, groupIndex, geometryIndex, angle)
{
	this.frame = frame ? frame : new Frame2d;
	this.parent = 0;
	this.groupIndex = groupIndex;
	this.geometryIndex = geometryIndex
	this.angle = angle
	this.pointInside = 0
	this.visible = 0  // make invisible first - so that we can check environment
}



var numDirections
var stepGap = new Array()      // step in terms of gap in each direction
var stepObject = new Array()   // step in terms of object size in each direction
var indexChange = new Array()  // how geometry index changes in each direction
var angleChange = new Array()  // angle change in each direction (0-3 - meaning 0, 90, 180, and 270 degrees)

function setDirections ()
{
	switch (Module.iLayout)
	{
	case 1: // Tile
		numDirections = 4

		stepGap[0] = new Vector2 (1,0)
		stepGap[1] = new Vector2 (0,1)
		stepGap[2] = new Vector2 (-1,0)
		stepGap[3] = new Vector2 (0,-1)
		stepObject[0] = stepGap[0]
		stepObject[1] = stepGap[1]
		stepObject[2] = stepGap[2]
		stepObject[3] = stepGap[3]

		indexChange[0] = 1
		indexChange[1] = enabledGeometry.length <= 3 ? 1 : 2;
		indexChange[2] = enabledGeometry.length - 1
		indexChange[3] = enabledGeometry.length <= 2 ? 1 : 2;

		angleChange[0] = 0
            angleChange[1] = 0
            angleChange[2] = 0
            angleChange[3] = 0;
		break;

	case 2: // Brick
		numDirections = 4

		stepGap[0] = new Vector2 (1,0)
		stepGap[1] = new Vector2 (0.5,1)
		stepGap[2] = new Vector2 (-1,0)
		stepGap[3] = new Vector2 (-0.5,-1)
		stepObject[0] = stepGap[0]
		stepObject[1] = stepGap[1]
		stepObject[2] = stepGap[2]
		stepObject[3] = stepGap[3]

		indexChange[0] = 1
		indexChange[1] = enabledGeometry.length <= 3 ? 1 : 2;
		indexChange[2] = enabledGeometry.length - 1
		indexChange[3] = enabledGeometry.length <= 2 ? 1 : 2;

		angleChange[0] = 0
            angleChange[1] = 0
            angleChange[2] = 0
            angleChange[3] = 0;
		break;

	case 3: // Floor
		numDirections = 4

		stepGap[0] = new Vector2 (1,-0.5)
		stepGap[1] = new Vector2 (0.5,1)
		stepGap[2] = new Vector2 (-1,0.5)
		stepGap[3] = new Vector2 (-0.5,-1)
		stepObject[0] = new Vector2 (1,-0.5)
		stepObject[1] = new Vector2 (0.5,1)
		stepObject[2] = new Vector2 (-1,0.5)
		stepObject[3] = new Vector2 (-0.5,-1)

		indexChange[0] = 1
		indexChange[1] = enabledGeometry.length <= 3 ? 1 : 2;
		indexChange[2] = enabledGeometry.length - 1
		indexChange[3] = enabledGeometry.length <= 2 ? 1 : 2;

		angleChange[0] = 1
            angleChange[1] = 3
            angleChange[2] = 1
            angleChange[3] = 3
		break;
	}
}

setDirections ()


Module.prototype.produce = function (system)
{
	if (this.groupIndex < groupIndex)
	{
		system.removeModule (this);
		return kDontCallAgain;
	}
	
	for (var i = 0; i < numDirections; i++)
	{
		var frame = new Frame2d (this.frame)
		//Engine.message ("GeometryIndex0 = ", this.geometryIndex);
		//Engine.message ("indexChange = ", indexChange[i]);
		//Engine.message ("enabled geom length = ", enabledGeometry.length);
		var geometryIndex
		var index0
		var index

		if (enabledGeometry.length > 1)
		{
			if (Module.iRandomOrder)
			{
				geometryIndex = Math.floor ( rand() * enabledGeometry.length - 0.001)
				if (geometryIndex < 0)
					geometryIndex = 0;
				else if (geometryIndex >= enabledGeometry.length)
					geometryIndex = enabledGeometry.length- 1
			}
			else
				geometryIndex = (this.geometryIndex + indexChange[i]) % enabledGeometry.length;

			index0 = enabledGeometry[this.geometryIndex]
			index = enabledGeometry[geometryIndex]
		}
		else 
		{
			index0 = index = geometryIndex = this.geometryIndex
		}
		//Engine.message ("GeometryIndex = ", geometryIndex);

		var angle = (this.angle + angleChange[i] ) % 4;

		var sx0 = (this.angle % 2) == 1 ? maxObjectSizeY : maxObjectSizeX;
		var sy0 = (this.angle % 2) == 1 ? maxObjectSizeX : maxObjectSizeY;
		var sx = (angle % 2) == 1 ? maxObjectSizeY : maxObjectSizeX;
		var sy = (angle % 2) == 1 ? maxObjectSizeX : maxObjectSizeY;
		var sizex = (sx0 + sx) / 2;
		var sizey = (sy0 + sy) / 2;

		//Engine.message ("sizex = ", sizex);

		frame.translate (stepGap[i].x * Module.flength1 + stepObject[i].x * sizex * Module.fsceneScale,
				     stepGap[i].y * Module.flength2 + stepObject[i].y * sizey * Module.fsceneScale)

		var newModule = new Module (frame, this.groupIndex, geometryIndex, angle)
		system.addModule (newModule)
		newModule.parent = this
	}
    
	growing = 1

	return kDontCallAgain; // Stop calling produce for this module
}


// Render module
var rotateFrame = new Frame2d

Module.prototype.render = function (api, byenv) 
{
	//Engine.setModuleParameter (this, "save render calls", 0);
	if (this.visible || byenv == 1)
	{
		api.pushMatrix ()
		api.setFrame (this.frame);
		api.scale (Module.fsceneScale, Module.fsceneScale)

		if (this.angle > 0)
		{
			rotateFrame.reset()
			rotateFrame.rotateDeg (this.angle * 90)
			api.setFrame (rotateFrame);
			//Engine.message ("rotating by ", this.angle * 90)
		}
		if (enabledGeometry.length > 0)
			Module.geometry[enabledGeometry[this.geometryIndex]].render (api, byenv);
		else
			defaultGeometry[0].render (api, byenv);
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
		if (Module.iPaintOverEdge)
		{
			// check all 4 corners
			var index = enabledGeometry[this.geometryIndex];
			var sx = objectSizeX[index] * 0.5; // make a tiny bit less than 0.5 so that we detect intersection with bbox
			var sy = objectSizeY[index] * 0.5;
			var point = this.frame.position() + new Vector3 (-sx, -sy, 0);
			this.pointInside = point;
			environment.Line (this.parent.pointInside, point)
			if (environment.collides (kDontAddGeometry))
			{
			  // Collides, check the others
			  point = this.frame.position() + new Vector3(sx, -sy, 0)			
			  this.pointInside = point;
		        environment.Line (this.parent.pointInside, point)
			  if (environment.collides (kDontAddGeometry))
			  {
			    // Collides, check the others				
			    point = this.frame.position() + new Vector3(sx, sy, 0)			
			    this.pointInside = point;
			    environment.Line (this.parent.pointInside, point)
			    if (environment.collides (kDontAddGeometry))
			    {
			      // Collides, check the others				
			      point = this.frame.position() + new Vector3(-sx, sy, 0)			
			      this.pointInside = point;
			      environment.Line (this.parent.pointInside, point)
			      if (environment.collides (kDontAddGeometry))
			      {
				  // All four collide, now we can remove
				  system.removeModule (this);
				  return kDontCallAgain;
				}
			    }
			  }
			}	
		}
		else
		{
			environment.Line (this.parent.pointInside, this.frame.position()) // connect the parent
			if (environment.collides (kDontAddGeometry))
			{
				system.removeModule (this);
				return kDontCallAgain;
			}
			this.pointInside = this.frame.position();
		}
	}
	else
		this.pointInside = this.frame.position();
		
    	this.render (environment, 1); // With parameter 1 it draws bounding box
	if (Module.iPaintOverEdge)
	{
    		if (environment.collides (this, ["obstacle", "boundary"] /* ignore module */, kDontAddGeometry))
      		system.removeModule (this)
	}
	else
		if (environment.collides (kDontAddGeometry))
       		system.removeModule (this)

	return kDontCallAgain; // Stop calling the method once the module is tested
}


// Makes sure two objects are not placed at the same location
Module.prototype.environmentCollision2 = function (system, environment)
{
	if (this.groupIndex < groupIndex)
	{
		system.removeModule (this);
		return kDontCallAgain;
	}

	environment.Circle (this.frame.position(), Module.fsceneScale * 0.0001)
	if (environment.collides ())
	{
		//Engine.message ("collides")
       	system.removeModule (this)
	}
	
	return kDontCallAgain; // Stop calling the method once the module is tested
}


// Static variables defining module's parameters
// Prefix integer variables with i and float variables with f
Module.flength1 = 20
Module.flength2 = 20
Module.fsceneScale = 1;
Module.sdiv = "divider";


/////////////////////////////////////////////////////////////////////////////
// Apply frame before each render
Engine.setParameter ("apply frame", 0);

RenderAPI.lineWidth (1.5);
RenderAPI.setParameter (kMergePolygons, 0); // so that default polygons can overlap if spacing is negative

Engine.setParameter (kRunSimulation, 1);

Engine.addEnvironment ("Brush");
Engine.addEnvironment ("Collision", kEnvDontProcessEvents);
Engine.addEnvironment ("Collision", "EnvironmentCollision2", kEnvDontProcessEvents);


function Start()
{
	EnvironmentCollision.setParameter (kGrowGrid, 1) // so that objects can stick out of the boundary
	EnvironmentCollision2.setParameter (kGrowGrid, 1) // so that objects can stick out of the boundary

	// Set size of the scene, but after all environments that need bbox are specified
	var sizex = 550 / Module.fsceneScale
	var sizey = 400 / Module.fsceneScale
	Engine.setSceneBBox (0, sizex, 0, sizey);

	//Engine.message ("scene scale: ", Module.fsceneScale);
}

Start();

Module.variableUpdated = function (varname)
{
	//Engine.message ("variableUpdated called with parameter ", varname);
	if (varname == "fsceneScale")
		Start();
	else if (varname == "iLayout")
		setDirections();
}


/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
//   [variable name, initial value, menu item name, range ]
var menu2 = 
[
	"Module parameters",
	["iLayout", Module.iLayout, "", // was "$$$/IDS_PI_PROC_LAYOUT=Layout:", 
                                                                    ["$$$/IDS_PI_PROC_TILE_PATTERN=Tile Pattern", 
                                                                     "$$$/IDS_PI_PROC_BRICK_PATTERN=Brick Pattern", 
                                                                     "$$$/IDS_PI_PROC_FLOOR_PATTERN=Floor Pattern"]],
	["iPaintOverEdge", Module.iPaintOverEdge, "$$$/IDS_PI_PROC_PAINT_OVER_EDGE=Paint over edge", [0, 1]],
	["iRandomOrder", Module.iRandomOrder, "$$$/IDS_PI_PROC_RANDOM_ORDER=Random order", [0, 1]],
	["sdiv", Module.sdiv, " ", [0,0]],
	["flength1", Module.flength1, "$$$/IDS_PI_PROC_HORIZONTAL_SPACING=Horizontal spacing:", [-10, 200], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
	["flength2", Module.flength2, "$$$/IDS_PI_PROC_VERTICAL_SPACING=Vertical spacing:", [-10, 200], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
	["sdiv", Module.sdiv, " ", [0,0]],
	["fsceneScale", Module.fsceneScale , "$$$/IDS_PI_PROC_PATTERN_SCALE=Pattern scale:", [0.5, 3], 1, "%"]
];

// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menu2);



