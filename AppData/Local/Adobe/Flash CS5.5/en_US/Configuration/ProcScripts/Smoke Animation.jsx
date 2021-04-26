
///////////////////////////////////////////////////////////////////////////
// This method gets called when the user clicks on the scene. It receives
// a geometry with the object, inside which the user clicks. We don't
// use this object, we just set the frametotal to 1 to trigger the Module's
// produce method.

function addObstacle (newGeometry)
{
	if (frameTotal == 0)
		frameTotal = 1;
}

Engine.exposeGeometry ("obstacle", "addObstacle");


///////////////////////////////////////////////////////////////////////////

var smokeflameCreated = 0;

///////////////////////////////////////////////////////////////////////////
// Object Module
Module.fsize = 1.5;
Module.fradius = 0.5;

var index = 1;
var sum = 0;

var smokeNumber = 0;

var frameTotal = 0;

function Module (frame)
{
	this.frame = frame;
	this.index = index++;
	
	//Engine.error ("adding module ", this.index);
	
	Engine.addModule (this); // We have to add module before setting its parameters
}


var currentLayer = 0;

Module.prototype.produce = function (system)
{
	if (frameTotal == 0)
		return kCallAgain;

	frameTotal++;
//		Engine.message (frameTotal);
	
	// Get mouse info
	var mouseInfo = EnvironmentBrush.query (kBrushGetMouseInfo);
	
	if (mouseInfo.buttondown)
		this.frame.setPosition (mouseInfo.mousepos);
			
	var numSymbols = 2;
	var radx = Module.fradius/5;
	var rady = Module.fradius/10;

	var i;
	var frame;
	
	//Engine.error ("creating ", numSymbols, " symbols");
	
	for (i = 0; i < numSymbols; i++)
	{
		// Generate a random point in the rectangle given by the brush radii
		var s = Math.sin(sum/30); //Math.random()*2-1;
		var x = s * radx *Module.fsize; // + (sum%10)/10-0.5;
		var y = -rady + Math.random()* 2 * rady;
		
		sum++;

		frame = new Frame2d (this.frame);
		var base = (Math.random() > 0.1);
		if (base){
			frame.translate (x, y);
		}else{
			frame.translate (x,y);//0,-0.5);
		}
		frame.rotateDeg (-90);
		
		var scale = Module.fsize/7.5;

		frame.setSize (scale, scale);			
			

		if (frameTotal <= Module.iduration)
		{
			var module = new ModuleSmoke (frame, scale,base,s,sum);
		}
		else
		{
			if (Module.iEndAnimation)
				var module = new ModuleSmokeDummy (frame, scale,base,s,sum);
		}
	}
	
	return kCallAgain;
}

// Module has no render method

///////////////////////////////////////////////////////////////////////////////////////////////
ModuleSmoke.isymbolRandomScale = 1;
ModuleSmoke.isymbolRandomRotate = 0;
Module.fspeed = 1;
Module.iEndAnimation = 0;

Module.iduration = 50;

