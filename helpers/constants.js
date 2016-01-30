function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}


define("PI", "3.14");
define("VIDEOS_PER_PAGE", 5);
