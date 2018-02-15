//
// Yeah, I know...
//

var useChordInput = true;
var restrictRootNote = true;
var parser;
var lastResult;
var assumeMobile;

function displayError(message)
{
  var container = $(".result__container");
  container.empty();
  $(".heading-error").text(message);
  $(".toggleRoot").hide();
 // display result
  $(".section-result").css("display","block").hide().fadeIn();
  $(".result__mainText").css("display","block").hide().fadeIn();
  if (assumeMobile)
  {
    $(".footer").hide();
  }
  else {
    $(".footer").css("position","absolute");
  }
}
//
// Display the list of scales in the page
//

function displayResults(scaleList)
{
  var container = $(".result__container");
  container.empty();

 // hide Error & show root toggle
 $(".result__mainText").css("display","none").fadeOut();
 $(".toggleRoot").show();

 // display result
  $(".section-result").css("display","block").fadeIn();

  if (assumeMobile)
  {
    $(".footer").hide();
  }
  else {
    $(".footer").css("position","static");
  }

  container.hide().fadeIn();
  scaleList.forEach(function(scale)
  {
    var splitPoint = scale.indexOf(' ');
    var rootName = scale.substr(0,splitPoint);
    var scaleName = scale.substr(splitPoint +1);

    var scaleNotes = Tonal.Scale.notes(rootName, scaleName).join(", ");

    var boxDiv = $('<div />', {
      class: 'result__box'
    });

    var rootDiv =  $('<div />', {
      class: 'result__root-note',
      text: rootName
    });

    var scaleDiv =  $('<div />', {
      class: 'result__text-name',
      text: scaleName
    });

    var noteDiv = $('<div />', {
      class: 'result__scale-notes',
      text: scaleNotes
    });
    boxDiv.append(rootDiv, scaleDiv, noteDiv);
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
    : "Separate notes by a comma i.e: d#, db, c, ..";

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

function keyHandler()
{
  if (assumeMobile)
  {

    $('#form__input').focus(function(){
      var offset = $(this).offset();
      $('html, body').animate({
          scrollTop: offset.top,
          scrollLeft: offset.left
      });
    });
  }
  evaluateInput(false);
}

//
// -- Parses the input and display results
//
function evaluateInput(forceDisplay)
{
  var valueForm = $( ".form__input" ).val().trim();
  if (valueForm.length == 0) {
    lastResult = "";
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
      lastResult = "";
      displayError("Oh snap! I don't understand what you typed 𝄇 ");
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
  $( ".form__input" ).keyup(() => { keyHandler(); });

  $(".toggleRoot__input").change(function() { restrictRootNote = this.checked;   onOptionChanged() });

  $("#chords").click(() => selectInputType('chords'));
  $("#notes").click(() => selectInputType('notes'));

  $(".form").submit(() => { event.preventDefault(); $( ".form__input" ).blur();});
  // select default input type
  selectInputType('notes');

  assumeMobile = $(window).width() < 600;
});
