'use strict';
/// api to suggest similar songs http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=cher&track=believe&api_key=e1c8f246d4e4f0fb0e69b6f45b52c728&format=json

const USERLOGIN_URL = "/api/auth/login";
const USERSIGNUP_URL = "/api/users";
let authToken;

let musicListTemplate = (
    '<div class="list js-list">' +
      '<h3 class="js-list-name"><h3>' +
      '<hr>' +
      '<ul class="js-list-songs">' +
      '</ul>' +
      '<div class="list-controls">' +
        '<button class="js-list-delete">' +
          '<span class="button-label">delete</span>' +
        '</button>' +
      '</div>' +
    '</div>'
  );
  
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
        `
        <img id="logo" alt="record box" src="http://payload418.cargocollective.com/1/20/651977/10673238/bin.gif">
        <div id="intro-page">
            <h1 id="welcome">Log in to Record Crate</h1>
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
                <p>Sign up for Record Crate</p>
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
                    <p>Already signed up?</p>
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
            console.log('Input Error');
        }
    };
    $.ajax(settings);
    console.log(settings);
}
function top50APIClick() {
    $('#top-50-API').click(event => {
        $.ajax({
            url: 'http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=e1c8f246d4e4f0fb0e69b6f45b52c728&format=json',
            success: function(data){
                displayTop50API(data);
            }
            });
        });
}


function displayTop50API(data) {
    const top50ListArray = data.tracks.track;
    console.log(top50ListArray);
    let displayTop50Original = top50ListArray.map(song =>
    `<tbody>
        <tr class="top-50-row">
            <th>${song.artist.name}</th>
            <th>${song.name}</th> 
            <th><img class="js-click-list" value="${song.artist.name}-${song.name}" src="https://cdn0.iconfinder.com/data/icons/feather/96/circle-add-512.png" width="20px" height="20px"></th>
        </tr>
    </tbody>
    <div class="user-list"></div>`
    );

    
   let displayTop50 = displayTop50Original.join('');
    $('.list-request-container').empty();
    $('.list-request-container').html(`
        <h1 id="chart-title">Top 50 Viral (from Last.fm)</h1>
        <table id="song-requests-table" style="width:80%">
            <tbody>
                <tr>
                    <th id="artist">Artist</th>
                    <th>Title</th> 
                    <th>Add To A List</th>
                </tr>
            </tbody>
            ${displayTop50}`);



    $('th').on('click', 'img', function(event) {
        if (customList.length > 1) {
        $(".top-50-row").hide();
        let top50Request = $(this).attr('value');
        console.log(top50Request);
        $('#song-requests-table').empty();
        $('.user-list').remove();
        $('#chart-title').html(`<h2>Select a List to Add ${top50Request}</h2>`);
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
    console.log(artist, title)
    customList.forEach((list)=> {
        $('#song-requests-table').append(`<button class="list-name" value="${list}" id="${list}" ondrop="dropRequest(event)" ondragover="allowDrop(event)">${list}</button>`);    
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

//Drag/Drop Requests
// function allowDrop(ev) {
//     ev.preventDefault();
// }
// function dragRequest(ev){
//    ev.dataTransfer.setData("text", ev.target.id);`
   
// }
let customList;
function displayUserLists(data){
    customList = data.lists.map(list => list.listName);
    $(".js-user-lists").empty();
    customList.forEach((list)=> {
        $(".js-user-lists").append(`<button class="list-name" value="${list}" id="${list}" ondrop="dropRequest(event)" ondragover="allowDrop(event)">${list}</button>`);    
    });
};
// let floatList;
// let customList;
// function mouseOverVariable() {
//     $(".list-name").mouseover(function(){
//         floatList = $(this).attr('id')
//         console.log("mouseover works", floatList);
//         return floatList;
//     });    
    
// }

// function dropRequest(ev) {
//     let data = ev.dataTransfer.getData('text').split(", ");
//     console.log(data);
//     let artist = data[0];
//     let title = data[1];
//     //tryingto drag and drop top50 to user lists.
//     if (floatList != undefined) {
//     $.ajax({
//         url:`/music-list/${floatList}`,
//         method: 'POST',
//         headers: {"Authorization": "Bearer " + authToken},
//         data: JSON.stringify({artist:artist, title: title}),
//         dataType: 'json',
//         contentType: 'application/json',
//         success: console.log('song added')
//         });
//     };
// }

