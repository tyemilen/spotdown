const fsp = require('fs/promises');

const Base = require('./base');
const providers = require('../providers');

module.exports = class PlaylistFromTextCommand extends Base {
    constructor() {
        super({
            name: 'playlistfromtext',
            description: 'Download playlist from text file',
            args: [ 'FILE_PATH', 'SAVE_DIRECTORY' ]
        });
    }

    async run(api, args) {
        const tracks = await fsp.readFile(args[0]).then(r => r.toString());
        const formattedTracks = tracks.split('\n').map(x => ({ save: x.replace(/\s+/g, '_').replace(/[/\\?%*:|"<>]/g, '-'), search: `${x} (audio)` }));

        api.logger('log', 'Total', formattedTracks.length, 'track(s)');

        for (const track of formattedTracks) {
            await providers.youtube(track.search, track.save, args[1]);
        }
    }
}