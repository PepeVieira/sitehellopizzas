///////////////////////////////////////////////////////////////////////////
var drawModules = 0; // OK from all

var handles;
var handles2;

var totalIndex = 0;

// Flags controlling the type of handle
var kPivotPoint = 1
var kDirectionPoint = 2
var kFirstPoint = 2
var kScaleDirectionPoint = 4
var kAnglePoint = 8
var kNumberPoint = 16

///////////////////////////////////////////////////////////////////////////
// Object SymmetryHandles
function SymmetryHandles (frame, index, frameIsRelative, previousHandle)
{
	this.frame = frame;
	this.selected = 0;
	this.index = index;
	totalIndex += index;
	this.previousHandle = previousHandle;
	
	this.num = 8;
	this.distance = 1;
	this.handleType = 0;
	this.relativeFrame = frameIsRelative ? kFirstMatrixIsIdentity : "";
	
	this.symmetry = new Symmetry;
	Engine.addModule (this.symmetry)
	
	this.directionPt = new Vector2 (0,5);
	this.numberPt = new Vector2 (0.22, 0);
	
	var frame2 = new Frame2 (this.frame);
	frame2.rotateDeg (360 / this.num);
	this.anglePt = frame2.applyToVector (new Vector2(0,3))

	this.setSymmetry()

	Engine.addModule (this); // We have to add module before setting its parameters
	Engine.setModuleParameter (this, "call", "render", SymmetryHandles.ishow);
	Engine.setModuleParameter (this, kModuleSaveRenderCalls, 0);
	Engine.setModuleParameter (this, kModuleApplyFrame, 1);
}


function UndoData (handle)
{
	if (!handle)
	{
		this.frame = 0
		return
	}

	this.frame = new Frame2 (handle.frame)
	//Engine.message ("Storing pos ", this.frame.position().x, ", ", this.frame.position().y);

	this.index = handle.index
	this.num = handle.num
	this.distance = handle.distance
	this.anglePt = new Vector2 (handle.anglePt.x, handle.anglePt.y)
}

function SetHandleData (handle, data)
{
	if (!data.frame)
		return;

	handle.frame.reset()
	handle.frame.setPosition (data.frame.position())
	handle.frame.setHeading (data.frame.heading())
	handle.frame.setRight (data.frame.right())
	
	//Engine.message ("Restoring pos ", handle.frame.position().x, ", ", handle.frame.position().y);
	handle.index = data.index
	handle.num = data.num
	handle.distance = data.distance
	handle.anglePt.x = data.anglePt.x
	handle.anglePt.y = data.anglePt.y
}


SymmetryHandles.prototype.setSymmetry = function ()
{
	this.type = this.index == 1 ? SymmetryHandles.itype1 : SymmetryHandles.itype2;
	switch (this.type)
	{
	case 1:
		this.symmetry.set (this.type, this.frame, this.relativeFrame);
		this.handleType = 0; // no handle
		break;
		
	case kSymmetryLineReflection:
		this.directionPt.y = 5;
		this.symmetry.set (this.type, this.frame, this.relativeFrame);
		this.handleType = kPivotPoint | kFirstPoint; // a single line
		break;
		
	case kSymmetryPointReflection:
		var position = this.frame.position();
		this.frame.reset(); // we need up heading
		this.frame.setPosition (position);
		this.directionPt.y = 5;
		this.symmetry.set (this.type, this.frame.position(), this.relativeFrame);
		this.handleType =  kPivotPoint; // just a point
		break;
		
	case kSymmetryRotation:
		this.directionPt.y = 5;
		this.symmetry.set (this.type, this.num, this.frame, this.relativeFrame);
		this.handleType =  kPivotPoint | kDirectionPoint | kAnglePoint; // two lines
		break;
		
	case kSymmetryTranslation:
		this.directionPt.y = this.distance
		this.numberPt.y = this.distance * this.num
		this.symmetry.set (this.type, this.num, this.distance, this.frame, this.relativeFrame);
		this.handleType =  kPivotPoint | kDirectionPoint | kScaleDirectionPoint | kNumberPoint;
		//this.handleType =  kPivotPoint | kNumberPoint;
		break;
	}
	if (this.relativeFrame == kFirstMatrixIsIdentity)
		// We can't move the second symmetry
		this.handleType &= ~kPivotPoint;
}


