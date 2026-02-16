/**
 * copy_all_text.jsx
 * 
 * This script collects the contents of all text frames in the active Illustrator document,
 * combines them into a single string with line returns, and copies the resulting string
 * to the system clipboard.
 */

// Function to copy text to the clipboard in Illustrator
function copyTextToClipboard(text) {
    // A common workaround for copying to the clipboard in Illustrator scripts
    // is to create a temporary text frame, select its contents, and use app.copy().
    
    // Ensure a document is open
    if (app.documents.length === 0) {
        alert("Please open a document first.");
        return;
    }

    var doc = app.activeDocument;
    
    // Create a temporary text frame
    var tempTextFrame = doc.textFrames.add();
    tempTextFrame.contents = text;
    
    // Clear current selection and select the temporary text frame
    app.selection = null;
    tempTextFrame.selected = true;
    
    // Execute the copy command
    app.copy();
    
    // Remove the temporary text frame
    tempTextFrame.remove();
    
    // Optional: Alert the user that the text has been copied
    // alert("All text has been copied to the clipboard.");
}

// Main function to collect all text frames
function collectAndCopyAllText() {
    if (app.documents.length === 0) {
        alert("Please open a document first.");
        return;
    }

    var doc = app.activeDocument;
    var allTextFrames = doc.textFrames;
    var combinedText = "";

    // Loop through all text frames and append their contents
    for (var i = 0; i < allTextFrames.length; i++) {
        // Append contents and a line return character
        combinedText += allTextFrames[i].contents + "\r"; // Use "\r" for cross-platform line return
    }

    if (combinedText.length > 0) {
        // Remove the trailing line return for cleaner output
        combinedText = combinedText.slice(0, -1); 
        copyTextToClipboard(combinedText);
        alert("Successfully copied " + allTextFrames.length + " text frames to the clipboard.");
    } else {
        alert("No text frames found in the document.");
    }
}

// Run the main function
collectAndCopyAllText();
