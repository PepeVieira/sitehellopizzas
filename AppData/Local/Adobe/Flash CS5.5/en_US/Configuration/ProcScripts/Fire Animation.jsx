
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
// Object Module
Module.fsize = 1;

var index = 1;
var flameNumber = 0;
var frameTotal = 0;


function Module (frame)
{
	this.frame = frame;
	this.index = index++;
	
	//Engine.error ("adding module ", this.index);
	
	Engine.addModule (this); // We have to add module before setting its parameters
}


var currentLayer = 0;

var firstFlame = 0;

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
	var radx = 0.5;
	var rady = 0.5;


	var i;
	var frame;
	
	//Engine.error ("creating ", numSymbols, " symbols");
	
	for (i = 0; i < numSymbols; i++)
	{
		// Generate a random point in the rectangle given by the brush radii
		var x = -radx + Math.random() * 2 * radx;
		var y = -rady + Math.random() * 2 * rady;
		
		// Make it an ellipse, if needed
		if (x*x / (radx*radx) + y*y / (rady*rady) > 1)
		{
			i--;
			continue;
		}
	
	
		var scale = Module.fsize/7.5;		

		
		frame = new Frame2d (this.frame);
		var base = (Math.random() > 0.1);
		if (base){
			frame.translate (x *Module.fsize, y *Module.fsize);
		}else{
			frame.translate (0,-0.5* Module.fsize);
		}
		frame.rotateDeg (-90);
		
		frame.setSize (scale, scale);
			
		if (frameTotal <= Module.iduration)
		{
			var module = new Modulefireflame (frame, scale,base);
		}
		else
		{
			if (Module.iEndAnimation)
				var module = new ModulefireflameDummy (frame, scale,base);
		}
	}
	
	return kCallAgain;
}

// Module has no render method

///////////////////////////////////////////////////////////////////////////////////////////////
Modulefireflame.isymbolRandomScale = 1;
Module.fspeed = 1;
Modulefireflame.ispark = 5;
Modulefireflame.isymbolRandomRotate = 0;
Module.iEndAnimation = 0;

Module.iduration = 50;


function Modulefireflame (frame, scale,base)
{
	firstFlame = 0;	
	
	this.frame = frame;
	this.scale = scale;
	this.lifeSpan = 30;
	this.age = 0;
	this.fade = 0.9;
	this.ends = 0;


		var pss = 0.3;// * Module.fsize ;

		var pds = 10;//* Module.fsize;
		
	if (base){
		
		var t = 5;//* Module.fsize;


		this.pointX0 = -2*t+(Math.random()*0.1-0.05)*pds;
		this.pointY0 = 0+(Math.random()*0.1-0.05)*pds;
		this.pointX1 = -1.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY1 = 0.45*t+(Math.random()*0.1-0.05)*pds;
		this.pointX2 = -1.1*t+(Math.random()*0.1-0.05)*pds;
		this.pointY2 = 0.5*t+(Math.random()*0.1-0.055)*pds;	
		this.pointX3 = -0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY3 = 0.4*t+(Math.random()*0.1-0.05)*pds;
		this.pointX4 = -0.3*t+(Math.random()*0.1-0.05)*pds;
		this.pointY4 = 0+(Math.random()*0.25-0.125)*pds;
		this.pointX5 = -0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY5 = -0.4*t+(Math.random()*0.1-0.05)*pds;
		this.pointX6 = -1.1*t+(Math.random()*0.1-0.05)*pds;
		this.pointY6 = -0.5*t+(Math.random()*0.1-0.05)*pds;
		this.pointX7 = -1.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY7 = -0.45*t+(Math.random()*0.1-0.05)*pds;	
	
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
	
	
		this.speed = (0.01 + Math.random() * 0.01) *  Module.fspeed;
		this.direction = new Vector3 ((-0.2 + Math.random() * 0.4) * Module.fsize, (1 + Math.random() * 0.4) * Module.fsize, 0.0);
	}else{
		
		var t = 5.25;//* Module.fsize;


		this.pointX0 = -2*t+(Math.random()*0.1-0.05)*pds;
		this.pointY0 = 0+(Math.random()*0.1-0.05)*pds;
		this.pointX1 = -1.9*t+(Math.random()*0.1-0.05)*pds;
		this.pointY1 = 0.4*t+(Math.random()*0.1-0.05)*pds;
		this.pointX2 = -1.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY2 = 0.7*t+(Math.random()*0.1-0.055)*pds;	
		this.pointX3 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointY3 = 1*t+(Math.random()*0.1-0.05)*pds;
		this.pointX4 = 1.5*t+(Math.random()*0.1-0.05)*pds;
		this.pointY4 = 0+(Math.random()*0.25-0.125)*pds;
		this.pointX5 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointY5 = -1*t+(Math.random()*0.1-0.05)*pds;
		this.pointX6 = -1.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointY6 = -0.7*t+(Math.random()*0.1-0.05)*pds;
		this.pointX7 = -1.9*t+(Math.random()*0.1-0.05)*pds;
		this.pointY7 = -0.4*t+(Math.random()*0.1-0.05)*pds;	
	
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
	
	
		this.speed = (0.001 + Math.random() * 0.003) * Module.fspeed;
		this.direction = new Vector3 ((-0.2 + Math.random() * 0.4) * Module.fsize, (1 + Math.random() * 0.4) * Module.fsize, 0.0);
	}


	Engine.addModule (this); // We have to add module before setting its parameters
	//Engine.setModuleParameter (this, "call", "render", 0);
	//Engine.setModuleParameter (this, "save render calls", 1);
	Engine.setModuleParameter (this, kModuleApplyFrame, 0);
}


