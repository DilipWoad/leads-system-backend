import { generateAccessToken, generateRefreshToken } from "../constant.js";
import { prisma } from "../index.js";

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email.trim() === "") {
      return res
        .status(401)
        .json({ message: "Email cannot be empty!", success: false });
    }
    if (password.trim() === "") {
      return res
        .status(401)
        .json({ message: "Password cannot be empty!", success: false });
    }
    //find if email already exists
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log(userExists);

    if (userExists) {
      return res
        .status(401)
        .json({ message: "User email already Exists.", success: false });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password,
      },
      select: {
        id: true,
        email: true,
      },
    });
    console.log(`{login : ${email},password : ${password}}`);

    return res.status(200).json({
      data: newUser,
      message: "User register Successfully.",
      success: true,
    });
  } catch (error) {
    console.error(`error while login the User : ${error} `);
    return res
      .status(500)
      .json({ error: "Could not create user", details: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email.trim() === "") {
      return res
        .status(401)
        .json({ message: "Email cannot be empty!", success: false });
    }
    if (password.trim() === "") {
      return res
        .status(401)
        .json({ message: "Password cannot be empty!", success: false });
    }
    //find if email already exists
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userExists) {
      return res
        .status(404)
        .json({ message: "User email does not Exists.", success: false });
    }

    //exists check if password matches
    if (userExists.password !== password) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: false });
    }
    //once both email and password matched generate refresh and access token
    //store refresh token in the backend
    //and store both token in cookies
    console.log(`{login : ${email},password : ${password}}`);
    const AccessTokenOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      // sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    };
    const RefreshTokenOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      // sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    const accessToken = await generateAccessToken(email, userExists.id);
    const refreshToken = await generateRefreshToken(userExists.id);
    res.cookie("accessToken", accessToken, AccessTokenOptions);
    res.cookie("refreshToken", refreshToken, RefreshTokenOptions);
    //
    console.log(
      `{Access Token : ${accessToken},Refresh Token : ${refreshToken}}`
    );

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        refreshToken,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return res.status(200).json({
      data: user,
      message: "User login Successfully.",
      success: true,
    });
  } catch (error) {
    console.error(`error while login the User : ${error} `);
    return res
      .status(500)
      .json({ error: "Could not create user", details: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    //verifyJwt
    // then clear cookie
    //also remove refresh token from the db
    const user = req.user;
    console.log(user)
    if (!user) {
      return res.status(401).json({
        message: "Invalid api call for logout ,make sure you are logged in.",
        success: false,
      });
    }

    //remove from db
    const userRefresh = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: "",
      },
    });
    if (!userRefresh) {
      return res
        .status(500)
        .json({
          message: "Something went wrong while removing RefreshToken.",
          success: false,
        });
    }
    //options for cookie
    const options = {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
    };
    //remove from cookie
    res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json({ message: "User Logout Successfully!!", data: [], success: true });
  } catch (error) {
    console.error(`Error while logout : ${error} `);
    return res.status(500).json({
      error: "Something went wrong while logout.",
      details: error.message,
    });
  }
};
export { loginUser, registerUser,logoutUser };
