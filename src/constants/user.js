import ms from 'ms';

export const emailRegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export const passwordRegExp = /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/;

// export const ACCESS_TOKET_LIFETIME = 15 * 60 * 1000;
export const ACCESS_TOKET_LIFETIME = ms('15m');

// export const REFRESH_TOKEN_LIFETIME = 24 * 60 * 3600 * 1000;
export const REFRESH_TOKEN_LIFETIME = ms('1d');
