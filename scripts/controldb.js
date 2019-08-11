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
var currentUID;

/**
 * Nuevo post /comentario en DB.
 */

function writeNewPost(uid, username, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + temaId + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

function createNewComment(postId, username, text) {
  firebase.database().ref('comments/' + temaId + '/' + postId).push({
    text: text,
    author: username,
    postId: postId
  });
}

/**
 * Plantilla HTML para agregar nuevo post/comentario.
 */
function createPostElement(postId, title, text, author) {

  var html =
    `
    <div id="${postId}" class="caja-post mt-2 p-2 shadow-sm">
      <h4 class="caja-post-titulo">${title}</h4>
      <hr class="mt-0 mb-1">
      <p class="caja-post-comentario mb-2">${text}</p>
      <hr class="mt-0 mb-2">
      <div class="d-flex justify-content-between">
          <h6 class="left shadow-dark-green">Por ${author}</h6>
          <h6 class="right shadow-dark-green" data-toggle="collapse" data-target="#post${postId}">Comentarios<i class="ml-1 fas fa-caret-down"></i></h6>
      </div>
      <div id="post${postId}" class="collapse" data-parent="#recent-posts-list">
        <div class="form-group mt-1 form-comment">
          <input type="text" class="form-control" id="cp${postId}" placeholder="Comentar...">
          <button type="button" class="btn mx-auto shadow-sm comment-btn w-100 mt-2">Agregar comentario</button>
        </div>
        <div id="ctn${postId}">
        </div>
      </div>
    </div>
    `
  return html;
}

function createCommentElement(text, author) {

  var html =
    `
    <div class="caja-comentario px-1">
      <hr>
      <h6 class="tx-p cm-autor shadow-dark-green">${author} dijo:</h6>
      <p class="pl-1 comentario">${text}</p>
    </div>
    `
  return html;
}

/**
 * Inicio los listeners, y traigo los temas/comentarios ya creados de la DB.
 */
function startDatabaseQueries() {

  // Los temas se traen desde 'post/$iDdelCorrespondientePartido. EJ: 'post/108054'.
  const lastPostMatchRef = firebase.database().ref('posts/' + temaId).limitToLast(100);
  // Los comentarios se traen desde 'comments/$iDdelCorrespondientePartido. EJ: 'comments/108054'.
  const commentsPostRef = firebase.database().ref('comments/' + temaId).limitToLast(100);
  // Los comentarios se traen desde 'comments/$iDdelCorrespondientePartido. EJ: 'comments/108054'. 
  // [LIMITADO A 1, PERO AL PARECER NO FUNCIONA.]
  const commentsLast = firebase.database().ref('comments/' + temaId).limitToLast(1);

  commentsPostRef.once("value")
  .then(function(snapshot) {
    if (!snapshot.exists()) {
      $('.alert').alert('close');
      emptyMessage();
    }
  });
  // Traigo los post.
  var fetchPosts = function (postsRef) {
    
    // Al iniciar el foro, trae todos los temas ($post), cuando se añade un nuevo post, gracias al listener que dejo al 
    // finalizar la funcion, lo agrega también sin tener que reiniciar.
    postsRef.on('child_added', function (post) {
      // Data es un Objeto que contiene:
      // 'post.key' = id del post.
      // 'post.val().title' = titulo del post.
      // 'post.val().body' = cuerpo del post.
      // 'post.val().author' = creador del post.

      $('#recent-posts-list').prepend(
        // Paso esos datos como parametros para crear y añadir al html el post.
        createPostElement(post.key, post.val().title, post.val().body, post.val().author)
      );

    });

  };

  // Traigo los comentarios.
  var fetchComments = function (commentsR) {
    //Solo al iniciar, y despues de haber traido los temas, trae los comentarios.
    commentsR.on('child_added', function (data) {

      var comentarios = data.val();
      // Cada comentario está compuesto por 3 atributos:
      for (let com in comentarios) {
        // comentarios[com].postId = id del post al que pertenece.
        // comentarios[com].text = contenido del post al que pertenece.
        // comentarios[com].author = creador del post al que pertenece.

        // Con 'ctn' + el id, busco en el html el post al que pertenece y lo añado.
        $('#ctn' + comentarios[com].postId).prepend(createCommentElement(comentarios[com].text, comentarios[com].author));

      }
    });
  };

  // Fetching and displaying all posts of each sections.
  fetchPosts(lastPostMatchRef);
  fetchComments(commentsPostRef);
  //Como tengo separados los comentarios por partido y no por tema, si uso child_added no me detecta nada, por ende tengo que
  // escuchar por algun cambio que se produzca.
  // ===============================================
  // Esto es solo para los nuevos comentarios.
  commentsLast.on('child_changed', function (data) {

    // Ver por qué me trae todos, cuando especifico que traiga solo el ultimo comentario añadido.
    var aux = [];
    let comments = data.val();
    let lastCom;
    for (let prop in comments) {
      aux.push(comments[prop]);
    }
    // Saco el ultimo comentario que se agrego y lo pongo en el html.
    lastCom = aux.pop();
    $('#ctn' + lastCom.postId).prepend(createCommentElement(lastCom.text, lastCom.author));
  });

  // Seguimos escuchando por algun comentario o tema nuevo.
  listeningFirebaseRefs.push(lastPostMatchRef);
  listeningFirebaseRefs.push(commentsLast);
}
/*  */
function emptyMessage() {
  $('#foro-t').append(
    `<div id="empty-forum" class="alert alert-success text-center mx-auto fade show">
    <button type="button" class="close" data-dismiss="alert"><i class="fas fa-times"></i></button>
    No hay temas en este foro.<br>
    Sé el primero en crear uno.
  </div>`)
}
/**
 * Datos del usuario en la base de datos.
 */
function writeUserDataOnDB(userId, name, email) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
  });
}

