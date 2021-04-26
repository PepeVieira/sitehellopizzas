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


var lastUpdate = 0;


///////////////////////////////////////////////////////////////////////////
// Object Module


var mouseInfo = 0;
var index = 1;

var makeNewGroup = false
//RenderAPI.command (kCommandNewGroup)

function ModuleRoof (type)
{
	this.type = type;
}

function Module (frame)
{
	this.frame = frame;
	this.index = index++;
	this.seed = -1;
	this.pressure = 30;
	this.bearing = 0;
	this.lastUpdate = 0;
	this.visible = 0;
	this.type = 0;
	this.drawn = 0;

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
		//if (lastPositionValid)
		{
			// first time after button down
			makeNewGroup = true;
		}
			
		lastPositionValid = 0;
		
		if (this.visible)
	      {
			if (this.index == index-2)
			{
				
				system.addModule (new ModuleRoof(this.type));

			}
				
			return kDontCallAgain;
		}			
					
		return kCallAgain;
	}
	
	if (this.visible)
		return kCallAgain;
		
	// Use the current geometry
	this.geometry = Module.geometry;
	
	this.frame.setPosition (mouseInfo.mousepos);
/*	if (mouseInfo.mousedir)
	{
		// Switch x and y in atan2 since for us 0 degrees is along y axis
		this.frame.rotateDeg (Math.atan2 (mouseInfo.mousedir.x, mouseInfo.mousedir.y) * 180 / 3.14)
	}
*/	
	system.setModuleParameter (this, "call", "render", 1);
	this.visible = 1;
	//Engine.message ("making module ", this.index, " visible");

	Engine.setParameter (kIncrementalRender, 1)
	
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
var framePrevious;

var frameRoot;

var p3;


var firstTime = 0;
var stemLength;

var blockNumber = 0;
var windowColumns;
var type;




//var calledOrNot = 0;

// how to rotate based on the screen orientation  memo
//				frame.rotateDeg (Math.atan2 (this.frame.heading().x, this.frame.heading().y) * 180 / 3.14
//			                 - 90);

ModuleRoof.prototype.render = function (api, env)
{
	// draw roof
	RenderAPI.setParameter(kRenderID,blockNumber);
	blockNumber++;
		
	var frameA1 = new Frame2d(framePrevious);
	frameA1.translate (5,0);

	bdBlock(api,framePrevious,frameA1,this.type+0.5);			

	Engine.removeModule(this);
		
	return kDontCallAgain; 
}


Module.prototype.render = function (api, env)
{

		var firstStem = 0;

	if (makeNewGroup)
	{

		
		
		firstTime = 0;
		
		treeSize = 0.1;
		stemBlock = 0.01;


		windowBlockX = Math.random()*0.1-0.05 + 0.15;
		windowBlockY = Math.random()*0.1-0.05 + 0.2;

		windowColumns = Math.floor(Math.random()*0.2+(Module.isize)*0.8+8);

		shade = Math.random()*0.5 +0.4;

		if (Module.ibuildingType == 1){
			type = parseInt(Math.random() *4);
		} else {
			type = Module.ibuildingType -2;
		}
		
		
		
		RenderAPI.command (kCommandNewGroup)
		makeNewGroup = false;
	}
	this.type = type;

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
		

	var i;
	
	// If we have a parent, let us assume that we move the frame between p1 and p2 
	// (we ignore any rotation or the fact that the path between parent's frame and
	// this frame may not be linear)
	var p2 = this.frame.position();
	var p1 = this.lastPosition;	
	


			frame = new Frame2d (this.frame);

			frame.rotateDeg (- 90);


		RenderAPI.setParameter(kRenderID,blockNumber);
		blockNumber++;


		if (firstTime == 0){

				firstTime = 1;
				frameRoot = new Frame2d(frame);
				framePrevious = new Frame2d(frame);
				stemLength = Math.random()*stemBlock;
				brNumber = 15.0;
				
		} else {
			
			
			var pPrevious = framePrevious.position();
			var pCurrent = sameX(frameRoot,frame).position();
			
			var previous2current = (pCurrent-pPrevious).length();

			if (previous2current > windowBlockY && pPrevious.y < pCurrent.y){

				firstTime++;
		
				var yNumber = parseInt(previous2current / windowBlockY);
				
				var frameA1;
				var frameA2;

					
					for (yy = 0; yy < (yNumber-1); yy++){
						frameA1 = new Frame2d(sameX(frameRoot, framePrevious));
						frameA1.translate (yy*windowBlockY,0);
						frameA2 = new Frame2d(sameX(frameRoot, framePrevious));
						frameA2.translate ((yy+1)*windowBlockY,0);
										
						bdBlock(api,frameA1,frameA2,this.type);			
					}
					
				frameA2 = new Frame2d(sameX(frameRoot, framePrevious));
				frameA2.translate ((yNumber-1)*windowBlockY,0);
				framePrevious = new Frame2d(frameA2);


			}
		}

		if (brNumber > 1){
			brNumber = brNumber -0.5;
		} 



			
			return kDontCallAgain; 

}



