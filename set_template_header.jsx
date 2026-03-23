(function () {
	if (app.documents.length === 0) return;

	var doc = app.activeDocument;

	// --- NEW: Update Metadata Title to Match Filename ---
	if (ExternalObject.AdobeXMPScript == undefined) {
		ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
	}
	var xmp = new XMPMeta(doc.XMPString);
	var fileName = doc.name.replace(/\.[^\.]+$/, ""); // Strip extension

	xmp.deleteProperty(XMPConst.NS_DC, "title");
	xmp.setLocalizedText(XMPConst.NS_DC, "title", null, "x-default", fileName);
	doc.XMPString = xmp.serialize();
	// ----------------------------------------------------

	if (app.selection.length === 0) return;
	var sel = doc.selection;

	// 1. Coordinates in Inches
	var targetX_Inches = 5.6533;
	var targetY_Inches = -0.1068;

	// 2. Convert to Points
	var targetX = targetX_Inches * 72;
	var targetY = targetY_Inches * 72;

	// 3. Create a New Group
	var newGroup = doc.groupItems.add();
	newGroup.name = "Temp_Movement_Group";

	// 4. Move selected items into the group
	for (var i = sel.length - 1; i >= 0; i--) {
		sel[i].move(newGroup, ElementPlacement.PLACEATBEGINNING);
	}

	// 5. Move the Group to the specific X and Y
	newGroup.left = targetX;
	newGroup.top = targetY;

	// 6. Optional: Ungroup
	// app.executeMenuCommand("ungroup");
})();
