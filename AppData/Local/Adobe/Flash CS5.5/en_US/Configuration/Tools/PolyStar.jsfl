

var nSides = 5;
var pointParam = 0.5;
var style = "polygon";
var thePolygon = new Array;
var didDrag = false;
var startPt = new Object;


// the values for polygonStyle
var	POLYGON		= "polygon";
var STAR		= "star";


function configureTool()
{
	theTool = fl.tools.activeTool;
	theTool.setToolName("polystar");
	theTool.setIcon("PolyStar.png");
	theTool.setMenuString("PolyStar Tool");
	theTool.setToolTip("PolyStar Tool");
	theTool.setOptionsFile( "PolyStar.xml" );

	///////////////////////////////////////////
	// shape PI
	theTool.setPI( "shape" );
}


function notifySettingsChanged()
{
	theTool = fl.tools.activeTool;

	nSides     = theTool.nsides;
	pointParam = theTool.pointParam;
	style      = theTool.style;
}


function setCursor()
{
	fl.tools.setCursor( 0 );
}



function activate()
{
	var theTool = fl.tools.activeTool
}


function deactivate()
{
}

function mouseDown()
{
	// start drawing of object
	fl.drawingLayer.beginDraw();

	// set the flag if the cursor mouves "enough"
	didDrag = false;

	startPt = fl.tools.snapPoint( fl.tools.penDownLoc );

}


function buildPolygonObj( pt1,  pt2,  thePolygon )
{
	// calculate the center point
	var ctr = new Object;
	ctr.x = pt1.x;
	ctr.y = pt1.y;

	// calculate the radius
	var rad = fl.Math.pointDistance(pt1, pt2);

	// find the angle between points
	var doStar = (style == STAR);
	var dTheta = 2.0*Math.PI/nSides;

	var param = pointParam;
	if (param < 0.1)  param = 0.1;
	if (param > 0.9)  param = 0.9;

	// make a copy of the unit curve
	var x = pt2.x - pt1.x;
	var y = pt2.y - pt1.y;
	var cs = Math.cos(dTheta);
	var sn = Math.sin(dTheta);
	thePolygon[0] = x;
	thePolygon[1] = y;
	var index = 2;
	for (var i=0;  i<nSides;  i++)
	{
		// rotate the point
		var xtmp,  ytmp;
		if (i == (nSides-1))
		{
			xtmp = thePolygon[0];
			ytmp = thePolygon[1];
		}
		else
		{
			xtmp = x*cs - y*sn;
			ytmp = x*sn + y*cs;
		}

		// add the star point if required
		if (doStar)
		{
			thePolygon[index]	= param*0.5*(xtmp + x)
			thePolygon[index+1]	= param*0.5*(ytmp + y)
			index += 2;
		}

		// update x and y to the new values
		x = xtmp;
		y = ytmp;

		// offset to the center
		thePolygon[index]	= xtmp;
		thePolygon[index+1]	= ytmp;
		index += 2;
	}

	// adjust the length of the array
	thePolygon.length = index;

	// offset to the center
	for (var i=0;  i<thePolygon.length;  i += 2)
	{
		thePolygon[i  ] +=  ctr.x;
		thePolygon[i+1] +=  ctr.y;
	}

	return;
}


function transformPoint( pt,  mat )
{
	var x = pt.x*mat.a + pt.y*mat.c + mat.tx;
	var y = pt.x*mat.b + pt.y*mat.d + mat.ty;

	pt.x = x;
	pt.y = y;

	return;
}


function drawPolygonObj( thePolygon )
{
	if (thePolygon.length != 0)
	{
		var tmpPt  = new Object;
		var tmpPt2 = new Object;
		tmpPt.x = thePolygon[0];
		tmpPt.y = thePolygon[1];

		var viewMat = fl.getDocumentDOM().viewMatrix;
		transformPoint(tmpPt,  viewMat);
		fl.drawingLayer.moveTo( tmpPt.x,  tmpPt.y );

		// all the segments are quadratic
		var index = 3;
		while (index < thePolygon.length)
		{
			// transform to document space
			tmpPt.x  = thePolygon[index-1];
			tmpPt.y  = thePolygon[index];
			transformPoint(tmpPt,  viewMat);

			fl.drawingLayer.lineTo(tmpPt.x,  tmpPt.y,  tmpPt2.x,  tmpPt2.y);
			index += 2;
		}
	}
}


function mouseMove(mouseLoc)
{
	// only calculate an object if user drags the mouse
	if (fl.tools.mouseIsDown)
	{
		// check how much the mouse has moved since the pen went down
		var pt1 = startPt;
		var pt2 = fl.tools.snapPoint( mouseLoc );
		var dx = pt1.x - pt2.x;
		var dy = pt1.y - pt2.y;
		if (dx < 0)  dx = -dx;
		if (dy < 0)  dy = -dy;

		// constrain with the shift key
		if (fl.tools.shiftIsDown)
		{
			var radSq  = dx*dx + dy*dy;
			var rad    = radSq > 0.01 ? Math.sqrt( radSq ) : 0.0;

			var dTheta = Math.PI/nSides;
			var angle  = Math.PI/2.0;

			// put a point near the cursor
			if (Math.abs(dx) > Math.abs(dy))
			{
				if (pt2.x < pt1.x)
					angle += Math.PI/2.0;
				else
					angle -= Math.PI/2.0;
			}
			else
			{
				if (pt2.y < pt1.y)
					angle = -angle;
			}

			pt2.x = pt1.x + rad*Math.cos( angle );
			pt2.y = pt1.y + rad*Math.sin( angle );
		}

		if ((dx > 2) || (dy > 2))
		{
			didDrag = true;

			// build the Bezier curves for the curve
			buildPolygonObj(pt1,  pt2,  thePolygon);
			fl.drawingLayer.beginFrame();
			drawPolygonObj( thePolygon );

			// send points information to flash so that it can update Panel
			var ptArray = new Array;
			var j = 0;
			var i = 0;
			while (i < thePolygon.length){
				ptArray[j] = {x:(thePolygon[i]) , y:(thePolygon[i+1])};
				i +=2;
				j++;
			}
			fl.tools.setCreatingBbox( ptArray );

			fl.drawingLayer.endFrame();
		}
	}
}


function polygonToPath( thePolygon )
{
	// allocate a path
	var path = fl.drawingLayer.newPath();

	// add the segments
	path.addPoint(thePolygon[0],  thePolygon[1]);
	var index = 3;
	while (index < thePolygon.length)
	{
		path.addPoint( thePolygon[index-1],  thePolygon[index] );
		index += 2;
	}

	return path;
}

function mouseUp()
{
	// end the drawing
	fl.drawingLayer.endDraw();

	if (didDrag)
	{
		// now create the real geometry based on user movements!
		var path = polygonToPath( thePolygon );

		path.makeShape();
	}
}
