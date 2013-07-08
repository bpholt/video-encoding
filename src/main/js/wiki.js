(function (global, $) {
    "use strict";

    $.extend({
        interpolate: function(s, data) {
            for(var variable in data) {
                s = s.replace(new RegExp('{' + variable + '}','g'), data[variable]);
            }

            return s;
        }
    });

    function zeroPad(n) {
        return n < 10 ? "0" + n : n;
    }

    function episodeToString() {
        return $.interpolate('{seID}*{title}*{originalAirDate}*{productionCode}*{description}', this);
    }

    function episodeCurrier(seasonNumber) {
        return function (i, e) {
            var $e = $(e),
                episode = {},
                $cells = $e.find("th, td").map(function (i, e) { return $(e); });

            episode.seID = "S" + zeroPad(seasonNumber) + "E" + zeroPad($cells[1].text());
            episode.title = $cells[2].text().replace(/"/g, '');
            episode.director = $cells[3].text();
            episode.writer = $cells[4].text();
            episode.originalAirDate = $cells[5].find('.bday').text();
            episode.productionCode = $cells[6].text();
            episode.description = $e.next().find(".description").text();
            episode.toString = episodeToString;

            return episode;
        };
    }

    function season(i, e) {
        var episodes = $(e).find("tr.vevent").map(episodeCurrier(i + 1));
        return  episodes;
    }

    function init() {
        var seasons = $("table.wikitable.plainrowheaders").map(season);
        return  seasons;
    }

    global.wikiscrape = init;
}(this, jQuery));
