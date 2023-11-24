// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keycloak: {
    authServerUrl:'http://localhost:8083/',
    realm: 'familybuh',
    clientId: 'familybuh-frontend',
  },
  constants: {
    last_exp_currency: "last_exp_currency",
    last_inc_currency: "last_inc_currency",
    last_exp_account: "last_exp_account",
    last_inc_account: "last_inc_account",
    last_exp_category: "last_exp_category",
    last_inc_category: "last_inc_category",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
 import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
