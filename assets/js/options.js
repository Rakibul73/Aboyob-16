$(document).ready(function () {
  jQuery.fn.drop = function (margin_top_fill) {
    var drop = this;
    drop.stop().animate(
      {
        "margin-top": 48 + 85 - 125 + margin_top_fill + "px",
      },
      500,
      function () {
        drop.hide().css("margin-top", "0px").fadeIn("fast");
      }
    );
    setTimeout(function () {
      drop
        .parent()
        .find(".fill")
        .stop()
        .animate({
          "margin-top": margin_top_fill + "px",
        });
    }, 300);
  };
  var last_value_iSec = 0;
  var last_value_iMin = 0;
  var last_value_iHours = 0;
  var last_value_iDays = 0;
  var first_time = 0;
  jQuery.fn.anim_progressbar = function (aOptions) {
    // def values
    var iCms = 1000;
    var iMms = 60 * iCms;
    var iHms = 3600 * iCms;
    var iDms = 24 * 3600 * iCms;

    // def options
    var aDefOpts = {
      start: new Date().setTime(new Date(2020, 09, 20).getTime()), // now
      finish: new Date().setTime(new Date(2020, 11, 22).getTime() - 12 * iHms), // now + 60 sec
      interval: 100,
      type: "",
    };
    var aOpts = jQuery.extend(aDefOpts, aOptions);
    var Pb = this;

    // each progress bar
    return this.each(function () {
      var iDuration = aOpts.finish - aOpts.start;
      var i = 5;
      // looping process
      var vInterval = setInterval(function () {
        i -= 1000000;
        var iLeftMs = aOpts.finish - new Date(); // left time in MS
        var iElapsedMs = new Date() - aOpts.start, // elapsed time in MS
          iDays = parseInt(iLeftMs / iDms), // elapsed days
          iHours = parseInt((iLeftMs - iDays * iDms) / iHms), // elapsed hours
          iMin = parseInt((iLeftMs - iDays * iDms - iHours * iHms) / iMms), // elapsed minutes
          iSec = parseInt(
            (iLeftMs - iDays * iDms - iMin * iMms - iHours * iHms) / iCms
          ), // elapsed seconds
          iPerc = iElapsedMs > 0 ? (iElapsedMs / iDuration) * 100 : 0; // percentages
        var last_value = $(Pb).find(".bottle_counter").html();

        // display current positions and progress
        if (aOpts.type == "iSec") {
          iPerc = iSec > 0 ? 100 - (iSec / 60) * 100 : 100;
          $(Pb).find(".bottle_counter").html(iSec);
          if (last_value != last_value_iSec)
            $(Pb)
              .find(".drop")
              .drop(500 - iPerc * 3.75);
          last_value_iSec = last_value;
        }
        if (aOpts.type == "iMin") {
          //var iTotalMin = parseInt((iDuration > 60 * iMms ) ? 60 : iDuration / iMms) ;
          iPerc = iMin > 0 ? 100 - (iMin / 60) * 100 : 100;
          $(Pb).find(".bottle_counter").html(iMin);
          if (last_value != last_value_iMin)
            $(Pb)
              .find(".drop")
              .drop(500 - iPerc * 3.75);
          last_value_iMin = last_value;
        }
        if (aOpts.type == "iHours") {
          iPerc = iHours > 0 ? 100 - (iHours / 24) * 100 : 100;
          $(Pb).find(".bottle_counter").html(iHours);
          if (last_value != last_value_iHours)
            $(Pb)
              .find(".drop")
              .drop(500 - iPerc * 3.75);
          last_value_iHours = last_value;
        }
        if (aOpts.type == "iDays") {
          iPerc = iDays > 0 ? (iElapsedMs / iDuration) * 100 : 100;
          $(Pb).find(".bottle_counter").html(iDays);
          if (last_value != last_value_iDays)
            $(Pb)
              .find(".drop")
              .drop(500 - iPerc * 3.75);
          last_value_iDays = last_value;
        }
        if (first_time < 4) {
          $(Pb)
            .find(".fill")
            .animate({
              "margin-top": 500 - iPerc * 3.75 + "px",
            });
          first_time++;
        }
        if (iPerc >= 100 && iLeftMs < 1000) {
          $(Pb).find(".bottle_counter").html("0");
          clearInterval(vInterval);
        }
      }, aOpts.interval);
    });
  };

  var iNow = new Date().setTime(new Date().getTime()); // now plus 5 secs
  var iEnd = new Date().setTime(new Date(2020, 09, 21).getTime()); // now plus 15 secs
  $("#days").anim_progressbar({
    type: "iDays",
  });
  $("#hours").anim_progressbar({
    type: "iHours",
  });
  $("#minutes").anim_progressbar({
    type: "iMin",
  });
  $("#seconds").anim_progressbar({
    type: "iSec",
  });

  /* ================= TWITTER PLUGIN ================= */
  (function ($) {
    $.fn.wt_twitter = function (options) {
      var linkify = function (text) {
        text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
          return (
            '<a class="wt_twitter_post_link_external" href="' +
            s +
            '">' +
            s +
            "</a>"
          );
        });
        text = text.replace(/(^|)@(\w+)/gi, function (s) {
          return (
            '<a class="wt_twitter_post_link_user" href="http://twitter.com/' +
            s +
            '">' +
            s +
            "</a>"
          );
        });
        text = text.replace(/(^|)#(\w+)/gi, function (s) {
          return (
            '<a class="wt_twitter_post_link_search" href="http://search.twitter.com/search?q=' +
            s.replace(/#/, "%23") +
            '">' +
            s +
            "</a>"
          );
        });
        return text;
      };
      return this.each(function () {
        var settings = $.extend(
          {
            user: "",
            posts: 5,
            loading: "Loading tweets..",
          },
          options
        );
        var t = $(this);
        var t_user = t.attr("data-user");
        if (t.attr("data-user")) settings.user = t.attr("data-user");
        if (t.attr("data-posts"))
          settings.posts = parseInt(t.attr("data-posts"));
        if (t.attr("data-loading")) settings.loading = t.attr("data-loading");
        if (
          settings.user.length &&
          (typeof settings.posts === "number" ||
            settings.posts instanceof Number) &&
          settings.posts > 0
        ) {
          t.addClass("wt_twitter");
          if (settings.loading.length)
            t.html(
              '<div class="wt_twitter_loading">' + settings.loading + "</div>"
            );
          $.getJSON("php/twitter.php?user=" + t_user, function (t_tweets) {
            t.empty();
            for (var i = 0; i < settings.posts && i < t_tweets.length; i++) {
              var t_date_str;
              var t_date_seconds = Math.floor(
                (new Date().getTime() - Date.parse(t_tweets[i].created_at)) /
                  1000
              );
              var t_date_minutes = Math.floor(t_date_seconds / 60);
              if (t_date_minutes) {
                var t_date_hours = Math.floor(t_date_minutes / 60);
                if (t_date_hours) {
                  var t_date_days = Math.floor(t_date_hours / 24);
                  if (t_date_days) {
                    var t_date_weeks = Math.floor(t_date_days / 7);
                    if (t_date_weeks)
                      t_date_str =
                        "About " +
                        t_date_weeks +
                        " week" +
                        (1 == t_date_weeks ? "" : "s") +
                        " ago";
                    else
                      t_date_str =
                        "About " +
                        t_date_days +
                        " day" +
                        (1 == t_date_days ? "" : "s") +
                        " ago";
                  } else
                    t_date_str =
                      "About " +
                      t_date_hours +
                      " hour" +
                      (1 == t_date_hours ? "" : "s") +
                      " ago";
                } else
                  t_date_str =
                    "About " +
                    t_date_minutes +
                    " minute" +
                    (1 == t_date_minutes ? "" : "s") +
                    " ago";
              } else
                t_date_str =
                  "About " +
                  t_date_seconds +
                  " second" +
                  (1 == t_date_seconds ? "" : "s") +
                  " ago";
              var t_message =
                '<div class="wt_twitter_post' +
                (i + 1 == t_tweets.length ? ' last"' : '"') +
                ">" +
                linkify(t_tweets[i].text) +
                '<span class="wt_twitter_post_date">' +
                t_date_str +
                "</span>" +
                "</div>";
              t.append(t_message);
            }
            $(".wt_twitter_post").eq(0).fadeIn("slow");
          });
        }
      });
    };
  })(jQuery);

  $(".twitter").wt_twitter();
  var i = 0;

  setInterval(function () {
    $(".wt_twitter_post")
      .eq(i)
      .fadeOut("slow", function () {
        i++;
        if (i == $(".wt_twitter_post").length) {
          i = 0;
        }
        $(".wt_twitter_post").eq(i).fadeIn("slow");
      });
  }, 6000);
});