function ModulefireflameDummy (frame, scale,base)
{
	Engine.addModule (this); // We have to add module before setting its parameters
	//Engine.setModuleParameter (this, "call", "render", 0);
	//Engine.setModuleParameter (this, "save render calls", 1);
	Engine.setModuleParameter (this, kModuleApplyFrame, 0);
}




Modulefireflame.prototype.produce = function (system)
{
	this.direction.x += -0.02 + Math.random() * 0.04; 
	this.frame.setPosition (this.frame.position() + (this.speed * this.direction)* Module.fspeed);

	this.speed += 0.001
	
	this.age++;
	this.lifeSpan = this.lifeSpan -1;
	
	if (this.ends == 1 ){
		this.fade *= 0.8 + (Modulefireflame.ispark-5)*(0.15/5);
		this.speed *= 1.02;
			if (this.fade < 0.24){
				Engine.removeModule (this);
				return kDontCallAgain;
			} 
		}else if (this.fade < 1){
				this.fade += 0.05;

		} else if (this.lifeSpan <= Math.random()*15){
				this.ends = 1;
				this.fade *= 0.8;
				this.speed *= 1.02;

	}
	
	
}



Modulefireflame.prototype.render = function (api, env)
{
	
	if (frameTotal > Module.iduration+1 && !Module.iEndAnimation)
         return kCallAgain;

	
	if (1)
	{
		api.pushMatrix();
		api.setFrame (this.frame);
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
		

		if (firstFlame != 0)
		{
			api.setParameter (kRenderOrder, kRenderBelow,firstFlame);
		}
		RenderAPI.setParameter(kRenderID,flameNumber);
		flameNumber++;
		
		api.Color (kStrokeColor, 1,0.2,0,0);
		api.Color (kFillColor, Module.vcolor1.x, Module.vcolor1.y, Module.vcolor1.z);

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
		
		growing = 1;
			
		if (this.fade > 0.9){
			
				if (firstFlame == 0)
				{
					firstFlame = flameNumber;
					RenderAPI.setParameter(kRenderID,flameNumber);
				} else {
					api.setParameter (kRenderOrder, kRenderAbove,firstFlame);
					RenderAPI.setParameter(kRenderID,flameNumber);
				}	
					flameNumber++;			
			
				api.Color (kStrokeColor, 1,0.5,0,0);
				api.Color (kFillColor, (Module.vcolor1.x + Module.vcolor2.x)/2, (Module.vcolor1.y + Module.vcolor2.y)/2, (Module.vcolor1.z + Module.vcolor2.z)/2);
				var t = 0.65;
				var ml = -4.5;//* Module.fsize;
				var verts = new Array(8);

				verts[0] = new Vector3(this.pointX0*this.fade*t+ml, this.pointY0*this.fade*t);
				verts[1] = new Vector3(this.pointX1*this.fade*t+ml, this.pointY1*this.fade*t);
				
				verts[2] = new Vector3(this.pointX2*this.fade*t+ml, this.pointY2*this.fade*t);
				verts[3] = new Vector3(this.pointX3*this.fade*t+ml, this.pointY3*this.fade*t);
				
				verts[4] = new Vector3(this.pointX4*this.fade*t+ml, this.pointY4*this.fade*t);
				verts[5] = new Vector3(this.pointX5*this.fade*t+ml, this.pointY5*this.fade*t);
				
				verts[6] = new Vector3(this.pointX6*this.fade*t+ml, this.pointY6*this.fade*t);
				verts[7] = new Vector3(this.pointX7*this.fade*t+ml, this.pointY7*this.fade*t);					
					
//				api.translate(0,0,0.1);	
				api.Polygon(verts);	
		
				if (this.age <15){

					api.setParameter (kRenderOrder, kRenderOnTop);		
					RenderAPI.setParameter(kRenderID,flameNumber);
					flameNumber++;
			
					
					
					
					api.Color (kStrokeColor, 1,0.9,0,0);
					api.Color (kFillColor, Module.vcolor2.x, Module.vcolor2.y, Module.vcolor2.z);
					if (this.age < 10){
						t = 0.45;
					}else{
						t = 0.45 * (15-this.age)/5;
					}
					//var t = 0.45;
					var ml = -6;// * Module.fsize;
					var verts = new Array(8);

					verts[0] = new Vector3(this.pointX0*this.fade*t+ml, this.pointY0*this.fade*t);
					verts[1] = new Vector3(this.pointX1*this.fade*t+ml, this.pointY1*this.fade*t);
				
					verts[2] = new Vector3(this.pointX2*this.fade*t+ml, this.pointY2*this.fade*t);
					verts[3] = new Vector3(this.pointX3*this.fade*t+ml, this.pointY3*this.fade*t);
				
					verts[4] = new Vector3(this.pointX4*this.fade*t+ml, this.pointY4*this.fade*t);
					verts[5] = new Vector3(this.pointX5*this.fade*t+ml, this.pointY5*this.fade*t);
				
					verts[6] = new Vector3(this.pointX6*this.fade*t+ml, this.pointY6*this.fade*t);
					verts[7] = new Vector3(this.pointX7*this.fade*t+ml, this.pointY7*this.fade*t);					
					
//					api.translate(0,0,0.2);	
					api.Polygon(verts);			
				}	
		}

		api.popMatrix();
	}
	
    return kCallAgain; 
}

