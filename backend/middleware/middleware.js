const express=require("express");
const { jwtDecode } = require('jwt-decode');

exports.isAuthenticated=async ()=>{
   const decoded = jwtDecode(token);
   console.log("Decoded Token:", decoded);
}