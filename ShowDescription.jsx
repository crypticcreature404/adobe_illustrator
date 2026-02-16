// Load the Adobe XMP library
if (ExternalObject.AdobeXMPScript == undefined) {
    ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
}

function getDocDescription() {
    if (app.documents.length === 0) {
        alert("No document open!");
        return;
    }

    var doc = app.activeDocument;
    var xmp = new XMPMeta(doc.XMPString);
    
    // The "Description" field is stored in the Dublin Core (dc) namespace
    var description = xmp.getLocalizedText(XMPConst.NS_DC, "description", null, "en");

    if (description) {
        alert("Document Description:\n\n" + description);
    } else {
        alert("No description found in File Info.");
    }
}

getDocDescription();
