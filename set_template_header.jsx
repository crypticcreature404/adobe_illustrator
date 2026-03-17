(function () {
	if (app.documents.length === 0 || app.selection.length === 0) return;

	var doc = app.activeDocument;
	var sel = doc.selection;

	// 1. Coordinates in Inches
	var targetX_Inches = 5.6533;
	var targetY_Inches = -0.1068;

	// 2. Convert to Points (Illustrator's native unit)
	var targetX = targetX_Inches * 72;
	var targetY = targetY_Inches * 72;

	// 3. Create a New Group
	var newGroup = doc.groupItems.add();
	newGroup.name = "Temp_Movement_Group";

	// 4. Move selected items into the group
	// We loop backwards because moving items changes the selection index
	for (var i = sel.length - 1; i >= 0; i--) {
		sel[i].move(newGroup, ElementPlacement.PLACEATBEGINNING);
	}

	// 5. Move the Group to the specific X and Y
	newGroup.left = targetX;
	newGroup.top = targetY;

	// 6. Optional: Ungroup the items after moving
	// If you want them to stay grouped, comment out the line below
	// app.executeMenuCommand("ungroup");
})();
