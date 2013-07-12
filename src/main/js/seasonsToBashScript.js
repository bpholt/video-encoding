(function (global) {
    'use strict';

    var mp4TagsArguments = {
        season: '-n',
        episode: '-M',
        title: '-s',
        director: '-a',
        writer: '-w',
        productionCode: '-o',
        shortDescription: '-m',
        show: '-S',
        picture: '-P',
        network: '-N',
        mediaType: '-i',
        hd: '-H',
        longDescription: '-l'
    };

    function mapMap(m, f) {
        var k, out = {};
        for (k in m) {
            if (m.hasOwnProperty(k)) {
                out[k] = f(m[k]);
            }
        }
        return out;
    }

    function makeSmartQuotes(str) {

        var left = true, calcQuoteIdx = function (str) {
                return str.indexOf('"');
            },
            quoteIdx;

        str = str.replace(/'/g, '’');

        while (-1 != (quoteIdx = calcQuoteIdx(str))) {
            str = str.substr(0, quoteIdx) + (left ? '“' : '”') + str.substr(quoteIdx + 1);
            left = !left;
            quoteIdx = calcQuoteIdx(str);
        }

        return str;
    }

    function cleanNewlineAndExtraWhitespaceFrom(str) {
        str = makeSmartQuotes(str);
        return str.replace(/[\n]/g, '').replace(/\s+/g, ' ').replace(/\s+$/g,'');
    }

    function cleanAndWrapInQuotes(str) {
        return typeof str === 'string' ? ['"', cleanNewlineAndExtraWhitespaceFrom(str), '"'].join('') : str;
    }

    function addOptionIfSet(propertyName, options) {
        var tagsArguments;
        if (options.hasOwnProperty(propertyName)) {
            tagsArguments = [];
            tagsArguments.push(mp4TagsArguments[propertyName]);
            tagsArguments.push(options[propertyName]);
        }

        return undefined === tagsArguments ? undefined : tagsArguments.join(' ');
    }

    function shortDescriptionThatHasBeenIntelligentlyTruncated(s) {
        if (s.length > 255) {
            s = s.substr(0, 255);
            return s.substr(0, s.lastIndexOf('.') + 1);
        } else {
            return s;
        }
    }

    function episodeToCommand(episode, options) {
        var seID = episode.seID;

        episode.shortDescription = shortDescriptionThatHasBeenIntelligentlyTruncated(episode.description);

        episode = mapMap(episode, cleanAndWrapInQuotes);
        options = mapMap(options, cleanAndWrapInQuotes);

        var tagsArguments = [];

        tagsArguments.push(addOptionIfSet('season', episode));
        tagsArguments.push(addOptionIfSet('episode', episode));
        tagsArguments.push(addOptionIfSet('title', episode));
        tagsArguments.push(addOptionIfSet('director', episode));
        tagsArguments.push(addOptionIfSet('writer', episode));
        tagsArguments.push(addOptionIfSet('productionCode', episode));

        tagsArguments.push(addOptionIfSet('shortDescription', episode));

        if (episode.description !== episode.shortDescription) {
            tagsArguments.push(mp4TagsArguments.longDescription);
            tagsArguments.push(episode.description);
        }

        tagsArguments.push(addOptionIfSet('mediaType', options));

        tagsArguments.push(mp4TagsArguments.hd);
        tagsArguments.push(options.hd ? 1 : 0);

        tagsArguments.push(addOptionIfSet('show', options));
        tagsArguments.push(addOptionIfSet('picture', options));
        tagsArguments.push(addOptionIfSet('network', options));

        tagsArguments.push(seID + '.m4v');

        return 'mp4tags ' + _.without(tagsArguments, undefined).join(' ');
    }

    function pictureOption(options, i) {
        if (_.isArray(options.picture)) {
            return $.extend({}, options, {picture: options.picture[i]})
        }

        return options;
    }

    global.convertToBashScript = function (seasons, options) {
        var commands = [];

        options = options || {};

        options = $.extend({
            hd: true,
            mediaType: 'tvshow'
        }, options);

        if (options.exec) {
            commands.push('#!/bin/sh');
        }

        _.each(seasons, function (season, i) {
            _.each(season, function (episode) {
                commands.push(episodeToCommand(episode, pictureOption(options, i)));
            });
        });

        return commands.join('\n');
    };

}(this));
