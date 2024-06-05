const util = require("./util");

module.exports = class Wrapper {
    constructor({ clientId, clientSecret }) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this.accessToken = null;
    }

    logger(type, ...args) {
        util.logger('API', type, ...args);
    }

    async init() {
        this.accessToken = await this.getAccessToken();
    }

    async getAccessToken() {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials'
            })
        }).then(r => r.json());

        return response.access_token;
    }

    async getPlaylistTracks(playlistId, limit = 100, offset = 0) {
        let hasMore = true;
        let tracks = [];
        let nextOffset;

        while (hasMore) {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                }
            });

            const data = await response.json();

            hasMore = data.next;
            nextOffset = data.next ? parseInt(data.next.match(/offset=(\d+)/)[1]) : null;

            tracks.push(...data.items.map(item => item.track));

            offset = nextOffset || 0;
            
            this.logger('log', 'Getting tracks from', playlistId, 'offset=', offset);
        }

        return tracks;
    }
}