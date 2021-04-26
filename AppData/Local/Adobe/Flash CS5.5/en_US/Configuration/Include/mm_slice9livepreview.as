// mm_livepreview.as
// Copyright 2006, Adobe Systems, Inc.
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
		if (contents.obj._width == "undefined" || contents.obj._height == "undefined") {
			contents.obj.setSize(Stage.width,Stage.height);
		} else {
			contents.obj._width = Stage.width;
			contents.obj._height = Stage.height;
		}
	}
}
