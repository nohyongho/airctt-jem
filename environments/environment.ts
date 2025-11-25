// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: 'http://51.75.251.104:3000',
  // baseUrl: 'https://admin.coupontalk.info',
  baseUrl: 'http://localhost:3000',
  bucketUrl: 'http://51.75.251.104:3002',
  s3bucketUrl:'https://cttk.s3-ap-southeast-1.amazonaws.com/',
  // s3bucketUrl:'https://ctt-seoul.s3.ap-northeast-2.amazonaws.com/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
