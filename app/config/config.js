module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SITE_URL : process.env.NODE_ENV== 'development' ?'http://localhost:3000' : 'http://192.163.31.3',
  CART_ITEM_TIME :'2',

  /*** BITPAY SETTING */
  BITPAY_MODE : process.env.NODE_ENV== 'development' ? "TEST" : "TEST", //PROD
  BITPAY_MERCHANT : process.env.NODE_ENV== 'development' ? "BYtTVQqyEHSv7AZdy2jfRnSmsHJV6HwRGuQDCtPZgPtb" : "BYtTVQqyEHSv7AZdy2jfRnSmsHJV6HwRGuQDCtPZgPtb",
  BITPAY_KEY_TEXT : process.env.NODE_ENV== 'development' ? "287db7dbe0a5c557fd3d10812e43a54c25ed404a864f8a0774942caa63118643" : "287db7dbe0a5c557fd3d10812e43a54c25ed404a864f8a0774942caa63118643",
  BITPAY_WEBHOOK_URL : process.env.NODE_ENV== 'development' ? "http://192.163.31.3:5000/api/user/btcwebhook" : "http://192.163.31.3:5000/api/user/btcwebhook",
  


  /** DATABASE */
  db: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME, 
    dialect: "mysql",

    // pool is optional, it will be used for Sequelize connection pool configuration
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  /** AUTH KEY */
  auth: {
    secret: "our-secret-key"
  },
  role:{
    user : 'ROLE_USER',
    admin : 'ROLE_ADMIN',
    moderator : 'ROLE_MODERATOR'
  }
};