SymmetryHandles.ishow = 1;
SymmetryHandles.itype1 = kSymmetryRotation;
SymmetryHandles.itype2 = kSymmetryNone;


SymmetryHandles.prototype.produce = function (system)
{
	// Get mouse info
	var ret = EnvironmentBrush.query (kBrushGetMouseInfo);
	
	drawModules |= this.index;
	
	if (!SymmetryHandles.ishow || !ret.buttondown || moduleUpdated)
	{
		this.selected = 0;
		return kCallAgain;
	}
	
	var frame = this.getFrame();

	if ((this.handleType & kPivotPoint) && (this.selected == 0 || this.selected == 1) &&
	    ((ret.mousepos - frame.position()).length() < 0.4 ||
		(ret.buttondown && this.selected == 1)))
	{
		//Engine.message ("mousepos = ", ret.mousepos.x, ", ", ret.mousepos.y);
		var diff = ret.mousepos - frame.position();
		this.frame.setPosition (ret.mousepos);
		this.setSymmetry()

		if(this.selected == 0)
			RenderAPI.command (kCommandNewGroup)

		drawModules = 0;
		this.selected = 1;
		
		// Force calling of render - disable incremental mode
		system.setParameter (kIncrementalRender, 0);
	}
	else if ((this.handleType & kAnglePoint) && (this.selected == 0 || this.selected == 2) &&
	          ((ret.mousepos - (frame.applyToPoint(this.anglePt))).length() < 0.35 || 
	           (ret.buttondown && this.selected == 2)) )
	{
		// Change number of symmetries
		var localPt = frame.toLocalCoords (ret.mousepos);
		var angle = Math.atan2 (localPt.x, localPt.y) * 180 / Math.PI;
		this.num = Math.floor (360 / angle + 0.5);
		if (this.num < 2)
			this.num = 2;
		else if (this.num > 100)
			this.num = 100;
		
		var frame2 = new Frame2 ();
		frame2.rotateDeg (360 / this.num);
		this.anglePt = frame2.applyToVector (new Vector2(0,3))
		this.setSymmetry()

		if(this.selected == 0)
			RenderAPI.command (kCommandNewGroup)

		drawModules = 0;
		this.selected = 2;
		
		// Force calling of render - disable incremental mode
		system.setParameter (kIncrementalRender, 0);
	}
	else if ((this.handleType & kNumberPoint) && (this.selected == 0 || this.selected == 4) &&
	          ((ret.mousepos - (frame.applyToPoint (this.numberPt))).length() < 0.35 || 
	           (ret.buttondown && this.selected == 4)))
	{
		// change angle of the frame
		var localPt = frame.toLocalCoords (ret.mousepos);
		//if (this.num > 1)
		//{
		//	var angle = Math.atan2 (localPt.x, localPt.y) * 180 / Math.PI;
		//	this.frame.rotateDeg (angle);
		//}

		this.num = Math.floor (localPt.length() / this.distance + 0.5)
		if (this.num < 1)
			this.num = 1;
		
		this.setSymmetry()

		if(this.selected == 0)
			RenderAPI.command (kCommandNewGroup)

		drawModules = 0;
		this.selected = 4;
		
		// Force calling of render - disable incremental mode
		system.setParameter (kIncrementalRender, 0);
	}
	else if ((this.handleType & kDirectionPoint) && (this.selected == 0 || this.selected == 3) &&
	          ((ret.mousepos - (frame.applyToPoint (this.directionPt))).length() < 0.35 || 
	           (ret.buttondown && this.selected == 3)))
	{
		// change angle of the frame
		var localPt = frame.toLocalCoords (ret.mousepos);
		var angle = Math.atan2 (localPt.x, localPt.y) * 180 / Math.PI;
		this.frame.rotateDeg (angle);
		
		if (this.handleType & kScaleDirectionPoint)
		{
			this.distance = localPt.length();
		}
		
		this.setSymmetry()

		if(this.selected == 0)
			RenderAPI.command (kCommandNewGroup)

		drawModules = 0;
		this.selected = 3;
		
		// Force calling of render - disable incremental mode
		system.setParameter (kIncrementalRender, 0);
	}
	else
	{
		this.selected = 0;
	}
	
	return kCallAgain
}

var zero = new Vector2(0,0);

SymmetryHandles.prototype.getFrame = function ()
{
	var frame = this.frame;
	
	if (this.previousHandle)
		frame = frame * this.previousHandle.frame;

	return frame;
}

