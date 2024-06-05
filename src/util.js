module.exports = {
    logger: (name, type, ...args) => {
        console[type](`[${name}/${type.toUpperCase()}]:`, ...args);
    }
}