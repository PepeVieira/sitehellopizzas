
///////////////////////////////////////////////////////////////////////////
// Object rand
function rand()
{
    return Math.random();
}

///////////////////////////////////////////////////////////////////////////
var framesLeft = 0
var frameNum = 0

function addNewPath (pathGeometry)
{
	//Engine.message ("button down, frames left = ", framesLeft);
	// Allow new generator only after the previous one has finished
	RenderAPI.command (kCommandNewGroup)
	if (framesLeft == 0 || !drawn)
	{ 
		new Generator (new Frame2d())
	}

	return;
}

// The current Deco version always expects the first exposed object to be an
// obstacle, even if it is not used, like in this model.
Engine.exposeGeometry ("brush path", "addNewPath");


///////////////////////////////////////////////////////////////////////////
// Define Module's default geometry and expose it so that it can be changed

// define default geometry
var frame = new Frame2()

var geometry = new Array()
Particle.geometry = new Array()

var pointGeometry = new Geometry;
var pointArray = new Array(4);
var defSize = 4;
pointArray[0] = new Vector3( defSize*0.5,  defSize*0.5, 0.0);
pointArray[1] = new Vector3(-defSize*0.5,  defSize*0.5, 0.0);
pointArray[2] = new Vector3(-defSize*0.5, -defSize*0.5, 0.0);
pointArray[3] = new Vector3( defSize*0.5, -defSize*0.5, 0.0);

pointGeometry.addPolygon (pointArray, 4)
pointGeometry.setColor (kStrokeColor, 0,0,0,0); // no stroke
pointGeometry.setColor (kFillColor, 0,0,0);


var defaultGeometry = new Array()
var enableGeometry = new Array()
var enabledGeometry = new Array()

var numParticles = 2

for (var i = 0; i < numParticles; i++)
{
	geometry[i] = new Geometry()
	geometry[i].addPolygon(pointArray, 4)
	geometry[i].setColor (kStrokeColor, 0,0,0,0); // no stroke
	geometry[i].setColor (kFillColor, 0,0,0);

	Particle.geometry[i] = geometry[i]
	enableGeometry[i] = 1

	defaultGeometry[i] = true;
}


var lastUpdate = 0;
var currentStrokeColor = new Vector3 (0,0,0);
var currentFillColor = new Vector3 (0,0,0);


function updateGeometryIndex (index, newGeometry, changeType, newColor)
{	
	if (!newGeometry)
	{
		Particle.geometry[index] = geometry[index]; // default geometry
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
		Particle.geometry[index] = newGeometry
		defaultGeometry[index] = false;
	}

	lastUpdate++;
}

function updateGeometry (newGeometry, changeType, newColor)
{	
	updateGeometryIndex (0, newGeometry, changeType, newColor)
}

function updateGeometry2 (newGeometry, changeType, newColor)
{	
	updateGeometryIndex (1, newGeometry, changeType, newColor)
}

