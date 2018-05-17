PHOTO_BOOTH_TEMPLATE_DATA = {
    "stripTemplates":[
    {
        "template_name":"flowers",
        "image":"image data from base 64?",
        "tags":["christmas", "new years eve", "mitzvah", "wedding"],
        "orientation": "vertical",
        "images": "4"
    },
    
    {
        "templateName":"Fancy and Fun",
        "image":"image data from base 64?",
        "tags":["christmas", "new years eve", "mitzvah", "wedding"],
        "orientation": "vertical",
        "images": "4"
    }]
}


function getTemplateData(callbackFn) {

	setTimeout(function(){callbackFn(PHOTO_BOOTH_TEMPLATE_DATA)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayTemplateSelections(data) {
    console.log("this works")
    for (let i = 0; i < data.stripTemplates.length; i++) {
        console.log("inside")
	   $('body').append(
        '<p>' + data.stripTemplates[i].image + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayTemplateInfo() {
	getTemplateData(displayTemplateSelections);
}

//Page Load
$(function() {
	getAndDisplayTemplateInfo();
})