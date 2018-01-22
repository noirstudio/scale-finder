function buildResults(scaleList)
{
  var container = $(".result__container");
  container.empty();

 // display result
  $(".section-result").css("display","block").hide().fadeIn();
  $(".footer").css("position","static");


  scaleList.forEach(function(scale)
  {
    var splitPoint = scale.indexOf(' ');
    var rootName = scale.substr(0,splitPoint);
    var scaleName = scale.substr(splitPoint +1);

    var boxDiv = $('<div />', {
      class: 'result__box'
    });

    var percentDiv = $('<div />', {
      class: 'result__percentage',
      text: '100%'
    });

    var rootDiv =  $('<div />', {
      class: 'result__root-note',
      text: rootName
    });

    var scaleDiv =  $('<div />', {
      class: 'result__text-name',
      text: scaleName
    });

    boxDiv.append(percentDiv, rootDiv, scaleDiv);
    container.append(boxDiv);
  });
}

$( document ).ready(function() {
  // prepare the parser
  var parser = peg.generate($( ".grammar").text());

  // input scanner
  var input = $( ".form__input" );


  // install text input notification
  input.keyup(function() {

    var valueForm = input.val();

    try {
      result = parser.parse(valueForm);
      scaleList = scalesFromChords(result);
      buildResults(scaleList.scaleList_);
    } catch (e) {

    }

    if (valueForm.length == 0){
      $(".section-result").fadeOut("fast");
      $(".footer").css("position","absolute");
    }
  });

});
