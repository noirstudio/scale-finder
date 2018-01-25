//
// Yeah, I know...
//

var useChordInput = true;
var restrictRootNote = true;
var parser;
var lastResult;

//
// Display the list of scales in the page
//

function displayResults(scaleList)
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
      text: ''
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

//
// -- selects the search type [ 'chords' or 'notes' ]
//    and update the display accordingly
//

function selectInputType(type)
{
  // update the state
  useChordInput = (type === 'chords');

  // update UI to reflect it
  var enabledColor = '#fff';
  var disabledColor = '#646776';

  $("#chords").css('color', useChordInput ? enabledColor : disabledColor);
  $("#notes").css('color', useChordInput ? disabledColor : enabledColor);

  var headingText = "Enter "+type+" to find scales they belong to";
  $('#heading-primary--main').text(headingText);

  var placeholderText = useChordInput
    ? "Enter chords separated by a comma i.e: em, a, .."
    : "Separate notes separated by a comma i.e: d#, db, c, ..";

  $('#form__input').attr("placeholder", placeholderText);

  onOptionChanged();
}

//
// -- option changed: set the focus back and re-evaluate input
//

function onOptionChanged()
{
  $('#form__input').focus();
  evaluateInput(true);
}

//
// -- Clears the result list
//

function clearResults()
{
  $(".section-result").fadeOut("fast");
  $(".footer").css("position","absolute");
}

//
// -- Parses the input and display results
//

function evaluateInput(forceDisplay)
{
  var valueForm = $( ".form__input" ).val().trim();
  if (valueForm.length == 0) {
    clearResults();
  }
  else {
    try {
      var rule = useChordInput ? "chord_list" : "note_list";
      result = parser.parse(valueForm, { startRule: rule});
      if ((JSON.stringify(result) != JSON.stringify(lastResult)) || forceDisplay)
      {
        lastResult = result;
        scaleList = useChordInput ? scalesFromChords(result, restrictRootNote) : scalesFromNotes(result, restrictRootNote);
        displayResults(scaleList.scaleList_);
      }
    } catch (e) {
      clearResults();
      throw e;
    }
  }
}

//
// -- Initializes the parser and hook up interface
//

$( document ).ready(function() {
  // prepare the parser
  parser = peg.generate($( ".grammar").text(), { allowedStartRules: ["note_list", "chord_list"]});

  // install all event handler
  $( ".form__input" ).keyup(() => { evaluateInput(false) });

  $(".toggleRoot__input").change(function() { restrictRootNote = this.checked;   onOptionChanged() });

  $("#chords").click(() => selectInputType('chords'));
  $("#notes").click(() => selectInputType('notes'));

  // select default input type
  selectInputType('notes');
});