function ModuleSmoke (frame, scale,base,s,sum)
{
	smokeflameCreated = 1;
	
	this.frame = frame;
	this.scale = scale;
	this.lifeSpan = 30+sum%70;
	this.age = 0;
	this.fade = 0.9;
	this.ends = 0;


		var pss = 0.009;

		var pds = 0.001;
		
	if (base){
		
		var t = 2.5;

		this.pointX0 = -2*t+(Math.random()*0.1-0.05)*pds;
		this.pointY0 = 0+(Math.random()*0.1-0.05)*pds;
		this.pointX1 = -1.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY1 = 0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointX2 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointY2 = 1*t+(Math.random()*0.1-0.055)*pds;	
		this.pointX3 = -0.3*t+(Math.random()*0.1-0.05)*pds;
		this.pointY3 = 0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointX4 = 0*t+(Math.random()*0.1-0.05)*pds;
		this.pointY4 = 0+(Math.random()*0.25-0.125)*pds;
		this.pointX5 = -0.3*t+(Math.random()*0.1-0.05)*pds;
		this.pointY5 = -0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointX6 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointY6 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointX7 = -1.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY7 = -0.7*t+(Math.random()*0.1-0.05)*pds;	
	
		this.pointSpeedX0 = Math.random()*pss - pss/2;
		this.pointSpeedY0 = Math.random()*pss - pss/2;
		this.pointSpeedX1 = Math.random()*pss - pss/2;
		this.pointSpeedY1 = -Math.random()*pss/2;
		this.pointSpeedX2 = Math.random()*pss - pss/2;
		this.pointSpeedY2 = -Math.random()*pss/2;
		this.pointSpeedX3 = Math.random()*pss - pss/2;
		this.pointSpeedY3 = -Math.random()*pss/2;
		this.pointSpeedX4 = Math.random()*pss - pss/2;
		this.pointSpeedY4 = Math.random()*pss - pss/2;
		this.pointSpeedX5 = Math.random()*pss - pss/2;
		this.pointSpeedY5 = Math.random()*pss/2;
		this.pointSpeedX6 = Math.random()*pss - pss/2;
		this.pointSpeedY6 = Math.random()*pss/2;
		this.pointSpeedX7 = Math.random()*pss - pss/2;
		this.pointSpeedY7 = Math.random()*pss/2;
	
	//Engine.message ("fspeed =", Module.fspeed);
	
		this.speed = ((1-Math.abs(s))*0.0001 + Math.random() * 0.0001) * Module.fspeed;
		this.direction = new Vector3 ((-0.2 + Math.random() * 0.4) * Module.fsize, (1 + Math.random() * 0.4) * Module.fsize, 0.0);
	}else{
		
		t = 2.5;

		this.pointX0 = -2*t+(Math.random()*0.1-0.05)*pds;
		this.pointY0 = 0+(Math.random()*0.1-0.05)*pds;
		this.pointX1 = -1.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY1 = 0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointX2 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointY2 = 1*t+(Math.random()*0.1-0.055)*pds;	
		this.pointX3 = -0.3*t+(Math.random()*0.1-0.05)*pds;
		this.pointY3 = 0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointX4 = 0*t+(Math.random()*0.1-0.05)*pds;
		this.pointY4 = 0+(Math.random()*0.25-0.125)*pds;
		this.pointX5 = -0.3*t+(Math.random()*0.1-0.05)*pds;
		this.pointY5 = -0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointX6 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointY6 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointX7 = -1.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY7 = -0.7*t+(Math.random()*0.1-0.05)*pds;	
	
		this.pointSpeedX0 = Math.random()*pss - pss/2;
		this.pointSpeedY0 = Math.random()*pss - pss/2;
		this.pointSpeedX1 = Math.random()*pss - pss/2;
		this.pointSpeedY1 = -Math.random()*pss/2;
		this.pointSpeedX2 = Math.random()*pss - pss/2;
		this.pointSpeedY2 = -Math.random()*pss/2;
		this.pointSpeedX3 = Math.random()*pss - pss/2;
		this.pointSpeedY3 = -Math.random()*pss/2;
		this.pointSpeedX4 = Math.random()*pss - pss/2;
		this.pointSpeedY4 = Math.random()*pss - pss/2;
		this.pointSpeedX5 = Math.random()*pss - pss/2;
		this.pointSpeedY5 = Math.random()*pss/2;
		this.pointSpeedX6 = Math.random()*pss - pss/2;
		this.pointSpeedY6 = Math.random()*pss/2;
		this.pointSpeedX7 = Math.random()*pss - pss/2;
		this.pointSpeedY7 = Math.random()*pss/2;
	
	
		this.speed = ((1-Math.abs(s))*0.00002 + Math.random() * 0.00002) * Module.fspeed;
		this.direction = new Vector3 ((-0.2 + Math.random() * 0.4) * Module.fsize, (1 + Math.random() * 0.4) * Module.fsize, 0.0);
	}


	Engine.addModule (this); // We have to add module before setting its parameters
	//Engine.setModuleParameter (this, "call", "render", 0);
	//Engine.setModuleParameter (this, "save render calls", 1);
	Engine.setModuleParameter (this, kModuleApplyFrame, 0);
}


function ModuleSmokeDummy (frame, scale,base,s,sum)
{
	Engine.addModule (this); // We have to add module before setting its parameters
	//Engine.setModuleParameter (this, "call", "render", 0);
	//Engine.setModuleParameter (this, "save render calls", 1);
	Engine.setModuleParameter (this, kModuleApplyFrame, 0);
}


ModuleSmoke.prototype.produce = function (system)
{
	this.direction.x += -0.02 + Math.random() * 0.04; 
	this.frame.setPosition (this.frame.position() + (this.speed * this.direction/1.2)* Module.fspeed);

	this.speed += 0.001
	
	this.age++;
	this.lifeSpan = this.lifeSpan -1;
	
	if (this.ends == 1 ){
		this.fade *= 0.85;
		this.speed *= 0.9;
			if (this.fade < 0.24){
				Engine.removeModule (this);
				return kDontCallAgain;
			} 
		}else if (this.fade < 1){
				this.fade += 0.05;

		} else if (this.lifeSpan <= Math.random()*25){
				this.ends = 1;
				this.fade *= 0.85;
				this.speed *= 0.9;
	}
}


