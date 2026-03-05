/**
 * TextCapture — COPY SCRIPT
 * ──────────────────────────
 * Run this script to see your 3 saved text fields.
 * Click any field button to copy that text to your clipboard.
 *
 * Pair with TextCapture_Capture.jsx to save text from your artboard.
 */

(function () {

    var STORAGE_PATH = Folder.temp + "/TextCaptureData.json";

    // ── Load saved data ───────────────────────────────────────────────────────
    function loadData() {
        var defaults = { fields: ["", "", ""], labels: ["Field 1", "Field 2", "Field 3"] };
        try {
            var f = new File(STORAGE_PATH);
            if (!f.exists) return defaults;
            f.open("r");
            var raw = f.read();
            f.close();
            return eval("(" + raw + ")");
        } catch (e) { return defaults; }
    }

    // ── Copy to clipboard via temp doc ────────────────────────────────────────
    function copyToClipboard(str) {
        try {
            var origDoc = null;
            try { origDoc = app.activeDocument; } catch(e) {}

            var tempDoc  = app.documents.add(DocumentColorSpace.RGB, 1, 1);
            var tempText = tempDoc.textFrames.add();
            tempText.contents = str;
            tempDoc.selection = [tempText];
            app.copy();
            tempDoc.close(SaveOptions.DONOTSAVECHANGES);

            if (origDoc) { try { origDoc.activate(); } catch(e) {} }
            return true;
        } catch (e) {
            alert("Clipboard error: " + e.message);
            return false;
        }
    }

    // ── Main ──────────────────────────────────────────────────────────────────
    var data = loadData();

    var win = new Window("dialog", "TextCapture — Copy to Clipboard");
    win.orientation   = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing       = 10;
    win.margins       = [16, 16, 16, 16];

    win.add("statictext", undefined, "Click a field to copy its text to clipboard:");

    win.add("panel", undefined, "");

    var copied = false;

    for (var i = 0; i < 3; i++) {
        (function (idx) {
            var row = win.add("group");
            row.orientation   = "row";
            row.alignChildren = ["left", "center"];
            row.spacing       = 8;

            var numLabel = row.add("statictext", undefined, "Field " + (idx + 1) + ":");
            numLabel.preferredSize = [48, 24];

            var val = data.fields[idx];
            var displayText = val !== "" ? val : "(empty)";
            var fld = row.add("edittext", undefined, displayText, { readonly: true });
            fld.preferredSize = [220, 26];

            var copyBtn = row.add("button", undefined, "Copy");
            copyBtn.preferredSize = [54, 26];
            copyBtn.enabled = (val !== "");
            copyBtn.onClick = function () {
                var ok = copyToClipboard(val);
                if (ok) {
                    alert("Copied to clipboard:\n\n" + val);
                    win.close();
                }
            };
        }(i));
    }

    win.add("panel", undefined, "");

    var closeBtn = win.add("button", undefined, "Close");
    closeBtn.onClick = function () { win.close(); };

    win.center();
    win.show();

}());
