export const environment = {
  production: true,
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
