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

        $('#nav-bar').removeClass('nav-activo');

        transition('#index');

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

    function transition(toPage) {
        var toPage = $(toPage);
        var fromPage = $('.pages .activo');
        if(toPage.hasClass('activo') || toPage === fromPage) {
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
    
    function displayMatches(){

        fixture.forEach(match => {
            $('#fixture').append(`
            <!-- 1er Partido -->
            <div class="detalle-partido-container">
                <a class="detalle-partido" href="#fixture-detalle">
                    <div class="fixture-partido">
                        <img class="img-club left" src="${match.team1img}" alt="">
                        <p class="versus">${match.team1}</p>
                        <p class="versus">-</p>
                        <p class="versus">${match.team2}</p>
                        <img class="img-club right" src="${match.team2img}" alt="">
                    </div>
                </a>
            </div>
            `)
        })
        
    }
    function displayTeams(){

        teams.forEach(team => {
            $('#equipos').append(`
            <div class="equipos-item mt-3 mx-auto">
                <span class="equipos-titulo">${team.team_name}</span>
                <img class="equipos-img" src="${team.team_logo_img}" alt="${team.team_name}">
            </div>
            `)
        })

    }
    function displayLocations(){

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

});