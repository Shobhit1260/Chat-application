const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

console.log("Middleware file loaded");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-ir2u634bo1ue8xg8.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://dev-ir2u634bo1ue8xg8.us.auth0.com/api/v2/",
  issuer: `https://dev-ir2u634bo1ue8xg8.us.auth0.com/`,
  algorithms: ["RS256"],
  requestProperty: 'user'
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


