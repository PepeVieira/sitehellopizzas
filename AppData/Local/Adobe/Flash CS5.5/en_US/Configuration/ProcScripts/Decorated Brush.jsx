RenderAPI.setParameter (kUseSingleShape, 0); 

var index = 0


function Module ()
{
	this.pathPoints = new Geometry
	this.smoothPath = 0
	this.active = false
	this.pathFinished = false
	this.newPoint = false
	this.newWidth = false
	this.index = index++

	this.stroke = EnvironmentStroke
	
	this.width = new Array(2)
	this.width[0] = new Vector3 (0, 1, 0)  // the first coordinate will be set to z  multiplied by the curve length
	this.width[1] = new Vector3 (0, 1, 1)

	Engine.addModule (this)  // We have to add module before setting its parameters
	Engine.setModuleParameter (this, "call", "render", 0);
	Engine.setModuleParameter (this, "save render calls", 0)
}


Module.iartType = 1;
Module.fpatternLenght = 40; // 40 pixels
Module.fpatternWidth = 20;
Module.vcolor = new Vector4(0,0,0,1.0); // the pattern color


var geometry;


var makeNewGroup = false
var firstGroup = true
RenderAPI.command (kCommandNewGroup)


Module.prototype.produce = function (system)
{
	var side

	// Get mouse info
	mouseInfo = EnvironmentBrush.query (kBrushGetMouseInfo);

	//Engine.message ("mouse dragging ", mouseInfo.dragging);
	//Engine.message ("button down ", mouseInfo.buttondown);


	if (!mouseInfo.buttondown)
	{
		if (this.active)
		{
			var module = new Module();          // add new module
			Engine.setModuleParameter (module, kModuleDontUndo, 1);

			this.pathFinished = true

			// We could remove the module
			Engine.removeModule (this);

			return kDontCallAgain
		} 

		return kCallAgain
	}
	
	// Button is down

	// Now we can call render
	Engine.setModuleParameter (this, "call", "render", 1);

	if (!this.active)
	{
		// don't set the makeNewGroup for the first stroke
		if (!firstGroup)
			makeNewGroup = true;
		firstGroup = false;
	}

	this.active = true
	
	// Store the point
	this.pathPoints.addPoint(mouseInfo.mousepos)
	
	this.newPoint = true
	this.newWidth = true

	Engine.setParameter (kIncrementalRender, 0)

		
	return kCallAgain
}



Module.prototype.render = function (api, env)
{
	if (makeNewGroup)
	{
		RenderAPI.command (kCommandNewGroup)
		makeNewGroup = false;
	}

	if (!this.active)
		return kCallAgain

	if (this.newPoint)
	{
		//this.smoothPath.setColor (kStrokeColor, 0.0,0.0,0)
		//this.smoothPath.setColor (kFillColor, -1,0,0,0)

		//var color = api.getParameter (kCurrentStrokeColor);
		//geometry.setColor (kStrokeColor, color);
		//var color = api.getParameter (kCurrentFillColor);
		//geometry.setColor (kFillColor, color);

		this.strokeArt = geometry
		this.strokeArt.setColor (kStrokeColor, Module.vcolor)
		//this.strokeArt.setColor (kFillColor, 1,1,0)
		this.stroke.setPath (this.pathPoints, 0.02);
		this.stroke.setArt (this.strokeArt)
		//this.stroke.setCapType (Module.icap)

		this.newPoint = false
	}

	if (this.newWidth)
	{
		this.newWidth = false

		this.stroke.setWidth (this.width)	
	}
		
	this.stroke.render (api)

	if (this.pathFinished)
		return kDontCallAgain;

	return kCallAgain 
}


/////////////////////////////////////////////////////////////////////////////

Engine.addEnvironment ("Brush");
Engine.addEnvironment ("Stroke");



Engine.setParameter (kRunSimulation, 1);



Engine.setSceneBBox (0, 550, 0, 400);
//Engine.setSceneBBox (-10, 10, -10, 10, -10, 10);


// Don't apply frame before each render
Engine.setParameter ("apply frame", 0);

// Create the first module
new Module()


