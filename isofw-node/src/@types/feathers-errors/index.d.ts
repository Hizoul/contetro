declare function errors(): any;
declare module errors {}
declare module "@feathersjs/errors/handler" {
    export = errors;
}
declare module "@feathersjs/socketio" {
    export = errors;
}
declare module "@feathersjs/express/rest" {
    export = errors;
}