const Base = require('./base');

const fsp = require('fs/promises');

module.exports = class Playlist2TextCommand extends Base {
    constructor() {
        super({
            name: 'pl2txt',
            description: 'Get playlist tracks and save them to text file',
            args: [ 'PLAYLIST_ID' ]
        });
    }

    async run(api, args) {
        const tracks = await api.getPlaylistTracks(args[0]);

        const formattedTracks = tracks.map(track => {
            if (!track.name.length) return null;

            return `${track.artists.map(a => a.name).join(', ')} - ${track.name}`;
        }).filter(Boolean);

        api.logger('log', 'Total', formattedTracks.length, 'track(s)');
        api.logger('log', 'Write em to txt');

        await fsp.writeFile(`playlist_${args[0]}.txt`, formattedTracks.join('\n'));
    }
}