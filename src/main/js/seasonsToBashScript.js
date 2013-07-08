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
        network: '-N'
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

    function cleanNewlineAndExtraWhitespaceFrom(str) {
        return str.replace(/[\n]/g, '').replace(/\s+/g, ' ');
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

    function episodeToCommand(episode, options) {
        var seID = episode.seID;

        episode = mapMap(episode, cleanAndWrapInQuotes);
        options = mapMap(options, cleanAndWrapInQuotes);

        var tagsArguments = [];

        tagsArguments.push(addOptionIfSet('season', episode));
        tagsArguments.push(addOptionIfSet('episode', episode));
        tagsArguments.push(addOptionIfSet('title', episode));
        tagsArguments.push(addOptionIfSet('director', episode));
        tagsArguments.push(addOptionIfSet('writer', episode));
        tagsArguments.push(addOptionIfSet('productionCode', episode));

        tagsArguments.push(mp4TagsArguments.shortDescription);
        tagsArguments.push(episode.description);

        tagsArguments.push(addOptionIfSet('show', options));
        tagsArguments.push(addOptionIfSet('picture', options));
        tagsArguments.push(addOptionIfSet('network', options));

        tagsArguments.push(seID + '.m4v');

        return 'mp4tags ' + _.without(tagsArguments, undefined).join(' ');
    }

    global.convertToBashScript = function (seasons, options) {
        var commands = [];

        options = options || {};

        if (options.exec) {
            commands.push('#!/bin/sh');
        }

        _.each(seasons, function (season) {
            _.each(season, function (episode) {
                commands.push(episodeToCommand(episode, options));
            });
        });

        return commands.join('\n');
    };

}(this));
