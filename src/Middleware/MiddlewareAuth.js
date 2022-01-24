var express = require('express');
var jwt = require('jsonwebtoken');
var HttpStatusCodes = require('http-status-codes');

require("dotenv").config();


module.exports =function MiddlewareAuth(request, response, next) {
  console.log(request)
  const token = request.header('Authorization');
  if (!token) {
    return response.status(HttpStatusCodes.UNAUTHORIZED).send('UnAuthorized, no token');
  }
  // Verify token
  try {
    const user = jwt.verify(token, process.env.jwtSecret);
    request.email = user.email;
    next();
  } catch (error) {
    response.status(HttpStatusCodes.UNAUTHORIZED).send('Invalid Token');
  }
}
