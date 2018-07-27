'use strict';
/// api to suggest similar songs http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=cher&track=believe&api_key=e1c8f246d4e4f0fb0e69b6f45b52c728&format=json

const USERLOGIN_URL = "/api/auth/login";
const USERSIGNUP_URL = "/api/users";
let authToken//Page Load
//$(getAndDisplayTemplateInfo)
$(userLogin)

function userLogin() {
    $('header').hide();
    $('.invisible').hide();
    $('.js-container').html(
        `<img id="logo" alt="record box" src="http://payload418.cargocollective.com/1/20/651977/10673238/bin.gif">
        <div class="intro-container">
        <div id="intro-page">
            <div id="welcome">Log in to Record Crate</div>
            <p id="para-welcome">A fun way to create and manage custom playlists with your favorite tracks!</p>
        </div>
        <form id="js-loginForm">
            <fieldset id="login">
            <legend style="display:none">Login To Your Music List</legend>
                <div id="usersignup">
                    <div id="email-box">
                        <label id="email" for="email">Email</label>
                        <input id="js-userNameLogin" email="email" type="text" placeholder="email, phone or username"/>
                    </div>
                    <div id="password-box">
                        <label id="password" for="password">Password</label>
                        <input id="js-passwordLogin" name="password" type="text" placeholder="password"/> 
                    </div>
                    <button class="submit-button" type="submit" value="submit">Submit</button>
                </div>
            </fieldset>
        </form>
        <div class="login-footer">
            <div class="js-signUp">
                <span>Sign Up For Record Crate</span>
            </div>
        </div>
        </div>`
        );
    watchSubmit();
    watchSignUpClick();
}

function watchSignUpClick() {
    $('.js-signUp').click(event => {
        $('.js-container').html(
            `
        <img id="logo" alt="record box" src="http://payload418.cargocollective.com/1/20/651977/10673238/bin.gif">
        <div id="intro-page">
            <h1 id="welcome">Sign up for Record Crate</h1>
            <p id="para-welcome">A fun way to create and manage custom playlists with your favorite tracks!</p>
        </div>
        <form id="js-signUpForm">
            <fieldset id="login">
            <legend style="display:none">Sign Up for Record Crate</legend>
                <div id="usersignup">
                    <div id="email-box">
                        <label id="email" for="email">Email</label>
                        <input id="js-userNameLogin" email="email" type="text" placeholder="email, phone or username"/>
                    </div>
                    <div id="password-box">
                        <label id="password" for="password">Password</label>
                        <input id="js-passwordLogin" name="password" type="text" placeholder="password"/> 
                    </div>
                    <button class="submit-button" type="submit" value="submit">Submit</button>
                </div>
            </fieldset>
        </form>
        <div class="login-footer">
                <div class="js-signUp">
                    <span>Already signed up?</span>
                </div>
            </div>`
        );
    watchSignUpSubmit();
    $('.js-signUp').click(event => {
        userLogin();
    });
    });
}
//New User Sign Up Submit
function watchSignUpSubmit() {
    $('#js-signUpForm').submit(event => {
        event.preventDefault();
        const userName = $('#js-userNameLogin').val().trim().toLowerCase();
        const password = $('#js-passwordLogin').val().trim();
        $('#js-userNameLogin').val('');
        $('#js-passwordLogin').val('');
        SignUpEndpoint(userName, password, displayDataFromSignUpApi);
    });
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
            console.log(err);
        }
    };
    $.ajax(settings);
    
}

function top50APIClick() {
    $('.js-top-50-viral').click(event => {
        $.ajax({
            url: 'http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=e1c8f246d4e4f0fb0e69b6f45b52c728&format=json',
            success: function(data) {
                displayTop50API(data);
            }
            });
        });
}
function displayTop50API(data) {
    const top50ListArray = data.tracks.track;
    console.log(top50ListArray);
    let displayTop50Original = top50ListArray.map(song =>
    `<tr class="top-50-row">
            <th>${song.artist.name}</th>
            <th>${song.name}</th> 
            <th><img class="js-click-list" value="${song.artist.name}-${song.name}" src="https://cdn0.iconfinder.com/data/icons/feather/96/circle-add-512.png" width="20px" height="20px"></th>
        </tr>`
    );

   let displayTop50 = displayTop50Original.join('');
    $('.list-request-container').empty();
    $('.list-request-container').html(`
        <div id="chart-title">Top 50 Viral</div>
        <table id="song-requests-table" style="width:100%">
            ${displayTop50}
            </table>`);

    $('th').on('click', 'img', function(event) {
        if (customList.length >= 1) {
        $(".top-50-row").hide();
        let top50Request = $(this).attr('value');
        $('#song-requests-table').html(`<div>Select a List to Add <span id="top-50-song-request">${top50Request}</span><div>`);
        $('.user-list').remove();
        top50APIAddToList(top50Request);
        }
        else {
            alert("Please Create a Playlist First!")
            addAListPage();           
        }
    });
}