///////////////////////////////////////////////////////////////////////////
// Method called at the beginning of each simulation step
Modulefireflame.iAnimatePatern = 0;
Modulefireflame.iframeStep = 0;


var frameNum = 0
var growing = 0;

// Called at the beginning of each growth (simulation) step
function StartEach () 
{			
	if(growing)
	{
	       if (frameTotal <= Module.iduration || Module.iEndAnimation)
				RenderAPI.command (kCommandNextFrame, kEmptyFrame);
		frameNum++
		firstFlame = 0;
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


Engine.addEnvironment ("Brush");


Module.vcolor1 = new Vector4(1,0.2,0,1.0); // the flame color
Module.vcolor2 = new Vector4(1,0.9,0,1.0); // the flame core color

// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (0, 20, 0, 20);

Engine.setParameter (kRunSimulation, 1);

/////////////////////////////////////////////////////////////////////////////


// Menu name, followed by 

var menuModule = [
	"Module",
	["fsize", Module.fsize, "$$$/IDS_PI_PROC_FIRE_SIZE=Fire size:", [0.5, 2.5], 1, "%"],
	["fspeed", Module.fspeed, "$$$/IDS_PI_PROC_FIRE_SPEED=Fire speed:", [0.5, 2],  1, "%"],	
	["iduration", Module.iduration, "$$$/IDS_PI_PROC_FIRE_DURATION=Fire duration:", [10, 200], "$$$/IDS_PI_PROC_FRAMES=frames"],	
	["iEndAnimation", Module.iEndAnimation, "$$$/IDS_PI_PROC_END_ANIMATION=End animation", [0, 1]],	
	
	["vcolor1", Module.vcolor1, "$$$/IDS_PI_PROC_FLAME_COLOR=Flame color:", [0,1]],
	["vcolor2", Module.vcolor2, "$$$/IDS_PI_PROC_FLAME_CORE_COLOR=Flame core color:", [0,1]],	
];
	
var menuModulefireflame = [
	"Modulefireflame",

	["ispark", Modulefireflame.ispark, "$$$/IDS_PI_PROC_FIRE_SPARK=Fire spark", [0, 10]],	
	//["iframeStep", Modulefireflame.iframeStep, "Frame step:", [0, 100]]
];


// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule, "Modulefireflame", menuModulefireflame);

Engine.setInitialObject (initial);

