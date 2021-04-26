
///////////////////////////////////////////////////////////////////////////
// Object rand
rand.seed = 1

function rand()
{
    rand.seed = (rand.seed*9301+49297) % 233280;
	return rand.seed/(233280.0);
}

///////////////////////////////////////////////////////////////////////////

var transaction = 0;
var transactionsValid = new Array(1); // transaction 0 is valid
transactionsValid[0] = 1;
var lastValidTransaction = 0;

function GetUndoData ()
{
	//Engine.message ("GetUndoData called, returning ", transaction)
	return totalSymbols;
}

function SetUndoData (data)
{
	totalSymbols = data;
}

///////////////////////////////////////////////////////////////////////////

var numBuckets = 400;
var minNonEmptyBucket = numBuckets + 1;
var maxNonEmptyBucket = -1;


var yBuckets = new Array (numBuckets);

var sceneScale = RenderAPI.getParameter ("BBoxScale")
var sizex = 550 * sceneScale.x 
var sizey = 400 * sceneScale.y

function setRenderOrder (api, y, elementID, trans)
{
	// Find the right bucket, based on y
	// winsize is 0 to sizey, but let's use -sizey to +2*sizey to be able to brush outside stage and not to be 
	// bysmally slow (miny is on top - in highest bucket)
	var bucket = Math.floor ((2*sizey - y) * numBuckets / 4*sizey);
	if (bucket < 0)
		bucket = 0;
	else if (bucket >= numBuckets)
		bucket = numBuckets - 1;

	//Engine.message ("value ", y, ", ", elementID, ", bucket ", bucket);

	var index;

	// insert the new element to the bucket - a pair of y and the element ID
	if (!yBuckets[bucket])
	{
		// Create a bucket if we are the first element in it
		yBuckets[bucket] = new Array(1)
		yBuckets[bucket][0] = new Array (y, elementID, trans)

		if (minNonEmptyBucket > numBuckets)
		{
			// we are adding the very first bucket
			api.setParameter (kRenderOrder, kRenderOnTop)
			minNonEmptyBucket = bucket;
			maxNonEmptyBucket = bucket;
			return;
		}
		if (minNonEmptyBucket > bucket)
			minNonEmptyBucket = bucket;

		if (maxNonEmptyBucket < bucket)
			maxNonEmptyBucket = bucket;

		index = 0;
	}
	else
	{
		// Bucket is not empty, go from the back (to avoid evaluating length too many times)
		// and find the first element, whose y is below ours
 		for (index = yBuckets[bucket].length-1; index >= 0; index--)
		{
			if (yBuckets[bucket][index][0] > y)
				break;
		}

		// If he haven't found any such element, index is -1. Which is fine and the following line
		// will insert new element to the beginning of the array
		++index;
		if (index < yBuckets[bucket].length)
			yBuckets[bucket].splice (index, 0, new Array (y, elementID, trans));
		else
			yBuckets[bucket].push (new Array (y, elementID, trans));
	}

	// going down in direction
	var item;
	var saveBucket = bucket;
	var saveItem = item;

	while(1)
	{
		// index stores the index of the newly added element

		// get next suitable item
		if (index > 0)
		{
			// ID of the element just before us
			--index;
		}
 		else if (minNonEmptyBucket < bucket)
		{
			// find first non-empty bucket below
			while (!yBuckets[bucket-1])
				bucket--;

			bucket--;

			// ID of the last element from the first previous non-empty bucket
			index = yBuckets[bucket].length - 1;
		}
		else
			// not found, break out of the loop
			break;


		item = yBuckets[bucket][index];
		if (transactionsValid[ item [2]])
		{
			//Engine.message ("setting order 2: above elementID ", item[1], ", trans ", item[2]);

			api.setParameter (kRenderOrder, kRenderAbove, item[1]);
			return;
		}
		// otherwise continue
		//Engine.message ("going further down");
	}

	// going down didn't produce an item, go up
	item = saveItem;
	bucket = saveBucket;

	while(1)
	{
		// index stores the index of the newly added element

		// get next suitable item
		if (index < yBuckets[bucket].length - 1)
		{
			// ID of the element just after us
			++index;
		}
 		else if (maxNonEmptyBucket > bucket)
		{
			// find first non-empty bucket above
			while (!yBuckets[bucket+1])
				bucket++;

			bucket++;

			// ID of the firts element from the first following non-empty bucket
			index = 0;
		}
		else
			// not found, break out of the loop
			break;

		item = yBuckets[bucket][index];
		if (transactionsValid[ item [2]])
		{
			//Engine.message ("setting order 2: below elementID ", item[1], ", trans ", item[2]);

			api.setParameter (kRenderOrder, kRenderBelow, item[1]);
			return;
		}
		// otherwise continue
		//Engine.message ("going further up");
	}

	// not found
	//Engine.message ("not found: setting order on top");
	api.setParameter (kRenderOrder, kRenderOnTop)
}


