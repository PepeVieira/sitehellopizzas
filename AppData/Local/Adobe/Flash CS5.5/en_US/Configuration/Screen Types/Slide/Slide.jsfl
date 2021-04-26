//------------------------------------------------------------------------------------------------
//
// Slide.jsfl version 1.1
//
// copyright Macromedia, Inc.  2003
//
//
//
//------------------------------------------------------------------------------------------------


// This default Macromedia function is called when a screen is inserted
function MM_InvokeType(message, userString, argString)
{

	if (message == "ScreenType.InsertUserAction" || message == "ScreenType.InsertProgrammatic")
	{
		var screenOutline = fl.getDocumentDOM().screenOutline;

		// if a screen doesn't already exist, insert the master screen
		var screenName = "";
		if (screenOutline.screens.length == 0)
		{
			screenName = "presentation";

			// insert the class symbols, create them if it doesn't exist
			createClassSymbol("Form");
			createClassSymbol("Slide");
			createClassSymbol("Screen");
		}

		// insert the default screen
		var newScreen = screenOutline.insertScreen(screenName);
		newScreen.hidden = true;

		// insert the class symbol, create if it doesn't exist
		createClassSymbol("Slide");

		return true; // must return true

	} else if (message == "ScreenType.InsertUserActionNested" || message == "ScreenType.InsertProgrammaticNested")
	{
		var screenOutline = fl.getDocumentDOM().screenOutline;

		// insert the default nested screen
		var newScreen = screenOutline.insertNestedScreen("");
		newScreen.hidden = true;

		// insert the class symbol, create if it doesn't exist
		createClassSymbol("Slide");

		return true; // must return true

	} else if (message == "ScreenType.PreUserAction" || message == "ScreenType.PostUserAction")
	{
		return true; // let all of these messages go through

	} else if (message == "ScreenType.UserInvoke")
	{
		// this is where wizards get displayed if need be
	} else if (message == "ScreenType.ScreenOutlineModify")
	{
		return true;
		// return "Sorry, can't " + userString + " right now.";
	}

	return false; // nothing handled
}

function createClassSymbol(linkageName)
{
	if (!fl.getDocumentDOM().library.itemExists(linkageName))
	{
		fl.getDocumentDOM().library.addNewItem("screen" , linkageName);

		// set up the right export linkages
		fl.getDocumentDOM().library.selectItem(linkageName, true);
		var items = fl.getDocumentDOM().library.getSelectedItems();
		var item = items[0];

		item.linkageExportForAS = true;
		item.linkageClassName = "mx.screens." + linkageName;
		item.linkageIdentifier = linkageName;
		item.linkageExportInFirstFrame = true;
	}
}
