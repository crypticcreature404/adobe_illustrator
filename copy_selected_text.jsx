(function () {
	// Force Illustrator to pay attention to script UI changes
	app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;

	if (app.documents.length === 0) return;
	var doc = app.activeDocument;
	var selection = doc.selection;
	var textItems = [];

	for (var i = 0; i < selection.length; i++) {
		if (selection[i].typename === "TextFrame") {
			textItems.push(selection[i]);
		}
	}

	if (textItems.length === 0) return;

	// 1. Sort Top to Bottom, then Left to Right
	textItems.sort(function (a, b) {
		// If the vertical positions are the same (or very close)
		if (Math.abs(b.top - a.top) < 1) {
			return a.left - b.left; // Sort Left to Right
		}
		// Otherwise, sort by Top to Bottom
		return b.top - a.top;
	});

	var bucket01 = [],
		bucket02 = [],
		bucket03 = [];

	// 2. Process and Categorize
	for (var j = 0; j < textItems.length; j++) {
		var content = textItems[j].contents.replace(/^\s+|\s+$/g, "");
		if (content === "") continue;

		var cleaned = content.replace(/\([A-Z]{2}\)/g, "/ ");

		if (
			cleaned.indexOf("/") !== -1 ||
			cleaned.indexOf("COLLAR") !== -1 ||
			cleaned.indexOf(" COLAR") !== -1 ||
			cleaned.indexOf(" SEAM") !== -1 ||
			cleaned.indexOf("” W") !== -1
		) {
			bucket01.push(cleaned);
		} else if (
			cleaned.indexOf("QQ") === 0 ||
			cleaned.indexOf("PP") === 0 ||
			cleaned.indexOf("EE") === 0 ||
			cleaned.indexOf("FF") === 0 ||
			cleaned.indexOf("GG") === 0 ||
			cleaned.indexOf("HH") === 0 ||
			cleaned.indexOf("PWHL") === 0 ||
			cleaned.indexOf("NWSL") === 0 ||
			cleaned.indexOf("MLB") === 0 ||
			cleaned.indexOf("MLS") === 0 ||
			cleaned.indexOf("NN") === 0 ||
			cleaned.indexOf("NHL") === 0 ||
			cleaned.indexOf("NBA") === 0 ||
			cleaned.indexOf("SCREENS") !== -1
		) {
			bucket02.push(cleaned);
		} else {
			bucket03.push("BASE");
			bucket03.push("BARRIER");
			bucket03.push(cleaned);
		}
	}

	// Sort Bucket 01 based on your specific priority
	bucket01.sort(function (a, b) {
		function getRank(str) {
			if (str.indexOf("/") !== -1) return 1;
			if (str.indexOf("COLLAR") !== -1) return 2;
			if (str.indexOf('" W') !== -1) return 3;
			return 4; // Fallback for anything else
		}
		return getRank(a) - getRank(b);
	});

	// 3. Create Temp Layer with a Redraw Force
	var tempLayer = doc.layers.add();
	app.redraw(); // This ensures the layer is "real" before adding frames

	function createFormattedFrame(contentArray, xOffset) {
		if (contentArray.length === 0) return null;
		var f = tempLayer.textFrames.add();
		f.contents = contentArray.join("\r");
		f.left = xOffset;
		try {
			f.textRange.characterAttributes.textFont =
				app.textFonts.getByName("NewsGothicBT-Bold");
			f.textRange.characterAttributes.size = 13;
		} catch (e) {}
		return f;
	}

	var bucket01String = bucket01.join("\r");
	// Replace only the FIRST instance of \r with a space (or "" for no space)
	bucket01String = bucket01String.replace(/\r/, " ");

	var tf01 = createFormattedFrame(bucket01, 0);
	tf01.contents = bucket01String;

	var tf02 = createFormattedFrame(bucket02, 262);
	var tf03 = createFormattedFrame(bucket03, 382);

	//Define the Color Red (RGB)
	var redColor = new RGBColor();
	redColor.red = 255;
	redColor.green = 255;
	redColor.blue = 255;

	//Define the Color Blue (RGB)
	var blueColor = new RGBColor();
	blueColor.red = 255;
	blueColor.green = 255;
	blueColor.blue = 255;

	// 2. Target the first paragraph of bucket 03
	if (bucket03.length > 0 && tf03) {
		// textRange.paragraphs[0] targets everything up to the first \r
		tf03.textRange.paragraphs[0].characterAttributes.fillColor = redColor;

		tf03.textRange.paragraphs[1].characterAttributes.fillColor = blueColor;
	}

	// 4. Force Selection and Redraw for Clipboard
	app.selection = null;
	if (tf01) tf01.selected = true;
	if (tf02) tf02.selected = true;
	if (tf03) tf03.selected = true;

	app.redraw(); // Essential for Actions to "see" the selection
	app.executeMenuCommand("copy");

	// 5. Cleanup
	tempLayer.remove();
	for (var k = 0; k < selection.length; k++) {
		selection[k].selected = true;
	}

	alert("Copy Complete");
})();
