$(function () {
  var loc = window.location.pathname;
  $('nav').find('a').each(function () {
    $(this).toggleClass('active', $(this).attr('href') == loc);
  });
})
function opcao(id) {
  $('#' + id).css({'background-color':'silver','cursor':'auto','border':'1px solid silver'}).blur();
  $("." + id).css('display', 'block');
}
function cancela(id) {
  $('#' + id).css({'background-color':'#DC3545','cursor':'pointer'});
  $("." + id).css('display', 'none');
}