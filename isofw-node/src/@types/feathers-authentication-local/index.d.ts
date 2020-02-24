declare var localauth: any;
declare module localauth {}
declare module "@feathersjs/authentication-local" {
    export = localauth;
}
declare module "@feathersjs/authentication"