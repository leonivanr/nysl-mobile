$('#fixture').hide();
$('#fixture-detalle').hide();
$('#equipos').hide();
$('#sedes').hide();
$('#posiciones').hide();

$('#boton-posiciones').click(function () {
    $('#main').fadeOut();
    $('#posiciones').fadeIn();
})
$('#boton-fixture').click(function () {
    $('#main').fadeOut();
    $('#fixture').fadeIn();
})
$('#boton-sedes').click(function () {
    $('#main').fadeOut();
    $('#sedes').fadeIn();
})
$('#boton-equipos').click(function () {
    $('#main').fadeOut();
    $('#equipos').fadeIn();
})
$('.nav-logo').click(function () {
    let hash = $(location).attr('hash');
    $(hash).fadeOut();
    $('#main').fadeIn();
})
$('.link-sedes').click(function () {
    let hash = $(location).attr('hash');
    $(hash).fadeOut('fast');
    $('#sedes').fadeIn();
})
$('.link-fixture').click(function () {
    let hash = $(location).attr('hash');
    $(hash).fadeOut('fast');
    $('#fixture').fadeIn();
})
$('.link-posiciones').click(function () {
    let hash = $(location).attr('hash');
    $(hash).fadeOut('fast');
    $('#posiciones').fadeIn();
})
$('.link-equipos').click(function () {
    let hash = $(location).attr('hash');
    $(hash).fadeOut('fast');
    $('#equipos').fadeIn();
})
$('.detalle-partido').click(function () {
    $('#fixture').fadeOut('fast');
    $('#fixture-detalle').fadeIn();
})
