export const setClientSideCookie = (
  name: string,
  value: string,
  days?: number,
  path = '/',
) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=${path}`;
};

export const deleteClientSideCookie = (name: string, path = '/') => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
};

export const hasClientSideCookie = (name: string): boolean => {
  return document.cookie.split('; ').some((row) => row.startsWith(`${name}=`));
};

export const getClientSideCookie = (name: string) => {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return { value: cookieValue };
};