function top50APIAddToList(data) {
    let newRequest = data.split("-");
    let artist = newRequest[0];
    let title = newRequest[1];
    console.log(artist, title);
    customList.forEach((list)=> {
        $('#song-requests-table').append(`
        <tr>
        <th>
        <button class="list-name" value="${list}" id="${list}">${list}</button>
        </th>
        </tr>`);
    });

    $('#song-requests-table').on("click", "button", function() {
        let listSelection = $(this).attr('id');
        console.log(listSelection);
        $.ajax({
            url:`/music-list/${listSelection}`,
            method: 'POST',
            headers: {"Authorization": "Bearer " + authToken},
            data: JSON.stringify({artist:artist, title: title}),
            dataType: 'json',
            contentType: 'application/json',
        }).done(alert(`Sucessfully added your request to ${listSelection}`)).then(
            $.ajax({
            url: 'http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=e1c8f246d4e4f0fb0e69b6f45b52c728&format=json',
            success: function(data){
                displayTop50API(data);
            }
            })
        );
    });
}

let customList;
function displayUserLists(data){
    customList = data.lists.map(list => list.listName);
    $(".ul-lists").empty();
    customList.forEach((list)=> {
        $(".ul-lists").append(`<li class="list-name" value="${list}" id="${list}">${list}</li>`);
    });
        $('header .col-12').html('<img id="logo-small" alt="record box" src="http://payload418.cargocollective.com/1/20/651977/10673238/bin.gif"><div id="user-title">Record Crate</div>'); 
        $('.invisible .col-12').html('<img id="logo-small" alt="record box" src="http://payload418.cargocollective.com/1/20/651977/10673238/bin.gif"><div id="user-title">Record Crate</div>');
};

function displayDataFromLoginApi(data) {
    authToken = data.authToken;
    $('header').show();
    $('.invisible').show();
    $(".ul-lists").hide();
    $('.charts-nav').html(`
    <div class="list-heading">Chart</div>
        <li class="js-top-50-viral">Top 50 Viral</li>
`);
$(".main").addClass("border-top-bottom");
createAListScreen();
showListNav(); 
getUserMusicLists();
watchForListSubmit();
top50APIClick();
}

function createAListScreen() {
    $('.js-container').html(`
    <div class="js-user-lists"></div>
        <div class="list-request-container">
            <div class="create-a-list"><span>Create A List</span></div>
                <form id="js-song-list-form">
                    <label for="list-entry" style="display:none">Enter List Name</label>
                    <input type="text" name="list-entry" id="js-new-music-list" placeholder="e.g. Cocktail Music">
                    <button class="submit-button" type="submit">Submit</button>
                </form>
        </div>`)
        hideListsOnInputTouch();
}
//toggles for nav
function showListNav() {
    $(".list-nav").click(event => {
        if (customList.length > 0) {
            $(".ul-lists").show();
            $('.list-nav').addClass('overflow')            
        }
        
        else {
            alert("You Need to Create a List First!");
            showListNav();
        }
        hideListNav();
    });
}

function hideListNav() {
    $(".list-nav").click(event => {
        $(".ul-lists").hide();
        $('.list-nav').removeClass('overflow');
        showListNav();
        $('.charts-nav').show();
    });
}
function deleteList(data) {
    $('#delete').click(event => {
        let retValue = confirm("Are you sure you want to delete this list?");
        if (retValue === true) {
        console.log(data);
        $.ajax({
            url: `music-list/${data}`,
            method: 'DELETE',
            success: function() {
                console.log("success!")
            },
            error: function() {
                console.log("error")
            },
            headers: {Authorization: "Bearer " + authToken}
        });
        getUserMusicLists();
        addAListPage();
        top50APIClick()
        }
    });
}
function addAListPage() {
    createAListScreen();
    $('#song-request-container').hide();
watchForListSubmit();
}

function correctCase (str) {
    var words = str.split(" ");
    for ( var i = 0; i < words.length; i++ )
    {
        var j = words[i].charAt(0).toUpperCase();
        words[i] = j + words[i].substr(1);
    }
    return words.join(" ");;
}

function watchForListSubmit() {
    $('#js-song-list-form').submit((event) => {
        event.preventDefault();
        let listNameInput = $('#js-new-music-list').val();
        let listName = correctCase(listNameInput);
        $('#js-new-music-list').val('');
        $('.charts-nav').show();
        $.ajax({
            url: '/music-list/',
            data: JSON.stringify({listName:listName}),
            method: 'POST',
            headers: {"Authorization": "Bearer " + authToken},
            contentType: "application/json",
            success: function () {
                displaySuccessListCreation(listName);
            }
        });
    });
    
    watchListSelect();
}
function displaySuccessListCreation(listData) {
    $('.list-request-container').html(`
    <div class="succes-case">
    <p>Success! "${listData}" Created!</p>
    <button class="submit-button" id="continue">Continue</button>
    </div>
   `)
   $('#continue').click(event => {
        getUserMusicLists(listData);
        displayNewListBlank(listData);
        $('.charts-nav').show();
        
   });
}

