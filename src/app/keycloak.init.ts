import { KeycloakService } from "keycloak-angular";
import {environment} from "src/environments/environment";

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.authServerUrl,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + window.location.pathname + 'assets/silent-check-sso.html',
        //onLoad: 'login-required',
        checkLoginIframe: true,
        pkceMethod: "S256"
      },
      /*shouldAddToken: (request) => {
        console.log('add' + request.headers.keys());
        return true;
      },
      shouldUpdateToken: (request) => {
        console.log('update' + request.headers.keys());
        return true;
      },*/
    });
}
