require('dotenv').config();

const Wrapper = require('./wrapper');
const CLI = require('./cli');

const { PlaylistCommand, Playlist2TextCommand, PlaylistFromTextCommand } = require('./commands');

const cli = new CLI('spotdown', [
    new PlaylistCommand(),
    new Playlist2TextCommand(),
    new PlaylistFromTextCommand()
]);

const api = new Wrapper({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

async function main() {
    let { argv: args } = process;
    args = args.slice(2);

    if (!args.length) {
        cli.help();
        process.exit(0);
    }

    await api.init();

    if (!api.accessToken) {
        console.error('!! Spotify auth failed');
        process.exit(0);
    }
    
    const command = cli.find(args[0]);

    if (!command) {
        console.error('Command not found\n');
        cli.help();
        process.exit(0);
    }

    await command.exec(api, args.slice(1));
}

main();