function displayNewListBlank(data) {    
    let newListMusic = "";
    populateList(newListMusic, data);

   $('#create-new-list').click(function() {
    addAListPage();
    });

    deleteList(data);
    songSubmit(data);
}
//changed here
function watchListSelect() {
    $('.list-nav').on('click', 'li', function(event) {
        let listName = $(this).closest('li').attr('value');

        $.ajax({
            url: `/music-list/${listName}`,
            method: 'GET',
            contentType: 'String',
            headers: {"Authorization": "Bearer " + authToken}
        }).done(function(data){
            displayListAPI(data);
        });
    });

}

function deleteSong() {
    $('#song-requests-table').on('click', '.remove' ,function(event) {
        let id = $(this).closest('tr').attr('id')
        $.ajax({
            url: `/${id}`,
            method: 'DELETE',
            headers: {Authorization: "Bearer " + authToken}, 
        });

        $(this).closest('tr').hide();
    })
};


let thisListOfMusic;
function displayListAPI(data) {
    let newList;
    let reverseOrder = function(data) {
    for (let i = data.songs.length + 1; i < data.songs.length; i--) {
        newList.push([i]);
    }
    return newList;
}

    thisListOfMusic = data.songs.map(songs => 
        `<tr id="${songs._id}">
            <th class="artist-name" value="${songs.artist}">${songs.artist}</th>
            <th class="title-name" value="${songs.title}">${songs.title}</th> 
            <th class="remove" value="${songs.artist}, ${songs.title}"><img src="https://cdn0.iconfinder.com/data/icons/pixon-1/24/circle_close_delete_exit_remove_x_outline-512.png" width="20px" height="20px"></th>
        </tr>
    `);
    
    let newListMusic = thisListOfMusic.reverse().join('\n\t');
    populateList(newListMusic, data.listName);
    songSubmit(data.listName);
    deleteList(data.listName);
    deleteSong();
    $('#create-new-list').click(function() {
        addAListPage();
    });
}

function populateList(newListMusic, data) {
    $('.list-request-container').html(`
    <div class="list-container">
            <div class="add-remove">
                <button id="delete">DELETE LIST</button>
                <button id="create-new-list">NEW LIST</button>
            </div>
            <div class="list-add-song" value="listName">${data.toUpperCase()}</div>
    </div>
    <div class="request-form-container">
            <form id="js-song-request-form">
                <label for="artist-entry" style="display:none">Enter Artist</label>
                <input type="text" name="artist-entry" id="js-artist-entry" placeholder="ARTIST">
                <label for="title-entry" style="display:none">Enter Title</label>
                <input type="text" name="title-entry" id="js-title-entry" placeholder="TITLE">
                <button type="submit" class="submit-button">Add Song!</button>
            </form>
    </div>
    <div class="song-request-container">
        <table id="song-requests-table" style="width:100%">
                <tbody>
            ${newListMusic} 
                </tbody>
        </table>
    </div>`);
}

function hideListsOnInputTouch() {
    $('input').focusin(function() {
        $(".ul-lists").hide();
        $('.list-nav').removeClass('overflow');
        showListNav();
      });
}

function songSubmit(data) {
    let listPassThrough = data;
    console.log(listPassThrough);
    $('#js-song-request-form').submit((event) => {
        event.preventDefault();
        let artist = $('#js-artist-entry').val().trim();
        let title =$('#js-title-entry').val().trim(); 
        artist = correctCase(artist);
        title = correctCase(title);
        $('#js-title-entry').val('');
        $('#js-artist-entry').val('');
        $.ajax({
            url:`/music-list/${data}`,
            method: 'POST',
            headers: {"Authorization": "Bearer " + authToken},
            data: JSON.stringify({artist:artist, title: title}),
            dataType: 'json',
            contentType: 'application/json',
            success: function() {
                alert("success! Song Added!");
                $.ajax({
                    url: `/music-list/${listPassThrough}`,
                    method: 'GET',
                    contentType: 'String',
                    headers: {"Authorization": "Bearer " + authToken}
                }).done(function(data){
                    displayListAPI(data);
                });
            },
            error: function() {
                console.log("Error Posting");
            }
            });
     });
     
}

function getUserMusicLists(data){
    $.ajax({
        url: '/music-list',
        method: 'GET',
        headers: {"Authorization": "Bearer " + authToken},
    }).done(function(data){
        displayUserLists(data);
    });
}

function watchSubmit() {
    $('#js-loginForm').submit(event => {
        event.preventDefault();
        const userName = $('#js-userNameLogin').val().trim().toLowerCase();
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