/**
 * Limpio los foros de los temas que añadi de la base de datos.
 * Apago los listeners de post/comentarios..
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
 * Se dispara siempre que hay un cambio de el estado de la sesion. (Inicio o cierre.) 
 */
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }
  cleanupUi();

  if (user) {
    // Escondo el div que pide que te loguees para ver contenido.
    $(loginSplash).addClass('hide');
    // Escondo el boton de inicio de sesion.
    $(liLogin).addClass('hide');
    // Muestro el botón de cerrar sesión.
    $(liLogout).removeClass('hide');

    $(postContainer).removeClass('hide');
    // id para crear post y comentario (autor).
    currentUID = user.uid;
    writeUserDataOnDB(user.uid, user.displayName, user.email);

    startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
  }
}

/**
 * Obtengo el nombre de usuario para agregar como parametro de autor en la base de datos.
 */
function newPostForCurrentUser(title, text) {

  var userId = firebase.auth().currentUser.uid;

  return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';

    return writeNewPost(firebase.auth().currentUser.uid, username, title, text);

  });


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
// Mensaje para cuando inicia sesion desde el menu desplegable.
function addMessage() {
  $('.fix-container').prepend(
    `
      <div class="alert alert-success alert-dismissible">
      <button type="button" class="close" data-dismiss="alert"><i class="fas fa-times"></i></button>
      Elige un partido para entrar al tema.
      </div>
      `
  )
}
/**
 * Detecto el boton añadir nuevo comentario.
 */
$(document).on("click", ".comment-btn", function () {
  // 
  var postId = $(this).parents('.caja-post').attr('id');
  var commentInput = document.getElementById('cp' + postId);
  console.log('elemento: commentario: ', commentInput)
  if (commentInput.value === '') {
    console.log('Al parecer entra igual.')
    return;
  } else {
    createNewComment(postId, firebase.auth().currentUser.displayName, commentInput.value);
    commentInput.value = '';
  }
});


window.addEventListener('load', function () {
  // Bind Sign in button.
  signInButton.addEventListener('click', function (e) {
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });
  signInButtonDos.addEventListener('click', function (e) {
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    transition('#fixture');
    addMessage();
    $('.volver').removeClass('hide');
    $('#nav-bar').addClass('nav-activo');
  });

  // Bind Sign out button.
  signOutButton.addEventListener('click', function (e) {
    e.preventDefault();
    firebase.auth().signOut();
    location.reload();
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  // Saves message on form submit.
  addPostButton.addEventListener('click', function (e) {
    e.preventDefault();
    $('.alert').alert('close');
    let title = titleInput.value;
    let text = messageInput.value;

    if (text && title) {
      newPostForCurrentUser(title, text);
      messageInput.value = '';
      titleInput.value = '';
    }
  });

});