///////////////////////////////////////////////////////////////////////////
var minY = 0;
var maxY = sizey;
var useShape = 0;
var firstClick = 1;
var lastInside;

function addGuideObject (geometry)
{
	if (firstClick)
	{
		if (geometry)
		{
			EnvironmentCollision.addObstacle (geometry);
			useShape = 1;

			var bbox = geometry.getValue (kGetBoundingBox)
			minY = bbox[0].y
			maxY = bbox[1].y
			//Engine.message ("minY = ", minY, ", maxY = ", maxY);

			var mouseInfo = EnvironmentBrush.query (kBrushGetMouseInfo);
		
			lastInside = mouseInfo.mousepos;
		}
		else
		{
			minY = 0;
			maxY = sizey;
		}
	}
	firstClick = 0;
}

// The current Deco version always expects the first exposed object to be an
// obstacle, even if it is not used, like in this model.
Engine.exposeGeometry ("guide object", "addGuideObject");


///////////////////////////////////////////////////////////////////////////
// Define Module's default geometry and expose it so that it can be changed

// define default geometry
var frame = new Frame2()

var geometry = new Array()
Module.geometry = new Array()
Module.geometryHeight = new Array()
var pointArray = new Array(4);
var defSize = 4;
pointArray[0] = new Vector3( defSize*0.5,  defSize*0.5, 0.0);
pointArray[1] = new Vector3(-defSize*0.5,  defSize*0.5, 0.0);
pointArray[2] = new Vector3(-defSize*0.5, -defSize*0.5, 0.0);
pointArray[3] = new Vector3( defSize*0.5, -defSize*0.5, 0.0);

var defaultPolygon = new Geometry()
defaultPolygon.addPolygon(pointArray, 4)
defaultPolygon.setColor (kFillColor, 0,0,0);
defaultPolygon.setColor (kStrokeColor, 0,0,0,0); // no stroke

var defaultGeometry = new Array()
var enableGeometry = new Array()
var enabledGeometry = new Array()

var numModules = 4

for (var i = 0; i < numModules; i++)
{
	geometry[i] = new Geometry()
	geometry[i].addPolygon(pointArray, 4)
	geometry[i].setColor (kFillColor, 0,0,0);
	geometry[i].setColor (kStrokeColor, 0,0,0,0); // no stroke

	Module.geometry[i] = geometry[i]
	Module.geometryHeight[i] = 0
	enableGeometry[i] = 1

	defaultGeometry[i] = true;
}



