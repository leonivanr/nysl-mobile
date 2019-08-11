$(document).ready(function () {
    const fixture = info.matches;
    const teams = info.teams;
    const locations = info.locations;
    var lastPage;
    var mql = window.matchMedia("(orientation: portrait)");
    window.history.pushState('#index', '');
    
    // Llenar los divs.

    displayPositions();
    displayMatches();
    displayTeams();
    displayLocations();

    // Detecto el portrait,
    if (mql.matches) {
        $('.detalle-partido').each(function () {
            $(this).attr('data-toggle', 'modal');
        })
    } else {
        $('.detalle-partido').each(function () {
            $(this).attr('data-toggle', '');
        })
    }
    // Add a media query change listener
    mql.addListener(function (m) {
        if (m.matches) {
            $('#fixture-land').hide();
            $('.detalle-partido').each(function () {
                $(this).attr('data-toggle', 'modal');
            })
        } else {
            $('#fixture-land').show();
            $('.detalle-partido').each(function () {
                $(this).attr('data-toggle', '');
            })
        }
    });
    //Ir al id.
    $('.main a').unbind("click");
    $('.main a').click(function (e) {
        e.preventDefault();
        let prevPage = $('.pages .activo').attr('id');
        
        let proximaPagina = e.currentTarget.hash;
        $('#nav-bar').addClass('nav-activo');
        $('.volver').removeClass('hide');
        if (proximaPagina !== historial[historial.length - 1]) {
            historial.push(proximaPagina);
        }
        addLinkActive(proximaPagina);
        window.history.pushState(proximaPagina, "");
        console.log('main click',window.history);
        transition(proximaPagina);
        })
    //Volver al menu inicial
    $('#logo-link').click(function (e) {
        let index = e.target.parentElement.hash;
        console.log('elemento: index', index)
        $('.pages .activo').removeClass('activo');
        // if ($('#index .activo')) {
        //     return;
        // }
        $('#nav-bar').removeClass('nav-activo');
        $('.volver').addClass('hide');
        $('#index').addClass('activo');
    })
    //Detectar proxima pagina y ocultar.
    $('#nav-bar a').unbind("click");
    $('#nav-bar a').click(function (e) {
        e.preventDefault();
        let proximaPagina = e.currentTarget.hash;
        if (proximaPagina !== historial[historial.length - 1]) {
            historial.push(proximaPagina);
        }
        addLinkActive(proximaPagina);
        // let prevPage = $('.pages .activo').attr('id');
        window.history.pushState(proximaPagina, "");
        console.log('nav-click', window.history)
        transition(proximaPagina);
        
    })
    //Obtengo el id del partido, y muestro según land o port.
    $(document).on("click", ".detalle-partido", function () {
        let matchId = $(this).attr('id');
        let resultadoMatch = fixture.filter(x => x.matchID === matchId);
        let locationId = resultadoMatch[0].location_id;
        let locationMatch = locations.filter(x => x.id === locationId);
        // If there are matches, we're in portrait
        if (mql.matches) {
            $("#body-data").html(
                matchesOnPortrait(resultadoMatch, locationMatch, matchId)
            )
        } else {
            $("#fixture-port").css('margin-left', '0');
            $("#fixture-land").removeClass('hide');
            $("#fixture-land").html(
                matchesOnLandscape(resultadoMatch, locationMatch, matchId)
            )
        }

    });
    // LLena el modal de acuerdo al equipo elegido.
    $(document).on("click", ".equipos-item", function () {
        let teamId = $(this).attr('id');
        let teamDetalle = teams.filter(x => x.team_id === teamId);
        $("#eq-modal-data").html(
            `
            <button type="button" class="close" data-dismiss="modal"><i class="fas fa-times"></i></button>
            <br>
            <div class="d-flex flex-row align-items-center">
                <div class="asd">
                    <img class="modal-img" src="${teamDetalle[0].team_logo_img}" alt="">
                </div>
                <div class="ml-3 w-100">
                    <div class="text-center">
                    <h5>${teamDetalle[0].team_name}</h5>
                    </div>
                    <hr>
                    <h5 class="">Posición: ${teamDetalle[0].team_position}º</h5>
                    <h5 class="">Jugados: ${teamDetalle[0].matches_played}</h5>
                    <h5 class="">Puntos: ${teamDetalle[0].points}</h5>
                    <h5 class="">Ganados: ${teamDetalle[0].wins}</h5>
                    <h5 class="">Empates: ${teamDetalle[0].draws}</h5>
                    <h5 class="">Perdidos: ${teamDetalle[0].loses}</h5>
                    <h5 class="">Diferencia de gol: ${teamDetalle[0].goal_difference}</h5>
                </div>
            </div>
            `
        )
    });
    //Setear el matchId para obtener mensajes del foro.
    $(document).on("click", ".foro-btn", function () {
        temaId = $(this).attr('id');
        let cleanMatchId = temaId.match(/\d/g).join("");
        let match = fixture.filter(x => x.matchID === cleanMatchId);
        let proximaPagina = '#foros';
        updateForumMatch(match[0]);
        if (proximaPagina !== historial[historial.length - 1]) {
            historial.push(proximaPagina);
            console.log(historial);
        }
        addLinkActive(proximaPagina);
        transition(proximaPagina);
        recentPostsSection.innerHTML = '';

        startDatabaseQueries();
    });

    // Listener para boton volver (en pantalla).
    $('.volver').click(function (e) {
        backHistory();
    })
    window.addEventListener("popstate", function (event) {
        console.log('estate history back' + window.history.state);
        console.log('estate history event' + event.state);

        
        if (event.state) {
    
            if (event.state === '#index') {
                $('#nav-bar').removeClass('nav-activo');
                $('.volver').addClass('hide');
            }
            console.log('estate pressed button' + window.history.state);
            addLinkActive(event.state);
            // Transition back - but in reverse.
            transition(event.state);
            console.log(window.history);
        } else if(!event.state){
            console.log('no')
            window.history.go(-1);
        }
    
    }, false);
    function addLinkActive(proximaPagina) {
        $('#nav-bar .link-activo').removeClass('link-activo');
        if (proximaPagina === '#foros') {
            return;
        }
        // if (typeof(proximaPagina) === null)
        let linkActivo = $('.link-' + proximaPagina.substr(1));
        linkActivo.addClass('link-activo');
    }

    function backHistory() {
        if (historial.length >= 2) {
            console.log('pop()');
            historial.pop();
        }
        lastPage = historial[historial.length - 1];
        if (lastPage === '#index') {
            $('#nav-bar').removeClass('nav-activo');
            $('.volver').addClass('hide');
        }
        addLinkActive(lastPage);
        transition(lastPage);
    }

    function transition(page) {
        var toPage = $(page);
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

    function addHistory(page) {

    }

    function displayMatches() {

        fixture.filter(x => x.fullDay === "Septiembre 1º").forEach(match => {
            $('#domingoUno').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "Septiembre 8º").forEach(match => {
            $('#domingoOcho').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "Septiembre 15º").forEach(match => {
            $('#domingoQuince').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "Septiembre 22º").forEach(match => {
            $('#domingoVdos').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "Septiembre 29º").forEach(match => {
            $('#domingoVnueve').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "October 6º").forEach(match => {
            $('#domingoSeis').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "October 13º").forEach(match => {
            $('#domingoTrece').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "October 20º").forEach(match => {
            $('#domingoVeinte').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "October 27º").forEach(match => {
            $('#domingoVsiete').append(showM(match));
        })

    }

    function displayTeams() {

        teams.forEach(team => {
            $('.equipos-container').append(`
            <div id="${team.team_id}" class="equipos-item mx-auto" data-toggle="modal" data-target="#equipos-modal">
                <span class="equipos-titulo">${team.team_name}</span>
                <img class="equipos-img" src="${team.team_logo_img}" alt="${team.team_name}">
            </div>
            `)
        })

    }

    function displayLocations() {

        locations.forEach(location => {
            $('.sedes-container').append(`
            <div class="sedes-item mx-auto" data-toggle="modal" data-target="#${location.id}">
                <span class="sedes-titulo">${location.name}</span>
            </div>
        
            <div class="modal fade" id="${location.id}">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content ">
        
                        <!-- Modal Header -->
                        <div class="modal-header">
                            <div>
                                <h4 class="modal-title">${location.name}</h4>
                                <br>
                                <h6>${location.address}</h6>
                            </div>
        
                            <button type="button" class="close" data-dismiss="modal"><i class="fas fa-times"></i></button>
                        </div>
        
                        <!-- Modal body -->
                        <div class="modal-body">
                            <div class="embed-responsive embed-responsive-16by9">
                                <iframe class="border"
                                    src="${location.map}"></iframe>
                            </div>
                        </div>
        
                    </div>
                </div>
            </div>
        
            `)
        })

    }

    function displayPositions() {
        teams.sort((a, b) => {
            return a.team_position - b.team_position
        });
        teams.forEach(team => {
            $('#tbl-puntaje').append(
                `
                <tr>
                    <td class="pl-2"><img src="${team.team_logo_img}" class="img-tabla mr-2" alt="${team.team_name}">${team.team_name}</td>
                    <td>${team.points}</td>
                    <td>${team.matches_played}</td>
                    <td>${team.wins}</td>
                    <td>${team.draws}</td>
                    <td>${team.loses}</td>
                </tr>
                `
            )

        })

    }

    function showM(match) {
        return `
        <!-- 1er Partido -->
        <div  class="detalle-partido-container" >
            <a id="${match.matchID}" class="detalle-partido" href="#fixture-detalle" data-toggle="modal" data-target="#myModal">
                <div class="fixture-partido">
                    <img class="img-club left" src="${match.team1img}" alt="">
                    <p class="versus">${match.team1}</p>
                    <p class="versus">-</p>
                    <p class="versus">${match.team2}</p>
                    <img class="img-club right" src="${match.team2img}" alt="">
                </div>
            </a>
        </div>
        `
    }

    function updateForumMatch(match) {
        $('#foro-t').html('');
        $('#foro-t').prepend(`
        <div class="detalle-partido-container mx-auto w80">
        <div id="${match.matchID}" class="detalle-partido">
            <div class="fixture-partido">
                <img class="img-club left" src="${match.team1img}" alt="${match.team1}">
                <p class="versus">${match.team1}</p>
                <p class="versus">-</p>
                <p class="versus">${match.team2}</p>
                <img id="foro-titulo-img-t2" class="img-club right" src="${match.team2img}" alt="${match.team2}">
            </div>
        </div>
    </div>`)
    }

    function matchesOnPortrait(resultadoMatch, locationMatch, matchId) {
        return `
        <div class="equipo-detalle">
            <div class="text-center">
                <p class="versus-modal">${resultadoMatch[0].team1}</p>
                <img class="img-club-detalle" src="${resultadoMatch[0].team1img}" alt="">
            </div>
            <p class="versus-modal">VS</p>
            <div class="text-center">
                <p class="versus-modal">${resultadoMatch[0].team2}</p>
                <img class="img-club-detalle" src="${resultadoMatch[0].team2img}" alt="">
            </div>
        </div>
        <hr>
        <div class="equipo-info mt-1">
            <div class="d-flex justify-content-between">
                <h5>Hora: <span class="modal-date">${resultadoMatch[0].time}</span></h5>
                <h5>Fecha: <span class="modal-date">${resultadoMatch[0].fullDay}</span></h5>
            </div>
            <h5>Lugar: <span class="modal-date">${locationMatch[0].name}</span></h5>
            <h5>Dirección: <span class="modal-date">${locationMatch[0].address}</span></h5>
            <br>
            <div id="iframe-map" class="shadow-sm embed-responsive embed-responsive-21by9">
            <iframe src="${locationMatch[0].map}"></iframe>
            </div>
            <br>
            <div id="tema-${matchId}" class="text-center foro-btn" data-dismiss="modal"><u>Ir al foro de este partido</u> </div>
        </div>
        `
    };

    function matchesOnLandscape(resultadoMatch, locationMatch, matchId) {
        return `

        <div class="equipo-detalle">
            <div class="text-center">
                <p class="versus-modal">${resultadoMatch[0].team1}</p>
                <img class="img-club-detalle" src="${resultadoMatch[0].team1img}" alt="">
            </div>
            <p class="versus-modal">VS</p>
            <div class="text-center">
                <p class="versus-modal">${resultadoMatch[0].team2}</p>
                <img class="img-club-detalle" src="${resultadoMatch[0].team2img}" alt="">
            </div>
        </div>
        <hr>
        <div class="equipo-info mt-1">
            <div class="d-flex justify-content-between">
                <h5>Hora: <span class="modal-date">${resultadoMatch[0].time}</span></h5>
                <h5>Fecha: <span class="modal-date">${resultadoMatch[0].fullDay}</span></h5>
            </div>
            <h5>Lugar: <span class="modal-date">${locationMatch[0].name}</span></h5>
            <h5 data-toggle="collapse" data-target="#iframe-map">Dirección: <u><span class="modal-date">${locationMatch[0].address}</span></u></h5>
            <div id="iframe-map" class="embed-responsive embed-responsive-21by9 collapse">
            <iframe class="border" src="${locationMatch[0].map}"></iframe>
            </div>
            <br>
            <div id="tema-${matchId}" class="text-center foro-btn" data-dismiss="modal"><u>Ir al foro de este partido</u></div>
        </div>
        `
    };
});

$(window).on('load', function () {
    // Animate loader off screen
    $(".pre-loader").fadeOut("slow");
});