import { createLoginRedirect } from './createLoginRedirect';

// Capture the entry URL before React Router can change the current location.
const loginRedirect = createLoginRedirect({
  loginUrl: __AUTH_LOGIN_URL__,
  returnUrl: window.location.href,
  absoluteReturnUrl: __AUTH_RETURN_URL_ABSOLUTE__,
  navigate: (url) => window.location.replace(url),
});

export const { redirectToLogin, isLoginRedirecting } = loginRedirect;