ModuleSmoke.prototype.render = function (api, env)
{
	
	if (frameTotal > Module.iduration+1 && !Module.iEndAnimation)
         return kCallAgain;
	
	if (1)
	{
		api.pushMatrix();
		api.setFrame (this.frame);
//		Module.geometry[this.geometryIndex].render (api);
//		api.Circle(this.frame,Math.random()*5);
		

		this.pointX0 += this.pointSpeedX0;
		this.pointY0 += this.pointSpeedY0;
		this.pointX1 += this.pointSpeedX1;
		this.pointY1 += this.pointSpeedY1;
		this.pointX2 += this.pointSpeedX2;
		this.pointY2 += this.pointSpeedY2;	
		this.pointX3 += this.pointSpeedX3;
		this.pointY3 += this.pointSpeedY3;
		this.pointX4 += this.pointSpeedX4;
		this.pointY4 += this.pointSpeedY4;
		this.pointX5 += this.pointSpeedX5;
		this.pointY5 += this.pointSpeedY5;
		this.pointX6 += this.pointSpeedX6;
		this.pointY6 += this.pointSpeedY6;
		this.pointX7 += this.pointSpeedX7;
		this.pointY7 += this.pointSpeedY7;	

		RenderAPI.setParameter(kRenderID,smokeNumber);
		smokeNumber++;

	if (this.ends != 1 ){
			api.Color (kStrokeColor, 0,0,0,0);
			api.Color (kFillColor, Module.vcolor1.x,Module.vcolor1.y,Module.vcolor1.z);
	} else {
			api.Color (kStrokeColor, 0,0,0,0);
			api.Color (kFillColor, Module.vcolor1.x*this.fade + Module.vcolor2.x*(1-this.fade), Module.vcolor1.y*this.fade + Module.vcolor2.y*(1-this.fade), Module.vcolor1.z*this.fade + Module.vcolor2.z*(1-this.fade));
				
	}
	
		var verts = new Array(8);

		verts[0] = new Vector3(this.pointX0*this.fade, this.pointY0*this.fade);
		verts[1] = new Vector3(this.pointX1*this.fade, this.pointY1*this.fade);
				
		verts[2] = new Vector3(this.pointX2*this.fade, this.pointY2*this.fade);
		verts[3] = new Vector3(this.pointX3*this.fade, this.pointY3*this.fade);
				
		verts[4] = new Vector3(this.pointX4*this.fade, this.pointY4*this.fade);
		verts[5] = new Vector3(this.pointX5*this.fade, this.pointY5*this.fade);
				
		verts[6] = new Vector3(this.pointX6*this.fade, this.pointY6*this.fade);
		verts[7] = new Vector3(this.pointX7*this.fade, this.pointY7*this.fade);					
					
//		api.translate(0,0,1);	
		api.Polygon(verts);	
		
//		Engine.message ("setting drawing to 1 ");
		growing = 1;
		
		
		

		api.popMatrix();
	}
	else
		api.Line (this.frame.position(),
		          this.frame.position() - this.direction * this.speed);
	
    return kCallAgain; 
}


///////////////////////////////////////////////////////////////////////////
// Method called at the beginning of each simulation step
ModuleSmoke.iAnimatePatern = 0;
ModuleSmoke.iframeStep = 0;


var frameNum = 0
var growing = 0;

// Called at the beginning of each growth (simulation) step
function StartEach () 
{
			
	if(growing)
	{
	       if (frameTotal <= Module.iduration || Module.iEndAnimation)
				RenderAPI.command (kCommandNextFrame, kEmptyFrame);
//		Engine.message ("drawing frame ", frameNum);
		frameNum++
	}
	growing = 0;
   	return kCallAgain; 
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
Initial.fwinsize = 10;

Engine.addEnvironment ("Brush");

// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (-Initial.fwinsize, Initial.fwinsize, -Initial.fwinsize, Initial.fwinsize, 
					 -Initial.fwinsize*1.5, Initial.fwinsize*1.5);

Engine.setParameter (kRunSimulation, 1);


/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 

Module.vcolor1 = new Vector3 (0.85,0.85,0.85);
Module.vcolor2 = new Vector3 (1,1,1);


var menuModule = [
	"Module",
	["fsize", Module.fsize, "$$$/IDS_PI_PROC_SMOKE_SIZE=Smoke size:", [0.44, 2.6], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
	["fspeed", Module.fspeed, "$$$/IDS_PI_PROC_SMOKE_SPEED=Smoke speed:", [0.5, 2], 1, "%"],	
	
	["iduration", Module.iduration, "$$$/IDS_PI_PROC_SMOKE_DURATION=Smoke duration:", [10, 200], "$$$/IDS_PI_PROC_FRAMES=frames"],		
	["iEndAnimation", Module.iEndAnimation, "$$$/IDS_PI_PROC_END_ANIMATION=End animation", [0, 1]],	
	
	["vcolor1", Module.vcolor1, "$$$/IDS_PI_PROC_SMOKE_COLOR=Smoke color:", [0,1]],
	["vcolor2", Module.vcolor2, "$$$/IDS_PI_PROC_BACKGROUND_COLOR=Background color:", [0,1]]
];

// Not used
var menuModuleSmoke = [
	"ModuleSmoke",
	["isymbolRandomScale", ModuleSmoke.isymbolRandomScale, "smokeflame random scale", [0, 1]],
	["isymbolRandomRotate", ModuleSmoke.isymbolRandomRotate, "smokeflame random rotate", [0, 1]],
];

// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule);

Engine.setInitialObject (initial);