function bdBlock(api,frame1,frame2,type)
{


			
			var buildingWidth = windowBlockX * windowColumns;
			frame1.translate (0,-buildingWidth/2);

			api.pushMatrix();
			api.setFrame (frame1);

			switch(type)
								{
									case 0:
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,0,1,0,0,9,9,0.95*shade,0.95*shade,0.975*shade);
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,9,0.95*shade*0.8,0.95*shade*0.8,0.975*shade*0.8);
											if (j == 0){
												patternMaker(api,frame1,j,0,1,1,0,1,9,1,1,1);
												patternMaker(api,frame1,j,0,1,4,0,6,9,0.1,0.1,0.2);
											}else if ( j == windowColumns-1 ){
												patternMaker(api,frame1,j,0,1,8,0,8,9,1,1,1);
												patternMaker(api,frame1,j,0,1,4,0,6,9,0.1,0.1,0.2);
											} else {
												patternMaker(api,frame1,j,0,1,4,0,6,9,0.25,0.25,0.4);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,4,0,6,9,0.1*shade*0.8,0.1*shade*0.8,0.2*shade*0.8);
											}		
										}
									break;
									
									case 0.5:
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,0,1,0,0,9,40,0.95*shade,0.95*shade,0.975*shade);
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,40,0.95*shade*0.8,0.95*shade*0.8,0.975*shade*0.8);

											if (j == 0){
												patternMaker(api,frame1,j,0,1,1,0,1,37,1,1,1);
												patternMaker(api,frame1,j,0,1,4,0,6,37,0.1,0.1,0.2);
												patternMaker(api,frame1,j,0,1,4,36,9,37,0.1*shade,0.1*shade,0.1*shade);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,4,36,9,37,0.1*shade*0.8,0.1*shade*0.8,0.2*shade*0.8);
												
												patternMaker(api,frame1,j,0,1,3,41,4,90,0.1,0.1,0.2); // antenna
												patternMaker(api,frame1,j,0,1,28,41,29,90,0.1,0.1,0.2); // antenna
											}else if ( j == windowColumns-1 ){
												patternMaker(api,frame1,j,0,1,8,0,8,37,1,1,1);
												patternMaker(api,frame1,j,0,1,4,0,6,37,0.1,0.1,0.2);
												patternMaker(api,frame1,j,0,1,0,36,6,37,0.1*shade,0.1*shade,0.1*shade);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,36,6,37,0.1*shade*0.8,0.1*shade*0.8,0.2*shade*0.8);
												
												patternMaker(api,frame1,j,0,1,6,41,7,90,0.1,0.1,0.2); // antenna
												patternMaker(api,frame1,j,0,1,25,41,26,90,0.1,0.1,0.2); // antenna
											} else {
												patternMaker(api,frame1,j,0,1,3,5,6,32,0.25,0.25,0.4);
												patternMaker(api,frame1,j,0,1,1,15,8,22,0.25,0.25,0.4);												
												
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,3,5,6,32,0.1*shade*0.8,0.1*shade*0.8,0.2*shade*0.8);
												patternMaker(api,frame1,j,0,1,0,36,9,37,0.1*shade,0.1*shade,0.1*shade);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,36,9,37,0.1*shade*0.8,0.1*shade*0.8,0.2*shade*0.8);
											}		
										}
									break;


									case 1:
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,9,0.75*shade*0.8,0.73*shade*0.8,0.73*shade*0.8);
											patternMaker(api,frame1,j,0,1,0,0,9,9,0.75*shade,0.73*shade,0.73*shade);
											if (j == 0){
												patternMaker(api,frame1,j,0,1,0,0,0,9,0.1,0.1,0.2);
												patternMaker(api,frame1,j,0,1,9,0,9,9,0.1,0.1,0.2);
											}else if ( j == windowColumns-1 ){
												patternMaker(api,frame1,j,0,1,0,0,0,9,0.1,0.1,0.2);
												patternMaker(api,frame1,j,0,1,9,0,9,9,0.1,0.1,0.2);
											} else {
												patternMaker(api,frame1,j,0,1,2.5,3,7.5,6,0.1,0.1,0.2);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,2.5,3,7.5,6,0.1*0.8,0.1*0.8,0.2*0.8);	
											}		
										}
									break;									
									
									case 1.5:
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,0,1,0,0,9,30,0.75*shade,0.73*shade,0.73*shade);
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,30,0.75*shade*0.8,0.73*shade*0.8,0.73*shade*0.8);

											if (j == 0){

											}else if ( j == windowColumns-1 ){

											} else {
												patternMaker(api,frame1,j,0,1,3,5,6,22,0.1,0.1,0.2);

												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,3,5,6,22,0.1*shade*0.8,0.1*shade*0.8,0.2*shade*0.8);
												patternMaker(api,frame1,j,0,1,0,26,9,27,0.1*shade,0.1*shade,0.1*shade);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,26,9,27,0.1*shade*0.8,0.1*shade*0.8,0.2*shade*0.8);
											}		
										}
									break;	
									
									case 2:
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,9,0.25*shade*0.8,0.26*shade*0.8,0.3*shade*0.8);
											patternMaker(api,frame1,j,0,1,0,0,9,9,0.25*shade,0.26*shade,0.3*shade);

												patternMaker(api,frame1,j,0,1,2,3,9,8,0.5,0.6,0.8);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,2.5,3,7.5,7,0.5,0.6,0.8);	
	
										}
									break;									
									
									case 2.5:
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,0,1,0,0,9,40,0.25*shade,0.26*shade,0.3*shade);
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,40,0.25*shade*0.8,0.26*shade*0.8,0.3*shade*0.8);

											if (j == 0){

												patternMaker(api,frame1,j,0,1,3,41,4,80,0.1,0.1,0.2); // antenna
												patternMaker(api,frame1,j,0,1,28,41,29,80,0.1,0.1,0.2); // antenna
											}else if ( j == windowColumns-1 ){
												
												patternMaker(api,frame1,j,0,1,6,41,7,80,0.1,0.1,0.2); // antenna
												patternMaker(api,frame1,j,0,1,25,41,26,80,0.1,0.1,0.2); // antenna
											} else {
												patternMaker(api,frame1,j,0,1,3,5,6,32,0.5,0.6,0.8);

												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,3,5,6,32,0.5,0.6,0.8);
												patternMaker(api,frame1,j,0,1,0,36,9,37,0.1,0.1,0.1);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,36,9,37,0.1,0.1,0.1);
											}		
										}
									break;										


									case 3:
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,9,0.96*shade*0.8,0.9*shade*0.8,0.88*shade*0.8);
											patternMaker(api,frame1,j,0,1,0,0,9,9,0.98*shade,0.95*shade,0.88*shade);
												
												if ( j%2 == 0){
														patternMaker(api,frame1,j,0,1,4,2,9,9,0.22,0.2,0.1);
														patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,4,2,9,9,0.22,0.2,0.1);	
												} else {
														patternMaker(api,frame1,j,0,1,2,2,7,9,0.22,0.2,0.1);
														patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,2,2,7,9,0.22,0.2,0.1);	
												}
										}
									break;									
									
									case 3.5:
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,0,1,0,0,9,30,0.98*shade,0.95*shade,0.88*shade);
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,30,0.96*shade*0.8,0.9*shade*0.8,0.88*shade*0.8);

											if (j == 0){
												
												patternMaker(api,frame1,j,0,1,3,31,4,50,0.1,0.1,0.2); // antenna
												patternMaker(api,frame1,j,0,1,28,31,29,50,0.1,0.1,0.2); // antenna

											}else if ( j == windowColumns-1 ){
												
												patternMaker(api,frame1,j,0,1,6,31,7,50,0.1,0.1,0.2); // antenna
												patternMaker(api,frame1,j,0,1,25,31,26,50,0.1,0.1,0.2); // antenna
											} else {
												
												if (j%2 == 0){
													patternMaker(api,frame1,j,0,1,4,5,9,22,0.22,0.2,0.1);													
													patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,4,5,9,22,0.22,0.2,0.1);
												} else {
													patternMaker(api,frame1,j,0,1,1,5,5,22,0.22,0.2,0.1);													
													patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,1,5,5,22,0.22,0.2,0.1);
												}
												
												patternMaker(api,frame1,j,0,1,0,26,9,27,0.1,0.1,0.1);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,26,9,27,0.1,0.1,0.1);
											}		
										}
									break;								



									
									default:		
										for (var j = 0; j < windowColumns; j++)
										{
											patternMaker(api,frame1,j,0,1,0,0,9,9,0.65*shade,0.7*shade,0.88*shade);
											patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,0,0,9,9,0.65*shade*0.8,0.7*shade*0.8,0.88*shade*0.8);
											if (j == 0){
												patternMaker(api,frame1,j,0,1,1,0,1,9,0.1,0.1,0.2);
												patternMaker(api,frame1,j,0,1,8,0,8,9,0.1,0.1,0.2);
											}else if ( j == windowColumns-1 ){
												patternMaker(api,frame1,j,0,1,1,0,1,9,0.1,0.1,0.2);
												patternMaker(api,frame1,j,0,1,8,0,8,9,0.1,0.1,0.2);
											} else {
												patternMaker(api,frame1,j,0,1,2.25,2.25,6.75,6.75,0.1,0.1,0.2);
												patternMaker(api,frame1,j,windowColumns*windowBlockX,0.25,2.25,2.25,6.75,6.75,0.1*shade*0.8,0.1*shade*0.8,0.2*shade*0.8);
											}		
										}
									break;
								}


				api.popMatrix();	

} 


