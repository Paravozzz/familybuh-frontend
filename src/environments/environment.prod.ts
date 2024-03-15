export const environment = {
  production: true,
  keycloak: {
    authServerUrl:'http://localhost:8083/',
    realm: 'familybuh',
    clientId: 'familybuh-frontend',
  },
  constants: {
    last_expense_currency: "last_expense_currency",
    last_expense_account_id: "last_expense_account_id",
    last_expense_category_id: "last_expense_category_id",

    last_income_currency: "last_income_currency",
    last_income_account_id: "last_income_account_id",
    last_income_category_id: "last_income_category_id",

    last_transfer_currency: "last_transfer_currency",
    last_transfer_expense_account_id: "last_transfer_expense_account_id",
    last_transfer_income_account_id: "last_transfer_income_account_id",

    last_exchange_expense_currency: "last_exchange_expense_currency",
    last_exchange_income_currency: "last_exchange_income_currency",
    last_exchange_account_name: "last_exchange_account_name"
  }
};
