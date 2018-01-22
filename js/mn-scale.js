// returns an array of intervals by applying a scale and alterations

buildScaleIntervals = function(scaleName, alterations)
{
  // gets the scale intervals
  var intervals = Tonal.Scale.intervals(scaleName);

  // apply alterations
  if (alterations && alterations.length > 0)
  {
    for (var a of alterations)
    {
      var degree = Math.abs(a);
      var offset = Math.sign(a) > 0 ? "2m" : "-2m";

      if (degree <= intervals.length)
      {
        intervals[degree-1] = Tonal.transpose(intervals[degree-1], offset);
      }
    }
  }
  return intervals;
}

computeScaleScore = function(scaleName, intervalsToMatch, offset)
{
  // Get tonal intervals
  var scaleIntervals = Tonal.Scale.intervals(scaleName);
  var intervals = [0,0,0,0,0,0,0,0,0,0,0,0];
  var currentIndex = offset;
  intervals[currentIndex] = 1;
  scaleIntervals.forEach(function(interval)
  {
    intervalIndex = Tonal.Interval.semitones(interval) + offset;
    intervals[intervalIndex % 12] = 1;
  });

  var score = 0;
  var base = 0;

  for (var index = 0; index < intervalsToMatch.length; index++)
  {
      if (intervalsToMatch[index] === 1)
      {
        score+= intervals[index] === 1 ? 1 : -1;
        base += 1;
      }
  }
  return score/base;
}

// try to detect the scale name from a list of note indexes

matchScaleListFromIndexes = function(indexes, scaleList)
{
  //  console.log(indexes);

    var bestScore = 0;
    var winnerList = [];

    scaleList.forEach(function(scaleName)
    {
      for (var offset = 0; offset < 12; offset++)
      {
        score = computeScaleScore(scaleName, indexes , offset);
        if (score > bestScore)
        {
          bestScore = score;
          winnerList = [];
        }

        if (score === bestScore)
        {
          winnerList.push("" + Tonal.transpose('c',Tonal.Interval.fromSemitones(offset)) + " " + scaleName);
        }
      }
    })

    var result =
    {
      score_ : bestScore,
      scaleList_ : winnerList
    };
    return result;
}

scalesFromIndexes = function(indexes)
{
  // First try with a reduced set. If we don't find it within it, expand to all known scales
//  var reducedSet =  ["major", "minor", "harmonic minor", "dorian", "phrygian", "lydian"];
//  var result = matchScaleListFromIndexes(indexes, reducedSet);
//  return result.score_ == 1
//    ? result
//    : matchScaleListFromIndexes(indexes, Tonal.scale.names());
   return matchScaleListFromIndexes(indexes, Tonal.scale.names());
}

// Attempts to order the scale list so that the ones contaning the firt note
// are presented first

filterScaleResult = function(result, firstNote)
{
  var filtered = [];
  result.scaleList_.forEach(function(scale)
  {
    if (scale[0].toLowerCase() == firstNote[0].toLowerCase())
    {
      filtered.push(scale);
    }
  });
  if (filtered.length != 0)
  {
    result.scaleList_ = filtered;
  }
  return result;
}

// try to detect possible scales from a list of notes

scalesFromNotes = function(noteNameList)
{
  var indexes = [0,0,0,0,0,0,0,0,0,0,0,0];

  noteNameList.forEach(function(noteName)
  {
    indexes[Tonal.Note.chroma(noteName)] = 1;
  });
  return filterScaleResult(scalesFromIndexes(indexes), noteNameList[0]);
}

// try to detect the scale name from a list of chord names

scalesFromChords = function(chordNameList)
{
  var indexes = [0,0,0,0,0,0,0,0,0,0,0,0];
  chordNameList.forEach(function(chordName)
  {
    var chordIndexes = Tonal.Chord.notes(chordName).map((note) => Tonal.Note.chroma(note));
    chordIndexes.forEach(function(index)
    {
      indexes[index] = 1;
    })
  })

  return filterScaleResult(scalesFromIndexes(indexes), chordNameList[0]);
}
