const Base = require('./base');
const providers = require('../providers');

module.exports = class PlaylistCommand extends Base {
    constructor() {
        super({
            name: 'playlist',
            description: 'Download playlist',
            args: [ 'PLAYLIST_ID', 'SAVE_DIRECTORY' ]
        });
    }

    async run(api, args) {
        const tracks = await api.getPlaylistTracks(args[0]);

        const formattedTracks = tracks.map(t => `${t.artists.map(a => a.name).join(', ')} - ${t.name}`)
            .map(t => ({ save: t.replace(/\s+/g, '_').replace(/[/\\?%*:|"<>]/g, '-'), search: `${t} (audio)` }));

        api.logger('log', 'Total', formattedTracks.length, 'track(s)');

        for (const track of formattedTracks) {
            await providers.youtube(track.search, track.save, args[1]);
        }
    }
}