function patternMaker(api,frame,j,offset,ratio,x1,y1,x2,y2,r,g,b)
{
				//api.pushMatrix();
				api.Color (kStrokeColor, 0,0,0,0);					
				api.Color (kFillColor, r,g,b);

				//api.setFrame (frame);
				var verts = new Array(4);
				verts[0] = new Vector3(y1*(windowBlockY/10), 				offset + (j*windowBlockX + x1*(windowBlockX/10))*ratio);
				verts[1] = new Vector3(y1*(windowBlockY/10), 				offset + (j*windowBlockX + (x2+0.999)*(windowBlockX/10))*ratio);
				verts[2] = new Vector3((y2+0.999)*(windowBlockY/10), 	offset + (j*windowBlockX  + (x2+0.999)*(windowBlockX/10))*ratio);
				verts[3] = new Vector3((y2+0.999)*(windowBlockY/10), 	offset + (j*windowBlockX + x1*(windowBlockX/10))*ratio);		

				api.Polygon(verts);
				//api.popMatrix();	
				return;
}


function sameX(frame1, frame2)
{
				var fp1 = frame1.toLocalCoords(frame2.position());
				var frameS = new Frame2d(frame1);
				frameS.translate(fp1.x,0);
				
				return frameS;
	
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
	system.setParameter (kIncrementalRender, 1);

	var frame = new Frame2d();
	var initialModule = new Module (frame);

}

