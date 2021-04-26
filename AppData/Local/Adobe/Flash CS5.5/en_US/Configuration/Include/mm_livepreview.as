// mm_livepreview.as
// Copyright 2003, Macromedia Inc.
// All Rights Reserved

Stage.align = "TL";
Stage.scaleMode = "noScale";
listen = new Object();
Stage.addListener(listen);

_global.isLivePreview = true;

listen.onResize = function()
{
	// [ggrossman 08.18.03] Only listen to this notification
	// when not in "multi" mode
	if (typeof(_root.instanceID) == "undefined") {
		contents.obj.setSize(Stage.width,Stage.height);
	}
}

function onLoad()
{
	// [ggrossman 08.18.03] Only listen to this notification
	// when not in "multi" mode
	if (typeof(_root.instanceID) == "undefined") {
		contents.obj.setSize(Stage.width,Stage.height);
	}
}

// parser for flashlet parameters
//
// syntax:
// object {a:1,b:2,c:3}
// array [1,2,3]
// string "hello"
// number 27.3
// boolean true/false
// color #FFFFFF
//
// example:
// {name:"gary",age:28,active:true,data:[1,2,3]}

function nextChar()
{
	return str.charAt(strIndex);
}

function isSpace(ch)
{
	return ch == ' ' || ch == '\x09' || ch == '\x0D' || ch == '\x0A';
}

function trimSpaces(s)
{
	var i, j;
	for (i=0; i<s.length; i++) {
		if (!isSpace(s.charAt(i))) {
			break;
		}
	}
	for (j=s.length; j>0; ) {
		if (!isSpace(s.charAt(j-1))) {
			break;
		}
	}
	return s.substring(i, j);
}

function skipSpaces()
{
	var ch;
	while (isSpace(nextChar())) {
		strIndex++;
	}
}

function parseArray()
{
	var arr = [];

	skipSpaces();
	if (nextChar() == ']') {
		strIndex++;
		return arr;
	}

	while (true) {
		skipSpaces();
		var value = parse();
		arr.push(value);
		skipSpaces();
		var ch = nextChar();
		if (ch == ']') {
			strIndex++;
			break;
		}
		if (ch != ',') {
			break;
		}
		strIndex++;
	}

	return arr;
}

function parseObject()
{
	var obj = {};

	skipSpaces();

	var ch = nextChar();
	if (ch == undefined) {
		return obj;
	}
	if (ch == '}') {
		strIndex++;
		return obj;
	}

	while (true) {
		skipSpaces();
		var index = str.indexOf(':', strIndex);
		if (index == -1) {
			break;
		}
		var vkey = str.substring(strIndex, index);
		strIndex = index+1;
		var value = parse();
		obj[vkey] = value;
		skipSpaces();
		var ch = nextChar();
		if (ch == '}') {
			strIndex++;
			break;
		}
		if (ch != ',') {
			break;
		}
		strIndex++;
	}
	return obj;
}

function parseString()
{
	var result = "";

	// Concatenate runs separated by \'
	var index;
	while ((index = str.indexOf('\'', strIndex)) != -1) {
		if (str.charAt(index-1) == '\\') {
			result += str.substring(strIndex, index-1);
			result += '\'';
			strIndex = index+1;
		} else {
			break;
		}
	}
	result += str.substring(strIndex, index);
	strIndex = index+1;

	return result;
}

function parse()
{
	skipSpaces();

	var ch = nextChar();
	if (ch == '{') {
		strIndex++;
		return parseObject();
	}
	if (ch == '[') {
		strIndex++;
		return parseArray();
	}
	if (ch == '\'') {
		strIndex++;
		return parseString();
	}
	// Seek to next delimiter
	var index = strIndex;
	while (true) {
		ch = str.charAt(index);
		if (ch == undefined || ch == '}' || ch == ']' || ch == ',') {
			break;
		}
		index++;
	}
	var term = trimSpaces(str.substring(strIndex, index));
	strIndex = index;

	// see if this is a color value
	if (term.charAt(0) == '#' && term.length == 7){
		term = '0x' + term.substring(1, 7);
	}

	if (term == "true") {
		return true;
	}
	if (term == "false") {
		return false;
	}

	return Number(term);
}