/////////////////////////////////////////////////////////////////////////////
Module.variableUpdated = function (varname)
{
	//Engine.message ("variable updated ", varname)
	if (varname == "iartType" || varname == "fpatternLenght" || varname == "fpatternWidth")
	{
		//Engine.message ("changing art type ", Module.iartType)

		if (Module.iartType == 1) geometry = Engine.loadGeometry ("svg/LineBrushArt01.svg") 
		else if (Module.iartType == 2) geometry = Engine.loadGeometry ("svg/LineBrushArt02.svg") 
		else if (Module.iartType == 3) geometry = Engine.loadGeometry ("svg/LineBrushArt03.svg") 
		else if (Module.iartType == 4) geometry = Engine.loadGeometry ("svg/LineBrushArt04.svg") 
		else if (Module.iartType == 5) geometry = Engine.loadGeometry ("svg/LineBrushArt05.svg") 
		else if (Module.iartType == 6) geometry = Engine.loadGeometry ("svg/LineBrushArt06.svg") 
		else if (Module.iartType == 7) geometry = Engine.loadGeometry ("svg/LineBrushArt07.svg") 
		else if (Module.iartType == 8) geometry = Engine.loadGeometry ("svg/LineBrushArt08.svg") 
		else if (Module.iartType == 9) geometry = Engine.loadGeometry ("svg/LineBrushArt09.svg") 
		else if (Module.iartType == 10) geometry = Engine.loadGeometry ("svg/LineBrushArt10.svg") 
		else if (Module.iartType == 11) geometry = Engine.loadGeometry ("svg/LineBrushArt11.svg") 
		else if (Module.iartType == 12) geometry = Engine.loadGeometry ("svg/LineBrushArt12.svg") 
		else if (Module.iartType == 13) geometry = Engine.loadGeometry ("svg/LineBrushArt13.svg") 
		else if (Module.iartType == 14) geometry = Engine.loadGeometry ("svg/LineBrushArt14.svg") 
		else if (Module.iartType == 15) geometry = Engine.loadGeometry ("svg/LineBrushArt15.svg") 
		else if (Module.iartType == 16) geometry = Engine.loadGeometry ("svg/LineBrushArt16.svg") 
		else if (Module.iartType == 17) geometry = Engine.loadGeometry ("svg/LineBrushArt17.svg") 
		else if (Module.iartType == 18) geometry = Engine.loadGeometry ("svg/LineBrushArt18.svg") 
		else if (Module.iartType == 19) geometry = Engine.loadGeometry ("svg/LineBrushArt19.svg") 
		else if (Module.iartType == 20) geometry = Engine.loadGeometry ("svg/LineBrushArt20.svg") 
/*		
		else if (Module.iartType == 21) geometry = Engine.loadGeometry ("svg/LineBrushArt21.svg") 
		else if (Module.iartType == 22) geometry = Engine.loadGeometry ("svg/LineBrushArt22.svg") 
		else if (Module.iartType == 23) geometry = Engine.loadGeometry ("svg/LineBrushArt23.svg") 
		else if (Module.iartType == 24) geometry = Engine.loadGeometry ("svg/LineBrushArt24.svg") 
		else if (Module.iartType == 25) geometry = Engine.loadGeometry ("svg/LineBrushArt25.svg") 
		else if (Module.iartType == 26) geometry = Engine.loadGeometry ("svg/LineBrushArt26.svg") 
		else if (Module.iartType == 27) geometry = Engine.loadGeometry ("svg/LineBrushArt27.svg") 
		else if (Module.iartType == 28) geometry = Engine.loadGeometry ("svg/LineBrushArt28.svg") 
		else if (Module.iartType == 29) geometry = Engine.loadGeometry ("svg/LineBrushArt29.svg") 
		else if (Module.iartType == 30) geometry = Engine.loadGeometry ("svg/LineBrushArt30.svg") 
		else if (Module.iartType == 31) geometry = Engine.loadGeometry ("svg/LineBrushArt31.svg") 
		else if (Module.iartType == 32) geometry = Engine.loadGeometry ("svg/LineBrushArt32.svg") 
		else if (Module.iartType == 33) geometry = Engine.loadGeometry ("svg/LineBrushArt33.svg") 
		else if (Module.iartType == 34) geometry = Engine.loadGeometry ("svg/LineBrushArt34.svg") 
		else if (Module.iartType == 35) geometry = Engine.loadGeometry ("svg/LineBrushArt35.svg") 
		else if (Module.iartType == 36) geometry = Engine.loadGeometry ("svg/LineBrushArt36.svg") 
		else if (Module.iartType == 37) geometry = Engine.loadGeometry ("svg/LineBrushArt37.svg") 
		else if (Module.iartType == 38) geometry = Engine.loadGeometry ("svg/LineBrushArt38.svg") 
		else if (Module.iartType == 39) geometry = Engine.loadGeometry ("svg/LineBrushArt39.svg") 
		else if (Module.iartType == 40) geometry = Engine.loadGeometry ("svg/LineBrushArt40.svg") 
		else if (Module.iartType == 41) geometry = Engine.loadGeometry ("svg/LineBrushArt41.svg") 
		else if (Module.iartType == 42) geometry = Engine.loadGeometry ("svg/LineBrushArt42.svg") 
		else if (Module.iartType == 43) geometry = Engine.loadGeometry ("svg/LineBrushArt43.svg") 
		else if (Module.iartType == 44) geometry = Engine.loadGeometry ("svg/LineBrushArt44.svg") 
		else if (Module.iartType == 45) geometry = Engine.loadGeometry ("svg/LineBrushArt45.svg") 
		else if (Module.iartType == 46) geometry = Engine.loadGeometry ("svg/LineBrushArt46.svg") 
		else if (Module.iartType == 47) geometry = Engine.loadGeometry ("svg/LineBrushArt47.svg") 
		else if (Module.iartType == 48) geometry = Engine.loadGeometry ("svg/LineBrushArt48.svg") 
		else if (Module.iartType == 49) geometry = Engine.loadGeometry ("svg/LineBrushArt49.svg") 
		else if (Module.iartType == 50) geometry = Engine.loadGeometry ("svg/LineBrushArt50.svg") 
		else if (Module.iartType == 51) geometry = Engine.loadGeometry ("svg/LineBrushArt51.svg") 
		else if (Module.iartType == 52) geometry = Engine.loadGeometry ("svg/LineBrushArt52.svg") 
		else if (Module.iartType == 53) geometry = Engine.loadGeometry ("svg/LineBrushArt53.svg") 
		else if (Module.iartType == 54) geometry = Engine.loadGeometry ("svg/LineBrushArt54.svg") 
		else if (Module.iartType == 55) geometry = Engine.loadGeometry ("svg/LineBrushArt55.svg") 
		else if (Module.iartType == 56) geometry = Engine.loadGeometry ("svg/LineBrushArt56.svg") 
		else if (Module.iartType == 57) geometry = Engine.loadGeometry ("svg/LineBrushArt57.svg") 
		else if (Module.iartType == 58) geometry = Engine.loadGeometry ("svg/LineBrushArt58.svg") 
		else if (Module.iartType == 59) geometry = Engine.loadGeometry ("svg/LineBrushArt59.svg") 
		else if (Module.iartType == 60) geometry = Engine.loadGeometry ("svg/LineBrushArt60.svg") 
		else if (Module.iartType == 61) geometry = Engine.loadGeometry ("svg/LineBrushArt61.svg") 
		else if (Module.iartType == 62) geometry = Engine.loadGeometry ("svg/LineBrushArt62.svg") 
		else if (Module.iartType == 63) geometry = Engine.loadGeometry ("svg/LineBrushArt63.svg") 
		else if (Module.iartType == 64) geometry = Engine.loadGeometry ("svg/LineBrushArt64.svg") 
		else if (Module.iartType == 65) geometry = Engine.loadGeometry ("svg/LineBrushArt65.svg") 
		else if (Module.iartType == 66) geometry = Engine.loadGeometry ("svg/LineBrushArt66.svg") 
		else if (Module.iartType == 67) geometry = Engine.loadGeometry ("svg/LineBrushArt67.svg") 
		else if (Module.iartType == 68) geometry = Engine.loadGeometry ("svg/LineBrushArt68.svg") 
		else if (Module.iartType == 69) geometry = Engine.loadGeometry ("svg/LineBrushArt69.svg") 
		else if (Module.iartType == 70) geometry = Engine.loadGeometry ("svg/LineBrushArt70.svg") 
		else if (Module.iartType == 71) geometry = Engine.loadGeometry ("svg/LineBrushArt71.svg") 
		else if (Module.iartType == 72) geometry = Engine.loadGeometry ("svg/LineBrushArt72.svg") 
		else if (Module.iartType == 73) geometry = Engine.loadGeometry ("svg/LineBrushArt73.svg") 
		else if (Module.iartType == 74) geometry = Engine.loadGeometry ("svg/LineBrushArt74.svg") 
*/

		var bbox = geometry.getValue (kGetBoundingBox)
		var sizex = bbox[1].x - bbox[0].x;
		var sizey = bbox[1].y - bbox[0].y;
		if (sizex == 0)
			sizex = 1;
		if (sizey == 0)
			sizey = 1;
		//Engine.message ("Geometry size: ", sizex, " x ", sizey);

		var width = Module.fpatternLenght / 100;
		if (width < 0.05)
			width = 0.05;
		RenderAPI.lineWidth (width);

		var scaleFrame = new Frame2()
		scaleFrame.scale (Module.fpatternLenght / sizex * 0.5, -Module.fpatternWidth / sizey * 0.5)

		geometry.applyFrame (scaleFrame)

		//Engine.message ("new cap(2) ", Module.icap)
	}
}