// Define rotation arrow
var arrow = new Geometry
arrow.addBezier (new Vector2 (-0.3, 0.3), 
		     new Vector2 (-0.05, 0.4),
                 new Vector2 ( 0.05, 0.4),
                 new Vector2 ( 0.3, 0.3))
arrow.setColor (kStrokeColor, 0.2, 0.85, 0.2)
arrow.addLineStrip (new Vector2 (-0.3, 0.3), new Vector2 (-0.15, 0.48))
arrow.addLineStrip (new Vector2 (-0.3, 0.3), new Vector2 (-0.1, 0.235))
arrow.addLineStrip (new Vector2 ( 0.3, 0.3), new Vector2 ( 0.15, 0.48))
arrow.addLineStrip (new Vector2 ( 0.3, 0.3), new Vector2 ( 0.1, 0.235))
arrow.instantiate (RenderAPI);

// Define plus symbol
var plusSymbol = new Geometry
plusSymbol.setColor (kStrokeColor, 0.2, 0.85, 0.2)
plusSymbol.addLineStrip (new Vector2 (-0.22, 0), new Vector2 (0.22, 0))
plusSymbol.addLineStrip (new Vector2 (0, -0.22), new Vector2 (0, 0.22))
plusSymbol.instantiate (RenderAPI);

var radius1 = 0.22
var radius2 = 0.15

SymmetryHandles.prototype.render = function (api)
{
	RenderAPI.setParameter(kDecoInactiveHandle, 1);
	if (!SymmetryHandles.ishow)
	{
		RenderAPI.setParameter(kRenderID, 0);
		RenderAPI.setParameter(kRenderID, 1);
		RenderAPI.setParameter(kDecoInactiveHandle, 0);
		return kCallAgain
	}

	if ((this.index == 1? SymmetryHandles.itype1 : SymmetryHandles.itype2 ) != this.type)
		this.setSymmetry();
		
	api.Color (kStrokeColor, 0.2, 0.85, 0.2)
	// Render non-active areas first (everything but the circles)

	// Create a separate object by specifying user RenderID
	RenderAPI.setParameter(kRenderID, 0);
	if (this.handleType & kDirectionPoint)
	{
		api.Line (0, radius1, 0, this.directionPt.y - radius2)

		// Draw arrrows
		api.translateRel (0, this.directionPt.y)
		arrow.render (api)
		api.translateRel (0, -this.directionPt.y)
	}
	
	if (this.handleType & kAnglePoint)
	{
		api.Line (this.anglePt * (radius1 / 3), this.anglePt * (1 - radius2 / 3))

		// Plus symbol
		api.pushMatrix()
		api.translateRel (this.anglePt * 1.16)
		plusSymbol.render (api)
		api.popMatrix()
	}
	
	if (this.handleType & kNumberPoint)
	{
		api.Line (this.numberPt.x, 0, this.numberPt.x, this.numberPt.y - radius2)
		var i;
		for (i = 1; i < this.num; i++)
			api.Line (this.numberPt.x, i * this.distance,  this.numberPt.x + 0.2, i * this.distance);

		// Plus symbol
		api.pushMatrix()
		api.translateRel (this.numberPt.x, this.numberPt.y + 0.5)
		plusSymbol.render (api)
		api.popMatrix()
	}

	// Now draw the circles only
	// Create a separate object by specifying user RenderID
	RenderAPI.setParameter(kRenderID, 1);
	RenderAPI.setParameter(kDecoHandleFlag, 1);

	api.Color (kFillColor, 1, 1, 1)  // white fill (in the future we may query background color and set it here)

	if (this.handleType & kPivotPoint)
		api.Circle (zero, 0.22)
	
	if (this.handleType & kDirectionPoint)
		api.Circle (this.directionPt, 0.15)
	
	if (this.handleType & kAnglePoint)
		api.Circle (this.anglePt, 0.15)
	
	if (this.handleType & kNumberPoint)
		api.Circle (this.numberPt, 0.15)
	
	api.Color (kStrokeColor, 0, 0, 0)
	RenderAPI.setParameter(kDecoHandleFlag, 0);
	RenderAPI.setParameter(kDecoInactiveHandle, 0);
	
	Engine.setModuleParameter (this, kModuleProcessed, 1);  // so that it is drawn only once in a symmetry
	
	return kCallAgain
}