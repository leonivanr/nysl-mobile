$(document).ready(function () {
    $('.main').css('display','flex');

    $('.main a').click(function (e) {
        $('.main').css('display','none');
        let aux = $(e.target);
        let proximaPagina;
        if(typeof aux.parent()[0].hash !== "undefined") {
            proximaPagina = aux.parent()[0].hash;
        } else {
            proximaPagina = e.target.hash;
        }
         
        // $('#main').removeClass('activo');
        $(proximaPagina).addClass('activo');
        $('#nav-bar').css('display','flex');

    })
    $('#logo-link').click(function (e) {

        $('.pages .activo').removeClass('activo');
        // $('#main').removeClass('activo');
        $('#nav-bar').css('display','none');
        $('.main').css('display','flex');

    })
    //Detectar proxima pagina y ocultar.
    $('#nav-bar a').click(function (e) {
        e.preventDefault();
        let aux = $(e.target);
        if(typeof aux.parent()[0].hash !== "undefined") {
            proximaPagina = aux.parent()[0].hash;
        } else {
            proximaPagina = e.target.hash;
        }
        $('.pages .activo').removeClass('activo');
        $(proximaPagina).addClass('activo');
    })

});