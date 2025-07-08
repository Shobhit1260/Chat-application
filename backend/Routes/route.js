const express= require("express");
const { createGroup, addMember, storeUser } = require("../Controllers/controller");
const { checkJwt } = require("../middleware/middleware");

const router=express.Router();

router.post('/creategroup', createGroup);
router.post('/addmember',checkJwt,addMember);
router.post('/storeuser',storeUser);




module.exports=router;