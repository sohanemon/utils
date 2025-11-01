import { Without } from './utilities';

export type BUFFER<T> = T;

export type IMPLIES<T, U> = T extends U ? true : false;

// NOTE:
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type XNOR<T, U> = (T & U) | (Without<T, U> & Without<U, T>);

export type OR<T, U> = T | U | (T & U);

export type AND<T, U> = T & U;

// Unary NOT
export type NOT<T> = {
  [P in keyof T]?: never;
};

// Binary NOT
export type NAND<T, U> = NOT<AND<T, U>>;

export type NOR<T, U> = NOT<OR<T, U>>;
