/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';


// Shortcuts to DOM Elements.
var titleInput = document.getElementById('new-post-title');
var messageInput = document.getElementById('new-post-message');
var signInButton = document.getElementById('sign-in-button');
var signInButtonDos = document.getElementById('sign-in-button-dos');
var signOutButton = document.getElementById('sign-out-button');
var loginSplash = document.getElementById('login');
var liLogin = document.getElementById('li-login');
var liLogout = document.getElementById('li-logout');
var comentarPost = document.getElementById('comentar-post');
var postContainer = document.getElementById('post-container');
var liLogout = document.getElementById('li-logout');
var addPost = document.getElementById('add-post');
var commentBtn = document.querySelector('.comment-btn');
var addPostButton = document.getElementById('add-post-btn');
var recentPostsSection = document.getElementById('recent-posts-list');
var listeningFirebaseRefs = [];
var temaId;


/**
 * Saves a new post to the Firebase DB.
 */
// [START write_fan_out]
function writeNewPost(uid, username, picture, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + temaId + '/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + temaId + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
// [END write_fan_out]

/**
 * Creates a post element.
 */
function createPostElement(postId, title, text, author, authorId, authorPic) {

  var html =
    `
    <div id="${postId}" class="caja-post mt-2 p-2 shadow-sm">
      <h4 class="caja-post-titulo">${title}</h4>
      <hr class="mt-0 mb-1">
      <p class="caja-post-comentario mb-2">${text}</p>
      <hr class="mt-0 mb-2">
      <div class="d-flex justify-content-between">
          <h6 class="left">Por ${author}</h6>
          <h6 class="right" data-toggle="collapse" data-target="#post${postId}">Comentarios<i class="ml-1 fas fa-caret-down"></i></h6>
      </div>
      <div id="post${postId}" class="collapse" data-parent="#recent-posts-list">
        <div class="form-group mt-1 form-comment">
          <input type="text" class="form-control" id="cp${postId}" placeholder="Comentar...">
          <button type="button" class="btn mx-auto comment-btn w-100 mt-1">Agregar comentario</button>
        </div>
        <div id="ctn${postId}">
        </div>
      </div>
    </div>
    `
  return html;
}
/**
 * Writes a new comment for the given post in the DB.
 */
function createNewComment(postId, username, text) {
  firebase.database().ref('comments/' + temaId + '/' + postId).push({
    text: text,
    author: username,
    postId: postId
  });
}
/**
 * Creates a post element.
 */
function createCommentElement(text, author) {

  var html =
    `
    <div class="caja-comentario px-1">
      <hr>
      <h6 class="tx-p">${author} dijo:</h6>
      <p class="pl-1">${text}</p>
    </div>
    `
  return html;
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  // [START recent_posts_query]
  const lastPostMatchRef = firebase.database().ref('posts/' + temaId).limitToLast(100);
  const commentsPostRef = firebase.database().ref('comments/' + temaId).limitToLast(100);
  const commentsLast = firebase.database().ref('comments/' + temaId).limitToLast(1);
  // [END recent_posts_query]

  var fetchPosts = function (postsRef) {

    postsRef.on('child_added', function (data) {
      let author = data.val().author || 'Anonymous';
      $('#recent-posts-list').prepend(createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic));
    });

  };
  var fetchComments = function (commentsR) {
    commentsR.on('child_added', function (data) {
      var comments = data.val();
      for (let prop in comments) {
        $('#ctn' + comments[prop].postId).prepend(createCommentElement(comments[prop].text, comments[prop].author));
      }
    });
  };
  
  // Fetching and displaying all posts of each sections.
  fetchPosts(lastPostMatchRef);
  fetchComments(commentsPostRef);

  commentsLast.on('child_changed', function (data) {
    var aux = [];
    let comments = data.val();
    let lastCom;
    for (let prop in comments) {
      aux.push(comments[prop]);
    }
    lastCom = aux.pop();
    $('#ctn' + lastCom.postId).prepend(createCommentElement(lastCom.text, lastCom.author));
  });

  // Keep track of all Firebase refs we are listening to.
  listeningFirebaseRefs.push(lastPostMatchRef);
  listeningFirebaseRefs.push(commentsLast);
}

/**
 * Writes the user's data to the database.
 */
// [START basic_write]
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture: imageUrl
  });
}
// [END basic_write]

/**
 * Cleanups the UI and removes all Firebase listeners.
 */
function cleanupUi() {
  // Remove all previously displayed posts.
  recentPostsSection.innerHTML = '';

  // Stop all currently listening Firebase listeners.
  listeningFirebaseRefs.forEach(function (ref) {
    ref.off();
  });
  listeningFirebaseRefs = [];
}

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  cleanupUi();
  if (user) {
    $(loginSplash).addClass('hide');
    $(liLogin).addClass('hide');
    $(liLogout).removeClass('hide');
    $(postContainer).removeClass('hide');
    currentUID = user.uid;
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;

  }
}

/**
 * Creates a new post for the current user.
 */
function newPostForCurrentUser(title, text) {
  // [START single_value_read]
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // [START_EXCLUDE]
    return writeNewPost(firebase.auth().currentUser.uid, username,
      firebase.auth().currentUser.photoURL,
      title, text);
    // [END_EXCLUDE]
  });
  // [END single_value_read]
}
function transition(toPage) {
  var toPage = $(toPage);
  var fromPage = $('.pages .activo');
  if (toPage.hasClass('activo') || toPage === fromPage) {
      return;
  }
  toPage
      .addClass('activo fade in')
      .one('webkitAnimationEnd animationend', function () {
          fromPage.removeClass('activo fade out');
          toPage.removeClass('fade in');
      })
  fromPage.addClass('fade out');
}
function addMessage() {
  $('.fix-container').prepend(
      `
      <div class="alert alert-success alert-dismissible">
      <button type="button" class="close" data-dismiss="alert">&times;</button>
      Elige un partido para entrar al tema.
      </div>
      `
  )
}
/**
 * Creates a new comment in DB for a giving post.
 */
$(document).on("click", ".comment-btn", function () {
  var postId = $(this).parents('.caja-post').attr('id');
  var commentInput = document.getElementById('cp' + postId);
  if (commentInput === '') {
    return;
  } else {
    createNewComment(postId, firebase.auth().currentUser.displayName, commentInput.value);
    commentInput.value = '';
  }
});

// Bindings on load.
window.addEventListener('load', function () {
  // Bind Sign in button.
  signInButton.addEventListener('click', function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });
  signInButtonDos.addEventListener('click', function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    transition('#fixture');
    addMessage();
    $('#nav-bar').addClass('nav-activo');
  });

  // Bind Sign out button.
  signOutButton.addEventListener('click', function () {
    firebase.auth().signOut();
    location.reload();
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  // Saves message on form submit.
  addPostButton.addEventListener('click', function () {

    var title = titleInput.value;
    var text = messageInput.value;
    if (text && title) {
      newPostForCurrentUser(title, text);
      messageInput.value = '';
      titleInput.value = '';
    }
  });

});