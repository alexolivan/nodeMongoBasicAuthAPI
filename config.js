const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 app: {
   port: 3000
 },
 db: {
   host: 'localhost',
   port: 27017,
   name: 'NodeBasicAuthAPI'
 },
 jwt: {
   secret: 'myJWTVerySecret'
 }
};

const test = {
 app: {
   port: 3000
 },
 db: {
   host: 'localhost',
   port: 27017,
   name: 'NodeBasicAuthAPITest'
 },
 jwt: {
   secret: 'myJWTVerySecret'
 }
};

const config = {
 dev,
 test
};

module.exports = config[env];
