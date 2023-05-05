(function ($) {
  $.fn.timepicker = function (options) {
    if (!$(this).is(":empty")) {
      return this;
    }

    var opts = $.extend({}, options);

    var id = $(this).attr("id");
    var hours = "";
    var minutes = "";

    for (var h = 1; h < 13; h++) {
      var hour = h.toString().padStart(2, "0");
      hours = hours + "<option value='" + hour + "'>" + hour + "</option>";
    }

    for (var m = 0; m < 60; m++) {
      var min = m.toString().padStart(2, "0");
      minutes = minutes + "<option value='" + min + "'>" + min + "</option>";
    }

    $(this).addClass("d-flex align-items-center");
    $(this).append(
      "<select class='form-select me-2 hours-dropdown'>" + hours + "</select>"
    );
    $(this).append(":");
    $(this).append(
      "<select class='form-select ms-2 me-3 minutes-dropdown'>" +
        minutes +
        "</select>"
    );
    $(this).append(
      '<div class="btn-group" role="group" aria-label="Basic radio toggle button group">' +
        '   <input type="radio" class="btn-check" name="' +
        id +
        'Meridian" id="' +
        id +
        'MeridianAM" autocomplete="off" checked>' +
        '   <label class="btn btn-outline-primary" for="' +
        id +
        'MeridianAM">AM</label>' +
        '   <input type="radio" class="btn-check" name="' +
        id +
        'Meridian" id="' +
        id +
        'MeridianPM" autocomplete="off">' +
        '   <label class="btn btn-outline-primary" for="' +
        id +
        'MeridianPM">PM</label>' +
        "</div>"
    );

    var that = this;

    if (opts.onChange) {
      $(this)
        .find(".hours-dropdown")
        .change(function (event) {
          var value = $.fn._getValue(that);
          options.onChange(value);
        });
      $(this)
        .find(".minutes-dropdown")
        .change(function (event) {
          var value = $.fn._getValue(that);
          options.onChange(value);
        });
      $(this)
        .find("#" + id + "MeridianAM")
        .change(function (event) {
          var value = $.fn._getValue(that);
          options.onChange(value);
        });
      $(this)
        .find("#" + id + "MeridianPM")
        .change(function (event) {
          var value = $.fn._getValue(that);
          options.onChange(value);
        });
    }

    if (opts.value) {
      $.fn._setValue(that, opts.value);
    }

    if (opts.disabled) {
      $.fn._setDisabled(this);
    }

    return this;
  };

  $.fn._getValue = function (element) {
    var id = $(element).attr("id");

    var selectedHour = $(element).find(".hours-dropdown")[0].value;
    var selectedMinute = $(element).find(".minutes-dropdown")[0].value;
    var selectedMeridian = $(element).find("#" + id + "MeridianAM")[0].checked
      ? "AM"
      : "PM";
    if (!selectedHour || !selectedMinute) {
      return "";
    }
    return selectedHour + ":" + selectedMinute + " " + selectedMeridian;
  };

  $.fn.getValue = function () {
    return $.fn._getValue(this);
  };

  $.fn._setValue = function (element, value) {
    var id = $(element).attr("id");

    if (!value || value.length == 0) {
      $(element).find(".hours-dropdown")[0].value = null;
      $(element).find(".minutes-dropdown")[0].value = null;
      $(element).find("#" + id + "MeridianAM")[0].checked = true;
      return;
    }
    var a = value.split(":");
    var hour = a[0];
    var b = a[1].split(" ");
    var minute = b[0];
    var meridian = b[1];
    $(element).find(".hours-dropdown")[0].value = hour;
    $(element).find(".minutes-dropdown")[0].value = minute;
    if (meridian == "AM") {
      $(element).find("#" + id + "MeridianAM")[0].checked = true;
    } else {
      $(element).find("#" + id + "MeridianPM")[0].checked = true;
    }
  };

  $.fn.setValue = function (value) {
    $.fn._setValue(this, value);
  };

  $.fn._setDisabled = function (element) {
    var id = $(element).attr("id");

    $(element).find(".hours-dropdown").prop("disabled", true);
    $(element).find(".minutes-dropdown").prop("disabled", true);
    $(element)
      .find("#" + id + "MeridianAM")
      .prop("disabled", true);
    $(element)
      .find("#" + id + "MeridianPM")
      .prop("disabled", true);
  };

  $.fn.setDisabled = function () {
    $.fn._setDisabled(this);
  };

  $.fn.setEnabled = function () {
    var id = $(this).attr("id");

    $(this).find(".hours-dropdown").prop("disabled", false);
    $(this).find(".minutes-dropdown").prop("disabled", false);
    $(this)
      .find("#" + id + "MeridianAM")
      .prop("disabled", false);
    $(this)
      .find("#" + id + "MeridianPM")
      .prop("disabled", false);
  };
})(jQuery);