function updateGeometryIndex (index, newGeometry, changeType, newColor)
{	
	if (!newGeometry)
	{
		Module.geometry[index] = geometry[index]; // default geometry
		if (newColor)
		{
			geometry[index].setColor (kFillColor, newColor);
			geometry[index].setColor (kStrokeColor, 0,0,0,0); // no stroke
		}

		defaultGeometry[i] = true;
	}
	// Add geometry to the array
	else 
	{
		// just replace the item 'index' (You can try to add new array element)
		Module.geometry[index] = newGeometry
		//Module.geometry.push (newGeometry);
		defaultGeometry[index] = false;
	}

	var bbox = Module.geometry[index].getValue (kGetBoundingBox)
	Module.geometryHeight[index] = bbox[1].y - bbox[0].y
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
Engine.exposeGeometry ("$$$/IDS_PI_PROC_OBJECT1=Object 1:", "updateGeometry", "enableGeometry1");
Engine.exposeGeometry ("$$$/IDS_PI_PROC_OBJECT2=Object 2:", "updateGeometry2", "enableGeometry2");
Engine.exposeGeometry ("$$$/IDS_PI_PROC_OBJECT3=Object 3:", "updateGeometry3", "enableGeometry3");
Engine.exposeGeometry ("$$$/IDS_PI_PROC_OBJECT4=Object 4:", "updateGeometry4", "enableGeometry4");

///////////////////////////////////////////////////////////////////////////
var oneGroup = false;

function Deactivate ()
{
	oneGroup = true;
}

///////////////////////////////////////////////////////////////////////////
// Object Module
Module.fbrushSize= 100;
Module.imaxSymbols = 10000;

Module.fsymbolScale= 1;
Module.iperspective = 1;
Module.fminScale = 0.1;
Module.fminRotate = 0;
Module.imaxRotate = 0;
Module.fmaxSymbolScale = 0;
Module.fbrushDensity = 1;


var mouseInfo = 0;
var index = 1;
var totalSymbols = 0;

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
		if (totalSymbols < Module.imaxSymbols)
		{
			RenderAPI.command (kCommandNewGroup)
			transaction++;
			transactionsValid[transaction] = 1;
			lastValidTransaction = transaction;
			//Engine.message ("Validating transaction ", transaction);
			makeNewGroup = false;
		}
	}

	if (this.seed < 0)
	{			
		// this is the first time the module is rendered
		this.seed = rand.seed;
	}
	else
		rand.seed = this.seed; // to make sure that subsequent renders have the same seed
		

	// If we have a parent, let us assume that we move the frame between p1 and p2 
	// (we ignore any rotation or the fact that the path between parent's frame and
	// this frame may not be linear)
	var p2 = this.frame.position();
	var p1 = this.lastPosition;	
	
	var radx = Module.fbrushSize * 0.5;
	
	if (Module.iperspective)
		// change the brush size based on perspective
		radx *= (Module.fminScale + ((maxY - p2.y) / (maxY - minY)) * (Module.fsymbolScale - Module.fminScale)) / Module.fsymbolScale;

	var rady = radx;
	//Engine.message ("radx = ", radx)

	// keep constant density as the mouse speed changes
	var scale = 0.3; // 0.1 + 0.9 * (maxY - p2.y) / sizey;
	var density = Module.fbrushDensity * 0.03;

	var numSymbols = (2 + (p2-p1).length()) * density / scale;
	if (numSymbols < 1)
		numSymbols = numSymbols > rand() ? 1 : 0;

	for (var i = 0; i < numSymbols; i++)
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

		// keep the symbol up		
		frame = new Frame2d (this.frame);
		frame.reset();
		frame.setPosition (p1 + i / numSymbols * (p2 - p1));
		frame.translate (x, y);

		//var angle = Module.fminRotate  + rand() * (Module.imaxRotate - Module.fminRotate);
		var angle = -Module.imaxRotate  + rand() * (2*Module.imaxRotate);
		frame.rotateDeg (angle);

		// Choose a random geometry from the array
            var numSprays = enabledGeometry.length;
		var height = 0;
		var geometryIndex = -1;
            if (numSprays >0)
		{
			geometryIndex = Math.floor ( rand() * numSprays - 0.001)
			if (geometryIndex < 0)
				geometryIndex = 0;
			else if (geometryIndex >= numSprays)
				geometryIndex = numSprays - 1
			height = Module.geometryHeight[geometryIndex];
		}

		var realY = frame.position().y
		var realX = frame.position().x


		// The real position of the bottom of the geomatry depends on the scale
		var scale;

		if (Module.iperspective)
		{
			var factor = (Module.fsymbolScale - Module.fminScale) / (maxY - minY);
			scale = Module.fminScale + (maxY - realY) * factor;

			// Adjust for the fact that we should use realY - h*scale in the expression above
			//scale /= (1 - height * factor);
		}
		else
		{
			scale = Module.fsymbolScale;
		}

		if (Module.fmaxSymbolScale > 0)
		{
			var scaleFactor = 1 - Module.fmaxSymbolScale + rand() * (2*Module.fmaxSymbolScale);
			if (scaleFactor > 0) 
				scale *= scaleFactor;
		} 
	 	//realY -= scale * height * 0.5;


		if (useShape)
		{
			// test if within a shape
			var bottom = new Vector3 (realX, realY);
			EnvironmentCollision.Line (bottom, lastInside);
			if (EnvironmentCollision.collides (kDontAddGeometry))
			{
				//Engine.message ("collides ", realX, ", ", realY);
				continue;
			}
			lastInside = bottom;
			//Engine.message ("doesn't collide ", realX, ", ", realY);
		}
		else 
			if ( realY < minY || realY > maxY)
				continue;

		if (totalSymbols >= Module.imaxSymbols)
			return kDontCallAgain; 
			
		totalSymbols++;

		frame.scale (scale, scale);				
			
		api.pushMatrix ();
		api.setFrame (frame);
		api.translate (0, scale * height * 0.5)		     

		if (!oneGroup)
		{
			var myID = this.index * 100 + i
			setRenderOrder (api, realY, myID, transaction)
			api.setParameter (kRenderID, myID)
		}
		if (geometryIndex >= 0)
			this.geometry[enabledGeometry[geometryIndex]].render (api);
		else
			defaultPolygon.render(api);
		
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

	//EnvironmentPointGrid.initialize (1, 512, 512);
}