function displayDataFromLoginApi(data) {
    authToken = data.authToken;
    $('.song-request-container').hide();
    $('.js-container').html(`
    <h1>Music Request Lists</h1>
    <div id="top-50-API" style="color:red">Top 50 Viral</div>
    <div class="js-user-lists"></div>
        <div class="list-request-container">
            <h2>Create a Request List</h2>
                <form id="js-song-list-form">
                    <label for="list-entry">Enter List Name</label>
                    <input type="text" name="list-entry" id="js-new-music-list" placeholder="e.g. Cocktail Music">
                    <button type="submit">Submit</button>
                </form>
        </div>
        <div id="song-request-container">
            <h2>Single Song Request</h2>
                <form id="js-song-request-form">
                    <label for="artist-entry">Add an artist</label>
                    <input type="text" name="single-artist-entry" id="js-new-artist" placeholder="Artist">
                    <label for="song-entry">Add a title</label>
                    <input type="text" name="single-title-entry" id="js-new-title" placeholder="Title">
                    <button type="submit">Submit</button>
                </form>
            <div class="request-placeholder"><div>
        </div>
    `);
    $('#song-request-container').hide();
getUserMusicLists();
watchForListSubmit();
top50APIClick();


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
    $('.list-request-container').html(`
        <div class="list-request-container">
            <h2>Create a Request List</h2>
                <form id="js-song-list-form">
                    <label for="list-entry">Enter List Name</label>
                    <input type="text" name="list-entry" id="js-new-music-list" placeholder="e.g. Cocktail Music">
                    <button type="submit">Submit</button>
                </form>
        </div>
        <div id="song-request-container">
            <h2>Single Song Request</h2>
                <form id="js-song-request-form">
                    <label for="artist-entry">Add an artist</label>
                    <input type="text" name="single-artist-entry" id="js-new-artist" placeholder="Artist">
                    <label for="song-entry">Add a title</label>
                    <input type="text" name="single-title-entry" id="js-new-title" placeholder="Title">
                    <button type="submit">Submit</button>
                </form>
            <div class="request-placeholder"><div>
        </div>
    `);
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
let currentLists;


function watchForListSubmit() {
    $('#js-song-list-form').submit((event) => {
        event.preventDefault();
        let listNameInput = $('#js-new-music-list').val();
        let listName = correctCase(listNameInput);
        console.log(currentLists);
        $('#js-new-music-list').val('');
        
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
    <h1 value="listName">${listData}</h1>
    <p>Success! "${listData}" Created!</p>
    <button id="continue">Continue</button>
   `)
   $('#continue').click(event => {
        getUserMusicLists();
        displayNewListBlank(listData);
        
   });
}

function displayNewListBlank(data) {
    $('.list-request-container').html(`
    <h1 value="listName">${data}</h1>
    <button id="delete">Delete this list</button>
    <button id="create-new-list">Create New List</button>
    <h2>Add a Song</h2>
                <form id="js-song-request-form">
                    <label for="artist-entry">Enter Artist</label>
                    <input type="text" name="artist-entry" id="js-artist-entry" placeholder="Artist">
                    <label for="title-entry">Enter Title</label>
                    <input type="text" name="title-entry" id="js-title-entry" placeholder="Title">
                    <button type="submit">Submit</button>
                </form>
    <table id="song-requests-table" style="width:80%">
    <tbody>
    <tr>
      <th>Artist</th>
      <th>Title</th> 
      <th>Remove From List</th>
    </tr>
    </tbody>
   `)

   $('#create-new-list').click(function() {
    addAListPage();
});
   $('#js-song-request-form').submit((event) => {
    event.preventDefault();
    let artist = $('#js-artist-entry').val().trim();
    let title =$('#js-title-entry').val().trim();
    artist = correctCase(artist);
    title = correctCase(title);
    //delete this code??s
    console.log(artist, title);
    $('#js-title-entry').val('');
    $('#js-artist-entry').val('');


    $.ajax({
        url:`/music-list/${data.listName}`,
        method: 'POST',
        headers: {"Authorization": "Bearer " + authToken},
        data: JSON.stringify({artist:artist, title: title}),
        dataType: 'json',
        contentType: 'application/json',
        success: generateList(artist, title)
        });
    
 });
 deleteList(data);
 
 
}
//changed here
function watchListSelect() {
    $('.js-user-lists').on('click', 'button', function(event) {
        let listName = $(this).closest('button').attr('value');
        console.log(listName)
        $.ajax({
            url: `/music-list/${listName}`,
            method: 'GET',
            contentType: 'json',
            data: JSON.stringify({listName:listName}),
            headers: {"Authorization": "Bearer " + authToken}
        }).done(function(data){
            displayListAPI(data);
        });
    });

}

function deleteSong() {
    $('#song-requests-table').on('click', '.remove' ,function(event) {
        console.log('clickworks');
        let id = $(this).closest('tr').attr('id')
        console.log(id);
        $.ajax({
            url: `/${id}`,
            method: 'DELETE',
            headers: {Authorization: "Bearer " + authToken}, 
        });
        $(this).closest('tr').hide();
    })
};

function addRequestToList(data) {

}

function displayListAPI(data) {
    console.log(data)
    let thisListOfMusic = data.songs.map(songs => 
        `<tbody>
            <tr id="${songs._id}">
                <th class="artist-name" value="${songs.artist}">${songs.artist}</th>
                <th class="title-name" value="${songs.title}">${songs.title}</th> 
                <th class="remove" value="${songs.artist}, ${songs.title}"><img src="https://cdn0.iconfinder.com/data/icons/pixon-1/24/circle_close_delete_exit_remove_x_outline-512.png" width="20px" height="20px"></th>
            </tr>
        </tbody>
    `); 
    let listOfMusic = data.songs.map(songs => `${songs.artist} ${songs.title}`)
    
    $('.list-request-container').html(`
    <h1 value="listName">${data.listName}</h1>
    <button id="delete">Delete this list</button>
    <button id="create-new-list">Create a New List</button>
    <h2>Add a Song</h2>
                <form id="js-song-request-form">
                    <label for="artist-entry">Enter Artist</label>
                    <input type="text" name="artist-entry" id="js-artist-entry" placeholder="Artist">
                    <label for="title-entry">Enter Title</label>
                    <input type="text" name="title-entry" id="js-title-entry" placeholder="Title">
                    <button type="submit">Submit</button>
                </form>
    <table id="song-requests-table" style="width:80%">
    <tbody class="tbody">
    <tr>
      <th>Artist</th>
      <th>Title</th> 
      <th>Remove From List</th>
    </tr>
    </tbody>
    ${thisListOfMusic}
    </table>
   `)

   $('#js-song-request-form').submit((event) => {
       event.preventDefault();
       let artist = $('#js-artist-entry').val().trim();
       let title =$('#js-title-entry').val().trim(); 
       artist = correctCase(artist);
       title = correctCase(title);
       $('#js-title-entry').val('');
       $('#js-artist-entry').val('');
       
       $.ajax({
           url:`/music-list/${data.listName}`,
           method: 'POST',
           headers: {"Authorization": "Bearer " + authToken},
           data: JSON.stringify({artist:artist, title: title}),
           dataType: 'json',
           contentType: 'application/json',
           success: generateList(artist, title)
           });
    });
    console.log("looking for", data)
    deleteList(data.listName);
    deleteSong();
    $('#create-new-list').click(function() {
        addAListPage();
    });
}
function generateList(artist, title) {
    $('#song-requests-table tbody:last').after(`<tbody>
    <tr id="${artist}, ${title}">
      <th>${artist}</th>
      <th>${title}</th> 
      <th class="remove" value="${artist}, ${title}"><img src="https://cdn0.iconfinder.com/data/icons/pixon-1/24/circle_close_delete_exit_remove_x_outline-512.png" width="20px" height="20px"></th>
    </tr>
    </tbody>`)
}

function getUserMusicLists (){
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



//Click New User Button On Initial Screen


