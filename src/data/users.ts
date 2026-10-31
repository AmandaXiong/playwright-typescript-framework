import { required } from '../utils/env';

export const users = {
  standard: {
    username: required('STANDARD_USER'),
    password: required('PASSWORD'),
  },
  lockedOut: {
    username: required('LOCKED_OUT_USER'),
    password: required('PASSWORD'),
  },
};
