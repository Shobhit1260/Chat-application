const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

console.log("Middleware file loaded");
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_DOMAIN + "/",
  algorithms: ["RS256"]
});
console.log("checkJwt middleware initialized");


module.exports = {
  checkJwt
};

// const isAuthenticated=async(req,res,next)=>{
//   try{
//     const token =req.cookies.auth0_token;
//     const decode=jwt.decode() 
//   }
//   catch(error){
//     console.log("error:",error);
//   }
// }


