const express= require("express");
const { createGroup, addMember, storeUser, fetchUser } = require("../Controllers/controller");
const { checkJwt } = require("../middleware/middleware");

const router=express.Router();

router.post('/creategroup',checkJwt, createGroup);
router.post('/addmember',checkJwt,addMember);
router.post('/storeuser',checkJwt,storeUser);
router.get('/fetchuser',checkJwt,fetchUser)




module.exports=router;