Module.variableUpdated ("iartType"); // sets the intial geometry and its scaling


var menu = [
	"Module",
	["iartType", Module.iartType, "",  // was "$$$/IDS_PI_PROC_LINE_STYLE=Line style:", 
                                     ["$$$/IDS_PI_PROC_1_STEP_WAVE= 1: Step Wave",
                                      "$$$/IDS_PI_PROC_2_WAVE= 2: Wave",
                                      "$$$/IDS_PI_PROC_3_DASHED_LINE= 3: Dashed Line",
                                      "$$$/IDS_PI_PROC_4_LINE_DOT= 4: Line Dot",
                                      "$$$/IDS_PI_PROC_5_ZIG_ZAG= 5: Zig Zag",
                                      "$$$/IDS_PI_PROC_6_MAYAN= 6: Mayan", 
                                      "$$$/IDS_PI_PROC_7_CIRCLES= 7: Circles", 
                                      "$$$/IDS_PI_PROC_8_ROPE= 8: Rope",  
                                      "$$$/IDS_PI_PROC_9_TRIANGLES= 9: Triangles",
                                      "$$$/IDS_PI_PROC_10_TWO_WAVES=10: Two waves", 						 
						  "$$$/IDS_PI_PROC_11_MUSIC_NOTES=11: Music Notes",
                                      "$$$/IDS_PI_PROC_12_THICK_ARROWS=12: Thick arrows",
                                      "$$$/IDS_PI_PROC_13_STREAM=13: Stream",
                                      "$$$/IDS_PI_PROC_14_DIAMOND=14: Diamond",
						  "$$$/IDS_PI_PROC_15_HEARTS=15: Hearts",
                                      "$$$/IDS_PI_PROC_16_SHINY_STARS=16: Shiny Stars",
                                      "$$$/IDS_PI_PROC_17_CARTOON_STARS=17: Cartoon Stars",
                                      "$$$/IDS_PI_PROC_18_BUMPS=18: Bumps",
						  "$$$/IDS_PI_PROC_19_SMALL_ARROWS=19: Small Arrows",
                                      "$$$/IDS_PI_PROC_20_THICK_LEAVES=20: Thick Leaves"
									]],

									
	["sdiv", "divider", " ", [0,0]],
	["vcolor", Module.vcolor, "$$$/IDS_PI_PROC_PATTERN_COLOR=Pattern color:", [0,1]],
	["fpatternLenght", Module.fpatternLenght, "$$$/IDS_PATTERN_SIZE=Pattern size:", [4,100], 1, "$$$/IDS_PI_PROC_PIXELS=px"],
	["fpatternWidth", Module.fpatternWidth, "$$$/IDS_PATTERN_WIDTH=Pattern width:", [4,100], 1, "$$$/IDS_PI_PROC_PIXELS=px"]
];


// Specify pairs of 
// - name of class (string) and array of values in case the variables we
//   we want to access from the menu are static
// - object and array of values if the variables are non-static
Engine.makeMenu ("Module", menu);