//TITLE TOOL
var custom_top = 0;
var custom_left = 15;
var fade_time = 0;

ShowTooltip = function (e) {
  var text = $(this).next(".show-tooltip-text");
  if (text.attr("class") != "show-tooltip-text") return false;

  text.fadeIn(fade_time, function () {
    var text_width = text.outerWidth();
    var left = e.clientX + custom_left;
    if (left + text_width > $(window).width())
      left = e.clientX - text_width - custom_left;
    text.css("top", e.clientY + custom_top).css("left", left);
  });

  $(this).on("mousemove", MoveTooltip);
  return false;
};
HideTooltip = function (e) {
  var text = $(this).next(".show-tooltip-text");
  if (text.attr("class") != "show-tooltip-text") return false;

  text.fadeOut(fade_time);

  $(this).off("mousemove");
};

SetupTooltips = function () {
  $(".show-tooltip")
    .each(function () {
      $(this)
        .after(
          $("<span/>")
            .attr("class", "show-tooltip-text")
            .html($(this).attr("title"))
        )
        .attr("title", "");
    })
    .hover(ShowTooltip, HideTooltip);
};

MoveTooltip = function (e) {
  var text = $(this).next(".show-tooltip-text");
  var text_width = text.outerWidth();
  var left = e.clientX + custom_left;
  if (left + text_width > $(window).width())
    left = e.clientX - text_width - custom_left;
  text.css({
    top: e.clientY + custom_top,
    left: left,
  });
};

$(document).ready(function () {
  SetupTooltips();
});

/* ================= IE fix ================= */
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = start || 0, j = this.length; i < j; i++) {
      if (this[i] === obj) {
        return i;
      }
    }
    return -1;
  };
}

/* ================= COLOR SITE ================= */
$(document).ready(function () {
  $("#site_open").click(function () {
    if ($(this).hasClass("active_open")) {
      $("#site_change").animate(
        {
          marginLeft: "0px",
        },
        300
      );
      $("#site_open").removeClass("active_open");
    } else {
      $("#site_open").addClass("active_open");
      $("#site_change").animate(
        {
          marginLeft: "-150px",
        },
        300
      );
    }
  });
});
