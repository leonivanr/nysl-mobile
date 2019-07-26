$(document).ready(function () {
    const fixture = info.matches;
    const teams = info.teams;
    const locations = info.locations;

    displayMatches();
    displayTeams();
    displayLocations();
    //Ir al id.
    $('.main a').click(function (e) {
        let aux = $(e.target);
        let proximaPagina;
        if (typeof aux.parent()[0].hash !== "undefined") {
            proximaPagina = aux.parent()[0].hash;
        } else {
            proximaPagina = e.target.hash;
        }
        transition(proximaPagina);
        $('#nav-bar').addClass('nav-activo');

    })
    //Volver al menu inicial
    $('#logo-link').click(function (e) {

        transition('#index');
        $('#nav-bar').removeClass('nav-activo');

    })
    //Detectar proxima pagina y ocultar.
    $('#nav-bar a').click(function (e) {
        e.preventDefault();
        let aux = $(e.target);
        if (typeof aux.parent()[0].hash !== "undefined") {
            proximaPagina = aux.parent()[0].hash;
        } else {
            proximaPagina = e.target.hash;
        }
        transition(proximaPagina);
    })
    $(document).on("click", ".detalle-partido", function () {
        let matchId = $(this).attr('id');
        let resultadoMatch = fixture.filter(x => x.matchID === matchId);
        let locationId = resultadoMatch[0].location_id;
        let locationMatch = locations.filter(x => x.id === locationId);

        $("#body-data").html(
            `
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <br>
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
                <h5>Hora: <span class="modal-date">${resultadoMatch[0].time}</span></h5>
                <h5>Fecha: <span class="modal-date">${resultadoMatch[0].fullDay}</span></h5>
                <h5>Lugar: <span class="modal-date">${locationMatch[0].name}</span></h5>
                <h5>Dirección: <span class="modal-date">${locationMatch[0].address}</span></h5>
                <iframe class="border" src="${locationMatch[0].map}"></iframe>
            </div>
            `
        )
    });

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

    function displayMatches() {

        fixture.filter(x => x.fullDay === "September 1st").forEach(match => {
            $('#domingoUno').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "September 8th").forEach(match => {
            $('#domingoOcho').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "September 15th").forEach(match => {
            $('#domingoQuince').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "September 22nd").forEach(match => {
            $('#domingoVdos').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "September 29th").forEach(match => {
            $('#domingoVnueve').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "October 6th").forEach(match => {
            $('#domingoSeis').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "October 13rd").forEach(match => {
            $('#domingoTrece').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "October 20th").forEach(match => {
            $('#domingoVeinte').append(showM(match));
        })
        fixture.filter(x => x.fullDay === "October 27th").forEach(match => {
            $('#domingoVsiete').append(showM(match));
        })


    }

    function displayTeams() {

        teams.forEach(team => {
            $('#equipos').append(`
            <div class="equipos-item mt-3 mx-auto">
                <span class="equipos-titulo">${team.team_name}</span>
                <img class="equipos-img" src="${team.team_logo_img}" alt="${team.team_name}">
            </div>
            `)
        })

    }

    function displayLocations() {

        locations.forEach(location => {
            $('#sedes .flex-column').append(`
                          <div class="mt-3">

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
        
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
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
        
        </div>
            `)
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
});