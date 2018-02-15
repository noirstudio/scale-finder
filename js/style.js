$( document ).ready(function() {




  $('#form__input').keypress(function(){

    var windowWidth = $(window).width();


    if (windowWidth < 600)
    {
      // hide footer on mobile device
      $(".footer").fadeOut();
    }
    else
    {
      var targetHeight = (windowWidth > 900) ? "40vh": "35vh";
      var typeSize = (windowWidth > 900) ? "130%": "100%";

      $('#header').animate ({
        height: targetHeight
      },{
        duration:300
      }
      );


      $('#heading-primary--main').animate({
        fontSize: typeSize,
        marginTop:'5rem',
        width:'50%'
      },{
        duration : 300
      }
    }

  );

    //}

  });



  var currentScrollPosition = 0;
$(document).scroll(function(){
    currentScrollPosition = $(this).scrollTop();
});

$("#chords").focus(function(){
    $(document).scrollTop(currentScrollPosition);
});






});
