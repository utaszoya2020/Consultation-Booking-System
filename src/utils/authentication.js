import jwt from 'jsonwebtoken';

const JWT_KEY = 'jwt';

export const setToken = (token) => {
  localStorage.setItem(JWT_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(JWT_KEY);
};

export const deleteToken = () => {
  localStorage.removeItem(JWT_KEY);
};

export const fetchUser = token => jwt.decode(token);

export const fetchUserId = () => {
    const token = getToken();
    // TODO improve return to error or turn to error page
    if (token === null) return 'student';
    const decodedToken = jwt.decode(token);
    return decodedToken.id;
};

export const fetchUserType = () => {
    const token = getToken();
    // TODO same above
    if (token === null) return 'student';
    const decodedToken = jwt.decode(token);
    return decodedToken.userType;
};

export const isAuthenticated = () => {
  const token = getToken();

  if (!token) return false;

  const decodedToken = jwt.decode(token);
  const expirationTime = decodedToken.exp * 1000;
  const isExpired = Date.now() - expirationTime > 0;

  return !isExpired;
};
