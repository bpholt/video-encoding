(function (global, $) {
    'use strict';

    function interpolate(s, data) {
        for(var variable in data) {
            if (data.hasOwnProperty(variable)) {
                s = s.replace(new RegExp('{' + variable + '}','g'), data[variable]);
            }
        }

        return s;
    }

    function zeroPad(n) {
        return n < 10 ? '0' + n : n;
    }

    function episodeToString() {
        return interpolate('{seID}*{title}*{originalAirDate}*{productionCode}*{description}', this);
    }

    function removeFootnotes(episode) {
        var key;
        for (key in episode) {
            if (episode.hasOwnProperty(key) && typeof episode[key] === 'string') {
                episode[key] = episode[key].replace(/\[[^\]]*\]/g, '');
            }
        }
        return episode;
    }

    function episodeCurrier(seasonNumber) {
        return function (i, e) {
            var $e = $(e),
                episode = {},
                $cells = $e.find('th, td').map(function (i, e) { return $(e); }),
                episodeNumber = $cells[1].text(),
                key;

            episode.season = seasonNumber;
            episode.episode = episodeNumber;
            episode.seID = 'S' + zeroPad(seasonNumber) + 'E' + zeroPad(episodeNumber);
            episode.title = $cells[2].text().replace(/"/g, '');
            episode.director = $cells[3].text();
            episode.writer = $cells[4].text();
            episode.originalAirDate = $cells[5].find('.bday').text();
            episode.productionCode = $cells[6].text();
            episode.description = $e.next().find('.description').text();
            episode.toString = episodeToString;

            removeFootnotes(episode);

            return episode;
        };
    }

    function arrayToString() {
        return this.map(function () { return this.toString(); }).get().join('\n');
    }

    function season(i, e, options) {
        var episodes = $(e).find('tr.vevent').map(episodeCurrier(options.season ? options.season : i + 1));
        episodes.toString = arrayToString;
        return episodes;
    }

    function init(options) {
        var options = options || {},
            seasons = $('table.wikitable.plainrowheaders').map(function (i, e) {
                return season(i, e, options);
            });
        seasons.toString = arrayToString;
        return seasons;
    }

    global.wikiscrape = init;
}(this, jQuery));
