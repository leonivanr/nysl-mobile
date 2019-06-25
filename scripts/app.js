$('#fixture').hide();
$('#fixture-detalle').hide();
$('#equipos').hide();
$('#sedes').hide();
$('#posiciones').hide();

$('#boton-posiciones').click(function () {
    $('#main').hide();
    $('#posiciones').fadeIn('slow');
})
$('#boton-fixture').click(function () {
    $('#main').hide();
    $('#fixture').fadeIn('slow');
})
$('#boton-sedes').click(function () {
    $('#main').hide();
    $('#sedes').fadeIn('slow');
})
$('#boton-equipos').click(function () {
    $('#main').hide();
    $('#equipos').fadeIn('slow');
})
$('.nav-logo').click(function () {
    let hash = $(location).attr('hash');
    $(hash).hide();
    $('#main').fadeIn('slow');
})
$('.link-sedes').click(function () {
    let hash = $(location).attr('hash');
    $(hash).hide();
    $('#sedes').fadeIn('slow');
})
$('.link-fixture').click(function () {
    let hash = $(location).attr('hash');
    $(hash).hide();
    $('#fixture').fadeIn('slow');
})
$('.link-posiciones').click(function () {
    let hash = $(location).attr('hash');
    $(hash).hide();
    $('#posiciones').fadeIn('slow');
})
$('.link-equipos').click(function () {
    let hash = $(location).attr('hash');
    $(hash).hide();
    $('#equipos').fadeIn('slow');
})
$('.detalle-partido').click(function () {
    $('#fixture').hide();
    $('#fixture-detalle').fadeIn('slow');
})
