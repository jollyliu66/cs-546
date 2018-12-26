jQuery(document).ready(function ($) {
    $(".clickable-row").click(function () {
        window.location = $(this).data("href");
    });
    $("#viewWorkout").click(function () {
        $.ajax({
            url: "/WorkoutActivity/view/",
            method: 'get',
            data: $("#workout-activity").serialize(),
            success: function (showactivities) {
              
                $("#resultDiv").html((showactivities));
            }
        })
    });

 
    
});
