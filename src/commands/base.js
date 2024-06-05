module.exports = class Base {
    constructor({ name, description, args }) {
        this.name = name;
        this.description = description;
        this.args = args;
    }

    help() {
        return `\t${this.name} ${this.args.join(' ')}\n\t--- ${this.description}\n`
    }

    // virtual
    async run(api, args) {}

    exec(api, args) {
        if (args.length < this.args.length) {
            console.log(this.help());

            return null;
        }

        return this.run(api, args);
    }
}