type LoginRedirectOptions = {
  loginUrl?: string;
  returnUrl: string;
  absoluteReturnUrl?: boolean;
  navigate: (url: string) => void;
};

export const createLoginRedirect = ({
  loginUrl,
  returnUrl,
  absoluteReturnUrl = true,
  navigate,
}: LoginRedirectOptions) => {
  const state = { redirecting: false };

  const redirectToLogin = () => {
    if (!loginUrl || state.redirecting) return;

    const originalUrl = new URL(returnUrl);
    const isRootRelativeUrl =
      loginUrl.startsWith('/') && !loginUrl.startsWith('//') && !loginUrl.includes('\\');
    if (loginUrl.startsWith('/') && !isRootRelativeUrl) return;

    const url = isRootRelativeUrl ? new URL(loginUrl, originalUrl.origin) : new URL(loginUrl);
    if (url.origin === originalUrl.origin && url.pathname === originalUrl.pathname) {
      return;
    }
    const targetReturnUrl = absoluteReturnUrl
      ? returnUrl
      : `${originalUrl.pathname}${originalUrl.search}${originalUrl.hash}`;
    url.searchParams.set('returnUrl', targetReturnUrl);

    state.redirecting = true;
    try {
      navigate(url.href);
    } catch {
      state.redirecting = false;
    }
  };

  return {
    redirectToLogin,
    isLoginRedirecting: () => state.redirecting,
  };
};
