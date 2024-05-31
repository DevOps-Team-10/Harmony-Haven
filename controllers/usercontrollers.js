const apiResponse = require('../utils/apiResponse')
const User = require('../models/userModel.js')

const cookieOption = () => {
  return {
    httpOnly: true,
    secure: true,
  };
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    await user.save({ validateBeforeSave: false })

    return { accessToken }
  } catch (error) {
    return res.status(500).json(new apiResponse(500, {}, "Something went wrong while generating access and refresh token"))
  }
}


const createUser = async (req, res) => {
  const { name, password, email } = req.body;


  if (
    [password, name, email].some(
      (field) => field?.trim() === undefined
    )
  ) {
    return res
      .status(400)
      .json(400, { message: "All fields required" })
  }

  const existingUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User already exists" });
  }

  const user = await User.create({
    email,
    password,
    name: name.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json(500,
        { message: "Something went wrong while registering the user" }
      )
  }

  return res
    .status(201)
    .json(
      new apiResponse(201, "User registerd Successfully", createdUser)
    );
}

const loginUser = (async (req, res, next) => {
  // get data from req.body email and password
  // find the user
  // password check
  // generate access and refresh token
  // send cookie

  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).json(new apiResponse(400, { message: "email and password required" }));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new apiResponse(404, { message: "User does not exist" }));
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json(new apiResponse(401, { message: "Invalid user credentials" }));
    }

    const { accessToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = cookieOption();

    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new apiResponse(
          200,
          "User logged in successfully",
          {
            ...loggedInUser.toObject(),
            accessToken
          }
        )
      );
  } catch (error) {
    res.status(500).json(new apiResponse(500, { message: 'Error Logging In' }));
  }
});

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.userInfo._id,
    {
      new: true
    }
  )

  const options = cookieOption()

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200, "User logged Out successfully", {}))
}


module.exports = {
  createUser,
  loginUser,
  logoutUser
};
