declare function universalWebpack(config: Object, settings: Object): any;
declare module universalWebpack {}
declare module "universal-webpack" {
    export = universalWebpack;
}
declare module "universal-webpack/server" {
    export = universalWebpack;
}

declare module "*.json" {
    const value: any;
    export default value;
}