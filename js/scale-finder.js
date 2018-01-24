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

var useChordInput = true;

function selectInputType(type)
{
  // update the state
  useChordInput = (type === 'chords');

  // update UI to reflect it
  var enabledColor = '#fff';
  var disabledColor = '#646776';

  $("#chords").css('color', useChordInput ? enabledColor : disabledColor);
  $("#notes").css('color', useChordInput ? disabledColor : enabledColor);

  var headingText = "Enter some "+type+" to find out the scale";
  $('#heading-primary--main').text(headingText);

  var placeholderText = useChordInput
    ? "Enter chords separated by a comma i.e: em, a, .."
    : "Separate notes separated by a comma i.e: d#, db, c, ..";

  $('#form__input').attr("placeholder", placeholderText);
  $('#form__input').focus();
}

function clearResults() {
  $(".section-result").fadeOut("fast");
  $(".footer").css("position","absolute");
}

$( document ).ready(function() {
  // prepare the parser
  var parser = peg.generate($( ".grammar").text(), { allowedStartRules: ["note_list", "chord_list"]});

  // input scanner
  var input = $( ".form__input" );
  var lastResult;

  // install text input notification
  input.keyup(function() {

    var valueForm = input.val().trim();
    if (valueForm.length == 0) {
      clearResults();
    }
    else {
      try {
        var rule = useChordInput ? "chord_list" : "note_list";
        result = parser.parse(valueForm, { startRule: rule});
        if (JSON.stringify(result) != JSON.stringify(lastResult))
        {
          lastResult = result;
          scaleList = useChordInput ? scalesFromChords(result) : scalesFromNotes(result);
          buildResults(scaleList.scaleList_);
        }
      } catch (e) {
        clearResults();
        throw e;
      }
    }


  });

  // select chords as default input type
  selectInputType('chords');

  // install input type selection click

  $("#chords").click(() => selectInputType('chords'));
  $("#notes").click(() => selectInputType('notes'));
});
