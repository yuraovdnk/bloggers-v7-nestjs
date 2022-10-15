export const getConfig = () => ({
  secrets: {
    secretAccessToken: process.env.SECRET_ACCESS_TOKEN,
    secretRefreshToken: process.env.SECRET_REFRESH_TOKEN,
  },
  db: {
    mongoUriDev: process.env.MONGO_URI,
    mongoUriTesting: process.env.MONGO_URI_TEST,
  },
  admin: {
    userName: process.env.USER_NAME,
    password: process.env.PASSWORD,
  },
});
