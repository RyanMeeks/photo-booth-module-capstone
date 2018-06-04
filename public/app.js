const USERLOGIN_URL = "/api/auth/login";
const USERSIGNUP_URL = "/api/users";
let authToken;

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
        `<form id="js-loginForm">
            <fieldset>
            <legend>Login To Your Event</legend>
            <label for="email">Email</label>
            <input id="js-userNameLogin" email="email" type="text" placeholder="Email"/>
            <label for="password">Password</label>
            <input id="js-passwordLogin" name="password" type="text" placeholder="Password"/> 
            <button type="submit" value="submit">Submit</button>
            </fieldset>
            <div class="login-footer">
                <div class="js-signUp">
                    <p>New User</p>
                </div>
            </div>
        </form>`
        );
    watchSubmit();
    watchSignUpClick();
}


function loginEndpoint(username, password, callback) {
    const settings = {
        url: `${USERLOGIN_URL}`,
        datatype: 'json',
        data: JSON.stringify({
            username: username,
            password: password
        }),
        contentType: 'application/json',
        type: 'POST',
        success: callback, 
        error: function(err) {
            console.log('Input Error');
        }
    };
    $.ajax(settings);
    console.log(settings);
}


function displayDataFromLoginApi(data) {
    authToken = data.authToken;
    $('.js-container').html(`
    <h1>Welcome to your user account<h1>
    <h2>Please select your module below<h2>
    <ul class="modules-list">
        <li class="planner-module">Planner (coming soon)</li>
        <li class="photobooth-module">Photo Booth Module (coming soon)</li>
        <li class="floorplan-module">Event Space (coming soon)</li>
        <li class="collab-module">Collaborators (coming soon)</li>
        <li class="music-request">Music Requests</li>
    </ul>
    <div class="module"><div>
    `)
    $('.music-request').click(event => {
        musicRequestModule();
    })
}

function musicRequestModule(){
    $('.module').html(`
    <h1>Music Request List</h1>
    <ul>
        <li>Add Requests</li>
        <li>View Requests</li>
        <li>Print Requests</li>
    </ul>
    <div class="request-container"</div>`);
    $('ul li:nth-child(1)').click(event => {
        addRequests();
    });
    $('ul li:nth-child(2)').click(event => {
        viewRequests();
    });
    $('ul li:nth-child(3)').click(event => {
        printRequest();
    });
}
function viewRequests(){
    $('.request-container').html(
        `<h1>View Requests</h1>`
    )
}

function printRequests(){
    $('.request-container').html(
        `<h1>Print Requests</h1>`
    )
}

function addRequests(){
    $('.request-container').html(
        `<h1>Add Requests</h1>`
    )
}
function watchSubmit() {
    $('#js-loginForm').submit(event => {
        event.preventDefault();
        console.log('submit button works');
        const userName = $('#js-userNameLogin').val().trim();
        const password = $('#js-passwordLogin').val().trim();
        $('#js-userNameLogin').val('');
        $('#js-passwordLogin').val('');
        console.log(userName, password);
        loginEndpoint(userName, password, displayDataFromLoginApi)
    });
}

function SignUpEndpoint(username, password, callback) {
    const settings = {
        url: `${USERSIGNUP_URL}`,
        datatype: 'json',
        data: JSON.stringify({
            username: username,
            password: password
        }),
        contentType: 'application/json',
        type: 'POST',
        success: callback,
        error: function (err) {
            console.log('Input Error')
        }
    };
    $.ajax(settings);
    console.log(settings);
}

function displayDataFromSignUpApi (username) {
    console.log('Display Data from sign up API Callback works');
    $('.js-container').html(`
    <p>Welcome! Your username is ${username.username}.</p>
    <fieldset style="border:none">
    <button class="js-signIn" type="submit" value="submit">click here to login</button>
    </fieldset>
    `);
    $('.js-signIn').click(event => {
        userLogin();
    })

}


//New User Sign Up Submit
function watchSignUpSubmit() {
    $('#js-signUpForm').submit(event => {
        event.preventDefault();
        console.log('New User Sign Up form Works');
        const userName = $('#js-userNameSignUp').val().trim();
        const password = $('#js-newPass').val().trim();
        $('#js-userNameSignUp').val('');
        $('#js-newPass').val('');
        console.log(userName, password);
        SignUpEndpoint(userName, password, displayDataFromSignUpApi);
    });
}


//Click New User Button On Initial Screen
function watchSignUpClick() {
    $('.js-signUp').click(event => {
        $('.js-container').html(
            `<form id="js-signUpForm">
            <fieldset>
            <legend>New User Sign Up</legend>
            <label for="email">Email</label>
            <input id="js-userNameSignUp" email="email" type="text" placeholder="Email"/>
            <label for="password">Password</label>
            <input id="js-newPass" name="password" type="text" placeholder="Password"/> 
            <button type="submit" value="submit">Submit</button>
            </fieldset>
            <div class="login-footer">
                <div class="js-signIn">
                    <p>Already signed up?</p>
                </div>
            </div>
        </form>`
        );
    watchSignUpSubmit();
    watchLoginClick();
    });
}

//Click back from new user --> Already signed up.
function watchLoginClick() {
    $('.js-signIn').click(event => {
        userLogin();
    });
}