var initial = new Initial()

Engine.addEnvironment ("Brush");


// Set size of the scene, but after all environments that need bbox are specified
Engine.setSceneBBox (-5, 5, -5, 5);

Engine.setParameter (kRunSimulation, 1);


/////////////////////////////////////////////////////////////////////////////
// Menu name, followed by 
var menuModule;

Module.ibuildingType = 1;
Module.isize = 1
Module.irandomSize = 0;

menuModule = [
		"Module",
		["ibuildingType", Module.ibuildingType, "", // was "$$$/IDS_PI_PROC_BUILDING_TYPE=Building type:", 
                             ["$$$/IDS_PI_PROC_RANDOM_BUILDING=Random building", 
                              "$$$/IDS_PI_PROC_SKYSCRAPER1=Skyscraper 1", 
                              "$$$/IDS_PI_PROC_SKYSCRAPER2=Skyscraper 2", 
                              "$$$/IDS_PI_PROC_SKYSCRAPER3=Skyscraper 3", 
                              "$$$/IDS_PI_PROC_SKYSCRAPER4=Skyscraper 4"]],
		["isize", Module.isize, "$$$/IDS_PI_PROC_BUILDING_SIZE=Building Size:", [1, 10]],
//		["irandomSize", Module.irandomSize, "$$$/IDS_PI_PROC_RANDOM_SIZE=Random size", [0, 1]]
];

// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menuModule);

Engine.setInitialObject (initial);

