module.exports = class CLI {
    constructor(name, commands) {
        this.name = name;
        this.commands = commands;
    }

    find(cmdName) {
        return this.commands.find(c => c.name == cmdName);
    }

    help() {
        console.log(`${this.name}\n${this.commands.map(x => x.help()).join('\n')}`);
    }
}