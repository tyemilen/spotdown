const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');
const ProgressBar = require('progress');

const util = require('../util');

const ytConfig = fs.existsSync('../../yt.json') ? require('../../yt.json') : {};

const authorized = !!ytConfig.cookie?.length;
let warned = false;

module.exports = async function (query, saveName, saveDirectory = '.') {
    let headers = {};

    if (!authorized && !warned) {
        warned = true;
        util.logger('youtube', 'warn', 'Youtube does not authorized (read README.md)');
    } else {
        headers = {
            Cookie: ytConfig.cookie,
            Authorization: ytConfig.auth
        }
    }

    const search = await ytsr(query, {
        pages: 1,

    }).catch(_ => null);

    if (!search?.items?.length) {
        util.logger(`${query} not found`);
        return null;
    }

    const url = search.items[0].url;

    const info = await ytdl.getBasicInfo(url).catch(_ => null);

    if (!info) {
        util.logger('youtube', 'error', `Something went wrong with ${url}/${query}`);
        return;
    }

    const hasAudio = info.formats.find(f => f.mimeType.indexOf('audio') != -1);
    
    if (!hasAudio) {
        util.logger('youtube', 'error', `${url}/${query} doesnt have audio format`);

        return;
    }

    const stream = ytdl(url, {
        quality: 'highestaudio',
        requestOptions: {
            ...headers
        }
    });

    stream.on('info', (_, format) => {
        if (!parseInt(format.contentLength)) {
            util.logger('youtube', 'error', `Invalid content length ${url}/${query}`);
            stream.destroy();

            return;
        }

        const fileStream = fs.createWriteStream(path.join(saveDirectory, saveName + '.webm'));

        const progressBar = new ProgressBar(`${query} :percent [:bar] :etas`, {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: parseInt(format.contentLength)
        });

        stream.pipe(fileStream);

        stream.on('data', chunk => {
            progressBar.tick(chunk.length);
        });
    });
}