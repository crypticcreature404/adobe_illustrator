/**
 * TextCapture — CAPTURE SCRIPT
 * ─────────────────────────────
 * 1. Select a text object on your artboard.
 * 2. Run this script (File > Scripts > TextCapture_Capture).
 * 3. Choose which field slot (1, 2, or 3) to save it into.
 *
 * Pair with TextCapture_Copy.jsx to retrieve and copy saved text.
 */

(function () {

    var STORAGE_PATH = Folder.temp + "/TextCaptureData.json";

    // ── Get selected text ─────────────────────────────────────────────────────
    function getSelectedText() {
        try {
            var sel = app.activeDocument.selection;
            if (!sel || sel.length === 0) return null;
            var item = sel[0];
            if (item.typename === "TextFrame") return item.contents;
            return null;
        } catch (e) { return null; }
    }

    // ── Load saved data ───────────────────────────────────────────────────────
    function loadData() {
        var defaults = { fields: ["", "", ""], labels: ["Field 1", "Field 2", "Field 3"] };
        try {
            var f = new File(STORAGE_PATH);
            if (!f.exists) return defaults;
            f.open("r");
            var raw = f.read();
            f.close();
            var data = eval("(" + raw + ")");
            return data;
        } catch (e) { return defaults; }
    }

    // ── Save data ─────────────────────────────────────────────────────────────
    function saveData(data) {
        try {
            var f = new File(STORAGE_PATH);
            f.open("w");
            f.write(JSON.stringify(data));
            f.close();
        } catch (e) {
            alert("Could not save data: " + e.message);
        }
    }

    // ── Main ──────────────────────────────────────────────────────────────────
    var txt = getSelectedText();

    if (txt === null) {
        alert("No text frame selected.\n\nPlease click a text object on your artboard first, then run this script.");
        return;
    }

    if (txt === "") {
        alert("The selected text frame is empty.");
        return;
    }

    // Trim for display
    var preview = txt.length > 60 ? txt.substring(0, 57) + "..." : txt;

    // Ask which slot
    var data = loadData();

    var win = new Window("dialog", "Save to Field");
    win.orientation   = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing       = 10;
    win.margins       = [16, 16, 16, 16];

    win.add("statictext", undefined, "Captured text:");
    var previewBox = win.add("edittext", undefined, preview, { readonly: true, multiline: false });
    previewBox.preferredSize = [320, 26];

    win.add("statictext", undefined, "Save into which field?");

    var slotGroup = win.add("group");
    slotGroup.orientation = "row";
    slotGroup.spacing = 8;

    for (var i = 0; i < 3; i++) {
        (function (idx) {
            var label = data.fields[idx] !== ""
                ? (idx + 1) + "  [" + (data.fields[idx].length > 18 ? data.fields[idx].substring(0, 15) + "..." : data.fields[idx]) + "]"
                : (idx + 1) + "  (empty)";
            var slotBtn = slotGroup.add("button", undefined, label);
            slotBtn.preferredSize = [110, 34];
            slotBtn.onClick = function () {
                data.fields[idx] = txt;
                saveData(data);
                win.close();
                alert("Saved into Field " + (idx + 1) + ".\n\nRun TextCapture_Copy to copy any field to clipboard.");
            };
        }(i));
    }

    var cancelBtn = win.add("button", undefined, "Cancel");
    cancelBtn.onClick = function () { win.close(); };

    win.center();
    win.show();

}());
