import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

const verifyJwt = async (req, res, next) => {
  //so first we get token from cookie or from header
  //once we got the cookie of current user
  //we will veify the token from cookie and the verify()method of jwt
  //once verifed we will add user in the req
  //and call the next
  //also if any error call next with error

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //check if token present
    console.log(token);
    if (!token) {
      //   throw new ApiError("Invalid Authorization !!");
      return res
        .status(401)
        .json({ message: "Invalid Authorization !!", success: false });
    }

    //if token present check if it's valid token or not with jwt

    const jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT);

    // console.log("AccessToken from cookie/header:", token);
    if (!jwtPayload) {
      return res
        .status(401)
        .json({ message: "Invalid Access Token!!", success: false });
    }

    //if jwtPayload present meaning we get the original payload given at the creation of the access token
    //i.e -> {_id,username,email...}

    //now we have id we can get the user
    console.log("=============== > ",jwtPayload)
    const user = await prisma.user.findUnique({
      where: {
        id: jwtPayload?.id,
      },
      select: {
        email: true,
        id: true,
      },
    });

    // const user = await User.findById(jwtPayload?._id).select(
    //   "-password -refreshToken"
    // );
    if (!user) {
      //   throw new ApiError("Invalid Access Token!!");
      return res
        .status(401)
        .json({ message: "Invalid Access Token!!", success: false });
    }

    //if found add this user info(all the info) in the "req" object

    req.user = user;

    //once added to the req obj now work of the middelware is over call the next function
    next();
  } catch (error) {
    console.log(`Error while validating Access-Token : ${error}`);
    return next(error);
  }
};

export { verifyJwt };
