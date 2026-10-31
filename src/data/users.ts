export const users = {
  standard: {
    username: process.env.STANDARD_USER ?? '',
    password: process.env.PASSWORD ?? '',
  },
  lockedOut: {
    username: process.env.LOCKED_OUT_USER ?? '',
    password: process.env.PASSWORD ?? '',
  },
};