function onSizeMulti()
{
	// Resize the specified component
	var instanceName = "instance" + _root.instanceID;
	var mc = contents[instanceName];
	_root.instanceWidth  = Number(_root.instanceWidth);
	_root.instanceHeight = Number(_root.instanceHeight);	
	if (mc.width  != _root.instanceWidth ||
		mc.height != _root.instanceHeight)
	{
		mc.setSize(_root.instanceWidth, _root.instanceHeight);
		
		if (typeof(mc._livePreviewMask) == "undefined")
		{
			mc._livePreviewMask = _root.createEmptyMovieClip("_livePreviewMask" + instanceID, 1);
			mc.setMask(mc._livePreviewMask);
		}
		mc._livePreviewMask.clear();
		mc._livePreviewMask.beginFill(0, 100);
		mc._livePreviewMask.moveTo(0, 0);
		mc._livePreviewMask.lineTo(_root.instanceWidth, 0);		
		mc._livePreviewMask.lineTo(_root.instanceWidth, _root.instanceHeight);		
		mc._livePreviewMask.lineTo(0, _root.instanceHeight);		
		mc._livePreviewMask.lineTo(0, 0);
		mc._livePreviewMask.endFill();
		mc._visible = true;
		mc._x = 0;
		mc._y = 0;
	}
}

function onDrawMulti()
{
	// Do something only if the visible component changed
	if (_root.visibleID != _root.instanceID) {
		// Make sure the master component is invisible
		contents.obj._visible = false;


		// Make the previously drawn component invisible
		if (typeof(_root.visibleID) != "undefined") {
			contents["instance" + _root.visibleID]._visible = false;
		}

		// Make this component visible	
		contents["instance" + _root.instanceID]._visible = true;
		_root.visibleID = _root.instanceID;
	}
}

function onUpdateMulti()
{
	var instanceName = "instance" + _root.instanceID;

	// Create this instance if needed.	
	if (!contents[instanceName]) {
		// Copy the parameters
		var initObj = {};
		for (var i in xch)
		{
			// clip off def_
			var s = String(i);
			if (s.indexOf("def_", 0) == 0)
			{
				s = s.substring(4);
			}
			initObj[s] = xch[i];
		}
		contents.obj.duplicateMovieClip(instanceName,
										_root.instanceID+100,
										initObj);
		contents[instanceName]._visible = false;
	} else {
		var mc = contents[instanceName];
		
		// Copy the parameters
		for (var i in xch)
		{
			// clip off def_
			var s = String(i);
			if (s.indexOf("def_", 0) == 0)
			{
				s = s.substring(4);
			}
			mc[s] = xch[i];
		}

		// If we are a Dreamweaver Flashlet,
		// parse the parameters passed to us from the
		// HTML page and populate the component
		// parameters.
		if (_root.flashlet)
		{
			str = unescape(_root.flashlet);
			strIndex = 0;
			var obj = parse();
			for (var name in obj) {
				mc[name] = obj[name];
			}
		}

		mc.onUpdate();
	}	
}

function onUpdate()
{
	// If the global variable "instanceID" is set, then
	// we are in "multi-preview" mode.
	if (typeof(_root.instanceID) != "undefined") {
		return onUpdateMulti();
	}
	
	for (var i in xch)
	{
		// clip off def_
		var s = String(i);
		if (s.indexOf("def_", 0) == 0)
		{
			s = s.substring(4);
		}
		contents.obj[s] = xch[i];
	}
	
	// If we are a Dreamweaver Flashlet,
	// parse the parameters passed to us from the
	// HTML page and populate the component
	// parameters.
	if (_root.flashlet)
	{
		str = unescape(_root.flashlet);
		strIndex = 0;
		var obj = parse();
		for (var name in obj) {
			contents.obj[name] = obj[name];
		}
	}

	contents.obj.onUpdate();
}

// Force call to onUpdate so that parameters
// are copied, when used as a Dreamweaver
// Flashlet
if (_root.flashlet)
{
	onUpdate();
}



