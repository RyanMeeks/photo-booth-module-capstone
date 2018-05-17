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

//----->START callback for photobooth data
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
//--->END Callback for Photo Booth Data

//Page Load
//$(getAndDisplayTemplateInfo)
$(userLogin)

function userLogin() {
    $('.js-container').html(
            `<form accept-charset="UTF-8" action="action_page.php" autocomplete="off" method="GET" target="_blank">
            <fieldset>
            <legend>Login To Your Event</legend>
            <label for="email">Email</label>
            <input email="email" type="text" placeholder="Email"/>
            <label for="password">Password</label>
            <input name="password" type="text" placeholder="Password"/> 
            <button type="submit" value="Submit">Submit</button>
            </fieldset>
            <div class="login-footer">
                <div class="js-signUp">
                    <p>New User</p>
                </div>
                <div class="forgotPassword">
                    <p>Forgot Password</p>
                </div>
            </div>
        </form>`
        )
}
