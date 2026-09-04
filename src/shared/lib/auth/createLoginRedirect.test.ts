import { createLoginRedirect } from './createLoginRedirect';

const loginUrl = 'http://api.example.test/Account/Login?language=ru';
const returnUrl = 'http://localhost:3000/goods-return/invoices/123?source=email&x=1#details';

test('navigates synchronously and preserves the full entry URL and login parameters', () => {
  const navigate = jest.fn();
  const redirect = createLoginRedirect({ loginUrl, returnUrl, navigate });
  expect(redirect.redirectToLogin()).toBeUndefined();
  expect(navigate).toHaveBeenCalledTimes(1);

  const target = new URL(navigate.mock.calls[0][0] as string);
  expect(target.origin).toBe('http://api.example.test');
  expect(target.pathname).toBe('/Account/Login');
  expect(target.searchParams.get('language')).toBe('ru');
  expect(target.searchParams.get('returnUrl')).toBe(returnUrl);
});

test('redirects only once for repeated calls', () => {
  const navigate = jest.fn();
  const redirect = createLoginRedirect({ loginUrl, returnUrl, navigate });
  redirect.redirectToLogin();
  redirect.redirectToLogin();
  redirect.redirectToLogin();
  expect(navigate).toHaveBeenCalledTimes(1);
});

test.each([
  [true, returnUrl],
  [false, '/goods-return/invoices/123?source=email&x=1#details'],
])('uses the requested return URL format when absolute is %s', (absoluteReturnUrl, expected) => {
  const navigate = jest.fn();
  createLoginRedirect({ loginUrl, returnUrl, absoluteReturnUrl, navigate }).redirectToLogin();
  const target = new URL(navigate.mock.calls[0][0] as string);
  expect(target.origin).toBe('http://api.example.test');
  expect(target.searchParams.get('returnUrl')).toBe(expected);
  expect(target.searchParams.get('language')).toBe('ru');
});

test('preserves encoded characters in a relative return URL', () => {
  const navigate = jest.fn();
  createLoginRedirect({
    loginUrl,
    returnUrl: 'https://app.example.test:5000/invoices/%7B123%7D?text=a%26b#photo',
    absoluteReturnUrl: false,
    navigate,
  }).redirectToLogin();
  const target = new URL(navigate.mock.calls[0][0] as string);
  expect(target.searchParams.get('returnUrl')).toBe('/invoices/%7B123%7D?text=a%26b#photo');
});

test('does not redirect when the login address is missing or the page is already the login', () => {
  const navigate = jest.fn();
  const missing = createLoginRedirect({ returnUrl, navigate });
  const onLogin = createLoginRedirect({ loginUrl, returnUrl: loginUrl, navigate });
  missing.redirectToLogin();
  onLogin.redirectToLogin();
  expect(navigate).not.toHaveBeenCalled();
  expect(missing.isLoginRedirecting()).toBe(false);
  expect(onLogin.isLoginRedirecting()).toBe(false);
});

test('suppresses the unload warning before navigation starts and prevents reentrant redirects', () => {
  const navigate = jest.fn(() => {
    expect(redirect.isLoginRedirecting()).toBe(true);
    redirect.redirectToLogin();
  });
  const redirect = createLoginRedirect({ loginUrl, returnUrl, navigate });
  expect(redirect.isLoginRedirecting()).toBe(false);
  redirect.redirectToLogin();
  expect(navigate).toHaveBeenCalledTimes(1);
});

test('restores the unload warning and allows retry if navigation throws', () => {
  const navigate = jest.fn().mockImplementationOnce(() => {
    throw new Error('Navigation failed');
  });
  const redirect = createLoginRedirect({ loginUrl, returnUrl, navigate });
  expect(() => redirect.redirectToLogin()).not.toThrow();
  expect(redirect.isLoginRedirecting()).toBe(false);
  redirect.redirectToLogin();
  expect(navigate).toHaveBeenCalledTimes(2);
  expect(redirect.isLoginRedirecting()).toBe(true);
});
