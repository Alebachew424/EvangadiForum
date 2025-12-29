//imports

//signup

//login

async function checkUser(req, res) {
  // Check user logic here

  const user = req.user;
  return res.status(StatusCodes.OK).json({
    message: "Valid user",
    userid: user.userid,
    username: user.username,
  });
}
