(function ($) {
  $(function () {
    var po = {};
    po.page = $("#page");
    po.page.animate({ "opacity": 1 }, 500);

    function calculateExperience() {
      var startDate = new Date(1998, 5, 1);
      var currentDate = new Date();
      
      var years = currentDate.getFullYear() - startDate.getFullYear();
      var months = currentDate.getMonth() - startDate.getMonth();
      var days = currentDate.getDate() - startDate.getDate();

      if (days < 0) {
        months--;
        var daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        days += daysInPrevMonth;
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      var experienceText = years + "yrs";
      if (months > 0) {
        experienceText += ", " + months + "mo";
      }
      if (days > 0) {
        experienceText += ", " + days + "d";
      }

      return experienceText;
    }

    var experienceElement = document.getElementById('dynamic-experience');
    if (experienceElement) {
      experienceElement.textContent = calculateExperience();
    }
  });
})(jQuery);