function makeEnabled ()
{
	enabledGeometry.length = 0;
	for (var i = 0; i < numParticles; i++)
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

makeEnabled(); // initialize the enabledGeometry array

// This will make it possible for the user to change the default spray symbol.
// The updateGeometry callback is called when the user changes the symbol.
Engine.exposeGeometry ("$$$/IDS_PI_PROC_PARTICLE1=Particle 1:", "updateGeometry", "enableGeometry1");
Engine.exposeGeometry ("$$$/IDS_PI_PROC_PARTICLE2=Particle 2:", "updateGeometry2", "enableGeometry2");

///////////////////////////////////////////////////////////////////////////
// Called at the beginning of each growth (simulation) step
var stop = 0
var drawn = 0;

function StartEachRender () 
{
	if(framesLeft > 0 && drawn)
	{
		RenderAPI.command (kCommandNextFrame, kEmptyFrame);
		Engine.setParameter (kRunSimulation, 1);
		//Engine.setParameter (kIncrementalRender, 0);
		framesLeft--;
		frameNum++;
		//Engine.message ("current frame ", frameNum);
	}

	drawn = 0;

	//Engine.message ("Calling StartEach ", frameNum);
   	return kCallAgain; 
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Object Generator

Generator.iTotalFrames = 30;
Generator.iParticleGeneration = 30;
Generator.iRate = 1; // per frame


//var makeNewGroup = false
//RenderAPI.command (kCommandNewGroup)

function Generator (frame)
{
	this.frame = frame;
	this.firstTime = 1;
	//Engine.message ("Generator created");
	Engine.addModule (this);
}

Generator.prototype.produce = function (system)
{
	if (this.firstTime)
	{
		this.firstTime = 0

		// Get mouse info
		mouseInfo = EnvironmentBrush.query (kBrushGetMouseInfo);
	
		//Engine.message ("Starting generating particles");

		// Start generating the particles
		frameNum = 1;

		framesLeft = Generator.iTotalFrames - 1;

		// set the generator position
		this.frame.setPosition (mouseInfo.mousepos);
	}

	if (frameNum >= Generator.iParticleGeneration - 1 || frameNum >= Generator.iTotalFrames)
		// don't generate more particles
		return kDontCallAgain	

	//Engine.message ("Generating ", Generator.iRate, " particles");
	for (var i = 0; i < Generator.iRate; i++)
	{
		var frame = new Frame2d (this.frame)
		new Particle (frame);		
	}	
	return kCallAgain;
}

// no render call for Generator

///////////////////////////////////////////////////////////////////////////
// Object Particle

Particle.iLifeSpan = 15;    // frames
Particle.fInitialSpeed = 20; // px/frame
Particle.fInitialSize = 1;  // %
Particle.iMinDirection = -45;
Particle.iMaxDirection = +45;
Particle.fGravity = 10; // px/frame
Particle.iRotationRate = 0;


function Particle (frame)
{
	this.frame = frame;

	this.lifeSpan = Particle.iLifeSpan;

	this.direction = Particle.iMinDirection + rand() * (Particle.iMaxDirection - Particle.iMinDirection);
	//this.speed = new Vector3 (0,1,0)

	// Vary the speed a little
	var speed = Particle.fInitialSpeed * (0.95 + rand() * 0.1)
	this.speed = new Vector3 (speed * Math.sin (this.direction * 3.14 / 180), 
					  speed * Math.cos (this.direction * 3.14 / 180), 
                                0);
	
	var gravity = Particle.fGravity* (0.95 + rand() * 0.1) // randomize a bit
	this.gravity = new Vector3 (0, -gravity, 0);
 
	
	// Choose a random geometry from the array
      var numParticles = enabledGeometry.length;
      if (numParticles > 0)
	{
		var geometryIndex = Math.floor ( rand() * numParticles - 0.001)
		if (geometryIndex < 0)
			geometryIndex = 0;
		else if (geometryIndex >= numParticles)
			geometryIndex = numParticles - 1

		this.geometry = Particle.geometry [enabledGeometry[geometryIndex]]
	}
	else
            // nothing enabled, use a point
		this.geometry = pointGeometry 

	this.rotationRate = Particle.iRotationRate;
	this.life = 0;

	//Engine.message ("adding Particle")
	
	Engine.addModule (this); // We have to add module before setting its parameters
	Engine.setModuleParameter (this, "call", "render", 0);
}


Particle.prototype.produce = function (system)
{
	if (--this.lifeSpan < 0 || frameNum >= Generator.iTotalFrames)
	{
		if (frameNum == Generator.iTotalFrames)
			this.lifeSpan = 0;
		return kDontCallAgain;
	}

	this.speed = this.speed + this.gravity;
	this.frame.rotateTowards (this.frame.position() + this.speed, 90);
	this.frame.advance (this.speed.length());

	// remove if outside screen bounds
	var p = this.frame.position()
	if (p.x < -1024 || p.x > 2880+1024 || p.y < -1204 || p.y > 2880+1024)
	{
		system.removeModule (this)
		return kDontCallAgain
	}

	var frame = new Frame2d(this.frame)
	frame.rotateDeg (this.rotationRate * this.life)
	frame.scale (Particle.fInitialSize, Particle.fInitialSize)

	system.addModule (new ParticleDraw (frame, this.geometry))

	this.life++;

	return kCallAgain
}

function ParticleDraw (frame, geometry)
{
	this.frame = frame
	this.geometry = geometry
}

ParticleDraw.prototype.render = function (api, env)
{
	RenderAPI.setParameter (kRenderOrder, kRenderOnBottom)
	this.geometry.render(api)
	drawn = 1
	Engine.removeModule(this)
	return kDontCallAgain
}


/////////////////////////////////////////////////////////////////////////////
Engine.setParameter (kApplyFrame, 1)

Engine.setParameter (kIncrementalRender, 1);

Engine.addEnvironment ("Brush");


// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (0, 550, 0, 400);

Engine.setParameter (kRunSimulation, 1);


/////////////////////////////////////////////////////////////////////////////

menuGenerator = [
		"Generator",
		["iTotalFrames", Generator.iTotalFrames, "$$$/IDS_PI_PROC_TOTAL_LENGTH=Total Length:", [1, 200], "$$$/IDS_PI_PROC_FRAMES=frames"],
		["iParticleGeneration", Generator.iParticleGeneration, "$$$/IDS_PI_PROC_PARTICLE_GENERATION=Particle generation:", [0, 200], "$$$/IDS_PI_PROC_FRAMES=frames"],
		["iRate", Generator.iRate, "$$$/IDS_PI_PROC_RATE_PER_FRAME=Rate per frame:", [1, 5]],
		["sdiv", "divider", " ", [0,0]]
];

menuParticle = [
		"Particle",
		["iLifeSpan", Particle.iLifeSpan, "$$$/IDS_PI_PROC_LIFE_SPAN=Life span:", [1, 200], "$$$/IDS_PI_PROC_FRAMES=frames"],
		["fInitialSpeed", Particle.fInitialSpeed, "$$$/IDS_PI_PROC_INITIAL_SPEED=Initial speed:", [0, 100], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
		["fInitialSize", Particle.fInitialSize, "$$$/IDS_PI_PROC_INITIAL_SIZE=Initial size:", [0.1, 2], 1, "%"],
		["iMinDirection", Particle.iMinDirection, "$$$/IDS_PI_PROC_MIN_INITIAL_DIRECTION=Min initial direction:", [-360, 360], "$$$/IDS_PI_PROC_DEGREES=deg"],
		["iMaxDirection", Particle.iMaxDirection, "$$$/IDS_PI_PROC_MAX_INITIAL_DIRECTION=Max initial direction:", [-360, 360], "$$$/IDS_PI_PROC_DEGREES=deg"],
		["fGravity", Particle.fGravity, "$$$/IDS_PI_PROC_GRAVITY=Gravity:", [-20, 20], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
		["iRotationRate", Particle.iRotationRate, "$$$/IDS_PI_PROC_ROTATION_RATE=Rotation rate:", [-180, 180], "$$$/IDS_PI_PROC_DEGREES=deg"],
];




// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Generator", menuGenerator, "Particle", menuParticle);


