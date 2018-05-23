const POSTUSER_URL = "http://localhost:8080/user";
const USERLOGIN_URL = "http://localhost:8080//api/auth/login";

const PHOTO_BOOTH_TEMPLATE_DATA = {
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
        `<form>
            <fieldset>
            <legend>Login To Your Event</legend>
            <label for="email">Email</label>
            <input class="js-userName" email="email" type="text" placeholder="Email"/>
            <label for="password">Password</label>
            <input class="js-password" name="password" type="text" placeholder="Password"/> 
            <button type="submit" value="submit">Submit</button>
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
    watchSubmit();
}


function loginEndpoint(username, password, callback) {
    const settings = {
        url: `${USERLOGIN_URL}`,
        datatype: 'json',
        type: 'GET',
        success: callback, 
        error: function(err) {
            console.log('Input Error');
        },
    };
    $.ajax(settings);
    console.log(settings);
}


function displayDataFromLoginApi(data) {
    console.log("add user function works");
}

function watchSubmit() {
    $('.js-container').submit(event => {
        event.preventDefault();
        console.log('submit button works');
        $('.js-userName').empty();
        $('.js-password').empty();
        const userName = $('.js-userName').val();
        const password = $('.js-password').val();
        console.log(userName, password);
        loginEndpoint(userName, password, displayDataFromLoginApi)
    });
}