var initial = new Initial()

Engine.addEnvironment ("Brush");
Engine.addEnvironment ("Collision");

// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (0, 550, 0, 400);

Engine.setParameter (kRunSimulation, 1);
RenderAPI.setParameter (kPickAllGeometry, 0); // pick nothing if we click on the stage


/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
var menuModule1, menuModule1b, menuModule2;

menuModule = [
		"Module",
		["imaxSymbols", Module.imaxSymbols, "$$$/IDS_PI_PROC_MAX_OBJECTS=Max objects:", [1, 10000]],
		//["sdiv", "divider", " ", [0,0]],
		["fbrushSize", Module.fbrushSize, "$$$/IDS_PI_PROC_SPRAY_AREA=Spray area:", [10, 200], 1, "$$$/IDS_PI_PROC_PIXELS=px"],

		["iperspective", Module.iperspective, "$$$/IDS_PI_PROC_PERSPECTIVE=Perspective", [0, 1]],
		["fminScale", Module.fminScale, "$$$/IDS_PI_PROC_DISTANCE_SCALE=Distance scale:", [0.1, 2], 1, "%"],
		["sdiv", "divider", " ", [0,0]],
		["fmaxSymbolScale", Module.fmaxSymbolScale, "$$$/IDS_PI_PROC_RANDOM_SCALE_RANGE=Random scale range:", [0, 2], 1, "%"],
		//["sdiv", "divider", " ", [0,0]],
		["imaxRotate", Module.imaxRotate, "$$$/IDS_PI_PROC_RANDOM_ROTATION_RANGE=Random rotation range:", [0, 180], "$$$/IDS_PI_PROC_DEGREES=deg"],
];


// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule);

Engine.setInitialObject (initial);

