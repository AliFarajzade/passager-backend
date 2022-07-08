var $1zVyf$dotenv = require("dotenv");
var $1zVyf$mongoose = require("mongoose");
var $1zVyf$process = require("process");
var $1zVyf$compression = require("compression");
var $1zVyf$cookieparser = require("cookie-parser");
var $1zVyf$cors = require("cors");
var $1zVyf$express = require("express");
var $1zVyf$expressmongosanitize = require("express-mongo-sanitize");
var $1zVyf$helmet = require("helmet");
var $1zVyf$hpp = require("hpp");
require("morgan");
var $1zVyf$xssclean = require("xss-clean");
var $1zVyf$crypto = require("crypto");
var $1zVyf$jsonwebtoken = require("jsonwebtoken");
var $1zVyf$bcryptjs = require("bcryptjs");
var $1zVyf$nodemailer = require("nodemailer");
var $1zVyf$slugify = require("slugify");
var $1zVyf$expressratelimit = require("express-rate-limit");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}











class $9236c11e0578ae89$var$AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
var $9236c11e0578ae89$export$2e2bcd8739ae039 = $9236c11e0578ae89$var$AppError;


const $8d356f125fa9379d$var$handleCastError = (err)=>new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)(`Invalid ${err.path}: ${err.value}`, 400);
const $8d356f125fa9379d$var$handleDuplicateKeyError = (err)=>new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)(`Duplicate field error ${JSON.stringify(err.keyValue)}`, 400);
const $8d356f125fa9379d$var$handleValidationError = (err)=>{
    const messages = Object.entries(err.errors).map((arr)=>arr[1].message).join(" ");
    return new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)(`Validation Error: ${messages}`, 400);
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $8d356f125fa9379d$var$handleExpiredTokenError = (_)=>new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Token has been expired.", 401);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $8d356f125fa9379d$var$handleInvlidSignaturError = (_)=>new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Invalid signature.", 401);
const $8d356f125fa9379d$var$handleErrorDev = (res, err)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};
const $8d356f125fa9379d$var$handleErrorProd = (res, err)=>{
    if (err.isOperational) res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
    else {
        console.log("\uD83E\uDDE8\uFE0F Error: \n", err);
        res.status(500).json({
            status: "fail",
            message: "Something went very wrong!"
        });
    }
};
const $8d356f125fa9379d$export$f817c67b4a20d3d5 = (err, _, res, // eslint-disable-next-line @typescript-eslint/no-unused-vars
__)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // Handling Cast erroes
    if (err.name === "CastError") {
        const newError = $8d356f125fa9379d$var$handleCastError(err);
        return $8d356f125fa9379d$var$handleErrorProd(res, newError);
    }
    // Handling duplicate field error
    if (err.code === 11000) {
        const newError = $8d356f125fa9379d$var$handleDuplicateKeyError(err);
        return $8d356f125fa9379d$var$handleErrorProd(res, newError);
    }
    // Handling fields validation error
    if (err.name === "ValidationError") {
        const newError = $8d356f125fa9379d$var$handleValidationError(err);
        return $8d356f125fa9379d$var$handleErrorProd(res, newError);
    }
    if (err.name === "TokenExpiredError") {
        const newError = $8d356f125fa9379d$var$handleExpiredTokenError(err);
        return $8d356f125fa9379d$var$handleErrorProd(res, newError);
    }
    if (err.name === "JsonWebTokenError") {
        const newError = $8d356f125fa9379d$var$handleInvlidSignaturError(err);
        return $8d356f125fa9379d$var$handleErrorProd(res, newError);
    }
    // Handling general errors
    $8d356f125fa9379d$var$handleErrorProd(res, err);
};
const $8d356f125fa9379d$export$e56abc4807b7b2e6 = (fn)=>(req, res, next)=>{
        fn(req, res, next).catch(next);
    };








const $39938ca19503f268$export$976c37132e9c6a10 = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
const $39938ca19503f268$export$ddd31b5c12262d9a = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;


const $6f9b20b42052cb09$var$UserSchema = new (0, $1zVyf$mongoose.Schema)({
    name: {
        type: String,
        trim: true,
        required: [
            true,
            "A user must have a name"
        ],
        minlength: 2,
        maxlength: 32,
        validate: {
            validator: (value)=>!value.split("").every((char)=>!!parseInt(char)),
            message: "Name must only contain english letters."
        }
    },
    email: {
        type: String,
        trim: true,
        required: [
            true,
            "A User must have an email address."
        ],
        unique: true,
        lowercase: true,
        validate: {
            validator: (value)=>(0, $39938ca19503f268$export$976c37132e9c6a10).test(value),
            message: "Email is not valid."
        }
    },
    password: {
        type: String,
        required: [
            true,
            "A User must have a password."
        ],
        minlength: [
            8,
            "Password must be at least 8 characters"
        ],
        validate: {
            // This will only work on create and save method.
            validator: (value)=>(0, $39938ca19503f268$export$ddd31b5c12262d9a).test(value),
            message: "Invalid Password: Password must contain at least special character (#?!@$ %^&*-), 1 uppercase letter and 1 number"
        },
        select: false
    },
    confirmPassword: {
        type: String,
        required: [
            true,
            "A User must have a confirm password."
        ],
        minlength: [
            8,
            "Confirm Password must be at least 8 characters"
        ],
        validate: {
            // This will only work on create and save method.
            validator: function(value) {
                return this.password === value;
            },
            message: "Invalid Confirm Password: Passwords do not match"
        }
    },
    passwordChangedAt: {
        type: Date,
        required: false
    },
    photo: String,
    role: {
        type: String,
        enum: {
            values: [
                "user",
                "guide",
                "lead-guide",
                "admin"
            ],
            message: 'Rules can only be "user", "guide", "lead-guide" and "admin".'
        },
        default: "user"
    },
    description: String,
    hashedResetPasswordToken: String,
    resetPasswordTokenExpireTime: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});
const $6f9b20b42052cb09$var$documentMiddlewareHashPassword = async function(next) {
    // If the password being initialize or change.
    if (!this.isModified?.("password")) return next();
    // Hashing the password
    this.password = await (0, ($parcel$interopDefault($1zVyf$bcryptjs))).hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
};
const $6f9b20b42052cb09$var$documentMiddlewareAddPasswordChagendAt = async function(next) {
    if (!this.isModified?.("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
};
const $6f9b20b42052cb09$var$queryMiddlewareExcludeInActiveUsers = function(next) {
    this.find({
        active: {
            $ne: false
        }
    });
    next();
};
// Document Middleware
$6f9b20b42052cb09$var$UserSchema.pre("save", $6f9b20b42052cb09$var$documentMiddlewareHashPassword);
$6f9b20b42052cb09$var$UserSchema.pre("save", $6f9b20b42052cb09$var$documentMiddlewareAddPasswordChagendAt);
// Query middleware
$6f9b20b42052cb09$var$UserSchema.pre(/^find/, $6f9b20b42052cb09$var$queryMiddlewareExcludeInActiveUsers);
// Schema methods
$6f9b20b42052cb09$var$UserSchema.methods.comparePasswords = async (requestPassword, hashedPassword)=>await (0, ($parcel$interopDefault($1zVyf$bcryptjs))).compare(requestPassword, hashedPassword);
$6f9b20b42052cb09$var$UserSchema.methods.hasPasswordChange = function(JWTIssuedAt) {
    if (!this.passwordChangedAt) return false;
    else return new Date(`${this.passwordChangedAt}`).getTime() / 1000 > JWTIssuedAt;
};
$6f9b20b42052cb09$var$UserSchema.methods.createPasswordResetToken = function() {
    const resetToken = (0, ($parcel$interopDefault($1zVyf$crypto))).randomBytes(32).toString("hex");
    this.hashedResetPasswordToken = (0, ($parcel$interopDefault($1zVyf$crypto))).createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordTokenExpireTime = Date.now() + 600000;
    return resetToken;
};
const $6f9b20b42052cb09$var$UserModel = (0, $1zVyf$mongoose.model)("User", $6f9b20b42052cb09$var$UserSchema, "users");
var $6f9b20b42052cb09$export$2e2bcd8739ae039 = $6f9b20b42052cb09$var$UserModel;




const $428b5afe2454e9b1$export$1cea2e25b75a88f2 = async (options)=>{
    const transport = (0, $1zVyf$nodemailer.createTransport)({
        host: "smtp.mailtrap.io",
        port: "2525",
        auth: {
            user: "668c77bcee6790",
            pass: "be917d7c400d9d"
        }
    });
    const mailOptions = {
        from: "Ali <ali@email.com>",
        to: options.to,
        subject: options.subject,
        text: options.text
    };
    await transport.sendMail(mailOptions);
};




const $f714d77269cfd46b$var$generateToken = (id)=>(0, ($parcel$interopDefault($1zVyf$jsonwebtoken))).sign({
        id: id
    }, "w7T1jdFbBBGXl1YEpXc9gSM5F6NSffdzcWqjYWknlOauEYZRLZ", {
        expiresIn: "30d"
    });
const $f714d77269cfd46b$var$sendToken = (userId, res, user = {})=>{
    const token = $f714d77269cfd46b$var$generateToken(userId);
    const cookieOptions = {
        expires: new Date(Date.now() + "30" * 86400000),
        httpOnly: true
    };
    cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    if (Object.keys(user).length) {
        user.password = undefined;
        res.status(201).json({
            status: "success",
            token: token,
            data: user
        });
    } else res.status(201).json({
        status: "success",
        token: token
    });
};
const $f714d77269cfd46b$export$59f9b8ac40e092d1 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, _next)=>{
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
        photo: req.body.photo
    };
    const newUser = await (0, $6f9b20b42052cb09$export$2e2bcd8739ae039).create(data);
    $f714d77269cfd46b$var$sendToken(newUser._id, res, newUser);
});
const $f714d77269cfd46b$export$ad6884e3d0687032 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
    const { email: email , password: password  } = req.body;
    // 1) Check for email and password existence.
    if (!email || !password) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Please provide email and password.", 400));
    // 2) Check if user exist and password is correct.
    const user = await (0, $6f9b20b42052cb09$export$2e2bcd8739ae039).findOne({
        email: email
    }).select("+password");
    const match = !!await user?.comparePasswords(password, user.password);
    if (!user || !match) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Incorrect email or password.", 401));
    // 3) Send token to client if everything is ok.
    $f714d77269cfd46b$var$sendToken(user._id, res);
});
const $f714d77269cfd46b$export$e9299ef5b0671ee1 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, _res, next)=>{
    let token = undefined;
    // 1) Check for JWT existence
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) token = req.headers.authorization.split(" ")[1];
    else if (req.cookies.jwt) token = req.cookies?.jwt;
    if (!token) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("You are unauthorized! Please log in first", 401));
    // 2) Check for JWT validation
    const { id: id , iat: iat  } = (0, ($parcel$interopDefault($1zVyf$jsonwebtoken))).verify(token, "w7T1jdFbBBGXl1YEpXc9gSM5F6NSffdzcWqjYWknlOauEYZRLZ");
    // 3) Check if user still exists
    const user = await (0, $6f9b20b42052cb09$export$2e2bcd8739ae039).findById(id).select("+password");
    if (!user) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("There is no account corresponding to this ID.", 401));
    // 4) Check if user changed the password since token generation
    const hasPasswordChanged = user.hasPasswordChange(iat);
    if (hasPasswordChanged) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Password has changed since the token was generated, please log in again.", 401));
    req.currentUser = user;
    next();
});
const $f714d77269cfd46b$export$e1bac762c84d3b0c = (...roles)=>(0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, _res, next)=>{
        if (!req.currentUser) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("You are not authenticated.", 401));
        if (!roles.includes(req.currentUser.role)) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("You don't have permission to perfom this action.", 403));
        next();
    });
const $f714d77269cfd46b$export$66791fb2cfeec3e = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
    const { email: email  } = req.body;
    // 1) Check for email existence and format validation
    if (!email || !(0, $39938ca19503f268$export$976c37132e9c6a10).test(email)) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Please provide a valid email.", 400));
    // 2) Check for email exsitence in db
    const user = await (0, $6f9b20b42052cb09$export$2e2bcd8739ae039).findOne({
        email: email
    });
    if (!user) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("This user does not exist.", 404));
    // 3) Generate a token and save it to db
    const resetToken = user.createPasswordResetToken();
    await user.save({
        validateBeforeSave: false
    });
    // 4) Send the token to user's email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your Password? Submit a PATCH request with your new password and password confirm to: ${resetURL}.\n Please ignore if this is not your request.`;
    try {
        await (0, $428b5afe2454e9b1$export$1cea2e25b75a88f2)({
            to: user.email,
            subject: "Forgot password",
            text: message
        });
        res.status(200).json({
            status: "success",
            message: "Token sent to email successfully."
        });
    } catch (error) {
        user.hashedResetPasswordToken = undefined;
        user.resetPasswordTokenExpireTime = undefined;
        await user.save({
            validateBeforeSave: false
        });
        return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Could not send the email at the moment.", 500));
    }
});
const $f714d77269cfd46b$export$dc726c8e334dd814 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
    const { password: password , confirmPassword: confirmPassword  } = req.body;
    const { token: token  } = req.params;
    // 1) Check if there is a password and confirm password.
    if (!password || !confirmPassword) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Please provide password and confirm password.", 400));
    // 2) Check if there is a user with this token. Check the token expire time
    const hashedToken = (0, ($parcel$interopDefault($1zVyf$crypto))).createHash("sha256").update(token).digest("hex");
    const user = await (0, $6f9b20b42052cb09$export$2e2bcd8739ae039).findOne({
        hashedResetPasswordToken: hashedToken,
        resetPasswordTokenExpireTime: {
            $gt: Date.now()
        }
    });
    if (!user) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Token is either invalid or has expired.", 400));
    // 3) Upadte document in db with new password and delete the hashedResetPasswordToken and resetPasswordTokenExpireTime.
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.hashedResetPasswordToken = undefined;
    user.resetPasswordTokenExpireTime = undefined;
    await user.save();
    // 4) Add changedPasswordAt field to the document.
    // (Handled with document middleware in user model)
    // 5) Log in user
    $f714d77269cfd46b$var$sendToken(user._id, res);
});
const $f714d77269cfd46b$export$e2853351e15b7895 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
    const { oldPassword: oldPassword , newPassword: newPassword , confirmNewPassword: confirmNewPassword  } = req.body;
    // 0) Check if there is an old password and a new password.
    if (!oldPassword || !newPassword || !confirmNewPassword) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Please provide valid passwords.", 400));
    // 1) Check if the passwords are the same
    if (oldPassword === newPassword) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Please provide a new password.", 400));
    if (!req.currentUser) return;
    const user = req.currentUser;
    // 3) Check if the old password match with the passowrd in db.
    const doesMatch = await user.comparePasswords(oldPassword, user.password);
    if (!doesMatch) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Old password is not correct.", 400));
    // 4) Change the password,
    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    await user.save();
    // 5) Update passwordChangedAt field.
    // (Handled by document middleware function.)
    // 6) Create a new JWT and send it back to the client.
    $f714d77269cfd46b$var$sendToken(user._id, res);
});
const $f714d77269cfd46b$export$5880729c5d131040 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
    // 1) If there is a password, return with error.
    if (req.body.password || req.body.confirmPassword || req.body.newPassword || req.body.role) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("You can only change name, email and your photo with this end-point", 400));
    // 2) Update the document.
    if (!req.currentUser) return;
    const updateValues = {
        email: req.body.email ?? req.currentUser.email,
        photo: req.body.photo ?? req.currentUser.photo,
        name: req.body.name ?? req.currentUser.name
    };
    const updatedUser = await (0, $6f9b20b42052cb09$export$2e2bcd8739ae039).findByIdAndUpdate(req.currentUser._id, updateValues, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: "success",
        user: updatedUser
    });
});
const $f714d77269cfd46b$export$8788023029506852 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, _next)=>{
    // 1) Set active field to false.
    if (!req.currentUser) return;
    await (0, $6f9b20b42052cb09$export$2e2bcd8739ae039).findByIdAndUpdate(req.currentUser._id, {
        active: false
    });
    res.status(204).json({
        status: "success",
        message: "User got deleted."
    });
});





const $65d183415e2dff27$var$TourSchema = new (0, $1zVyf$mongoose.Schema)({
    name: {
        type: String,
        required: [
            true,
            "A Tour must have a name."
        ],
        unique: true,
        trim: true,
        minlength: [
            7,
            "A Tour name must have more or equal than 7 characters.", 
        ],
        maxlength: [
            40,
            "A Tour name must have less or equal than 40 characters.", 
        ]
    },
    slug: String,
    city: {
        type: String,
        required: [
            true,
            "A Tour must have a city."
        ]
    },
    averageRating: {
        type: Number,
        default: 0,
        min: [
            0.1,
            "A Tour rating must be more or equal than 0.1."
        ],
        max: [
            5.0,
            "A Tour rating must be less or equal than 5.0."
        ],
        set: (value)=>Math.ceil(value * 100) / 100
    },
    price: {
        type: Number,
        required: [
            true,
            "A Tour must have a price."
        ]
    },
    discounetedPrice: {
        type: Number,
        validate: {
            validator: function(value) {
                return this.price > value;
            },
            message: "Discounted price ({VALUE}) must be lower than regular price."
        }
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        required: [
            true,
            "A Tour must have a difficulty."
        ],
        enum: {
            values: [
                "easy",
                "medium",
                "difficult"
            ],
            message: 'Difficulty must be either "easy", "medium" or "difficult".'
        }
    },
    maxGroupSize: {
        type: Number,
        required: [
            true,
            "A Tour must have a group size."
        ]
    },
    duration: {
        type: Number,
        required: [
            true,
            "A Tour must have a duration."
        ]
    },
    images: {
        type: [
            String
        ]
    },
    summary: {
        type: String,
        required: [
            true,
            "A Tour must have a summary."
        ],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        required: [
            true,
            "A Tour must have a cover image."
        ]
    },
    secretTour: {
        type: Boolean,
        default: false
    },
    startDate: Date,
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: "Point",
            enum: [
                "Point",
                "Start location type cannot be set or modified.", 
            ]
        },
        coordinates: [
            Number
        ],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: [
                    "Point",
                    "Start location type cannot be set or modified.", 
                ]
            },
            coordinates: [
                Number
            ],
            address: String,
            description: String,
            day: Number
        }, 
    ],
    guides: {
        type: [
            (0, $1zVyf$mongoose.Schema).Types.ObjectId
        ],
        ref: "User"
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});
// TourSchema.index({ price: 1, averageRating: -1 })
// TourSchema.index({ startLocation: '2dsphere' })
// Virtual populate
$65d183415e2dff27$var$TourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
});
// Virtual properties
$65d183415e2dff27$var$TourSchema.virtual("priceToPound").get(function() {
    return this.price * 0.77;
});
const $65d183415e2dff27$var$documentMiddlewareAddSlug = function(next) {
    // Adding slug
    this.slug = (0, ($parcel$interopDefault($1zVyf$slugify)))(this.name, {
        lower: true
    });
    next();
};
const $65d183415e2dff27$var$aggregateMiddlewareSorting = function(next) {
    this.pipeline().push({
        $sort: {
            numTours: -1
        }
    });
    next();
};
// Document middlewares: Runs bewfore .save() and .create(); NoT WHEN UPDATE!
$65d183415e2dff27$var$TourSchema.pre("save", $65d183415e2dff27$var$documentMiddlewareAddSlug);
$65d183415e2dff27$var$TourSchema.post("save", function(doc, next) {
    next();
});
const $65d183415e2dff27$var$queryMiddlewareExcludeSecretTours = function(next) {
    this.find({
        secretTour: {
            $ne: true
        }
    });
    // Populate the ref fields
    this.populate({
        path: "guides"
    });
    next();
};
// Query middlewares
$65d183415e2dff27$var$TourSchema.pre(/^find/, $65d183415e2dff27$var$queryMiddlewareExcludeSecretTours);
// Aggregate middlewares
$65d183415e2dff27$var$TourSchema.pre("aggregate", $65d183415e2dff27$var$aggregateMiddlewareSorting);
const $65d183415e2dff27$var$TourModel = (0, $1zVyf$mongoose.model)("Tour", $65d183415e2dff27$var$TourSchema, "tours");
var $65d183415e2dff27$export$2e2bcd8739ae039 = $65d183415e2dff27$var$TourModel;


const $242185dbbfccbaa9$var$ReviewSchema = new (0, $1zVyf$mongoose.Schema)({
    review: {
        type: String,
        minlength: 3,
        maxlength: 200,
        required: [
            true,
            "Review cannot be empty!"
        ]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [
            true,
            "A review must have a rating."
        ]
    },
    user: {
        type: (0, $1zVyf$mongoose.Schema).Types.ObjectId,
        required: [
            true,
            "A review must have an author."
        ],
        ref: "User"
    },
    tour: {
        type: (0, $1zVyf$mongoose.Schema).Types.ObjectId,
        required: [
            true,
            "A review must relate to a tour."
        ],
        ref: "Tour"
    }
}, // Add createdAt and updatedAt fields.
{
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});
// Preventing from duplicate review
// ReviewSchema.index({ user: 1, tour: 1 }, { unique: true })
const $242185dbbfccbaa9$var$queryMiddlewarePopulateFields = function(next) {
    // For populating the ref fields.
    this.populate({
        path: "user",
        select: "name photo"
    });
    next();
};
$242185dbbfccbaa9$var$ReviewSchema.statics.calculateAverageRatingAndQuantity = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId
            }
        },
        {
            $group: {
                _id: "$tour",
                nRating: {
                    $sum: 1
                },
                avgRating: {
                    $avg: "$rating"
                }
            }
        }, 
    ]);
    await (0, $65d183415e2dff27$export$2e2bcd8739ae039).findByIdAndUpdate(tourId, {
        ratingsQuantity: stats.length === 0 ? 0 : stats[0].nRating,
        averageRating: stats.length === 0 ? 0 : stats[0].avgRating
    });
};
const $242185dbbfccbaa9$var$replaceAverageRatingAndQuantityOnSave = function(res, next) {
    this.constructor.calculateAverageRatingAndQuantity(res.tour);
    next();
};
const $242185dbbfccbaa9$var$replaceAverageRatingAndQuantityOnUpdatePost = async function(res, next) {
    this.model.calculateAverageRatingAndQuantity(res.tour);
    next();
};
// Query middleware
$242185dbbfccbaa9$var$ReviewSchema.pre(/^find/, $242185dbbfccbaa9$var$queryMiddlewarePopulateFields);
$242185dbbfccbaa9$var$ReviewSchema.post("save", $242185dbbfccbaa9$var$replaceAverageRatingAndQuantityOnSave);
$242185dbbfccbaa9$var$ReviewSchema.post(/^findOneAnd/, $242185dbbfccbaa9$var$replaceAverageRatingAndQuantityOnUpdatePost);
const $242185dbbfccbaa9$var$ReviewModel = (0, $1zVyf$mongoose.model)("Review", $242185dbbfccbaa9$var$ReviewSchema, "reviews");
var $242185dbbfccbaa9$export$2e2bcd8739ae039 = $242185dbbfccbaa9$var$ReviewModel;



class $011e10be0fb6bd31$export$2e2bcd8739ae039 {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        // Filtering
        let queryObj = {
            ...this.queryString
        };
        const filterFields = [
            "sort",
            "limit",
            "page",
            "fields"
        ];
        filterFields.forEach((field)=>delete queryObj[field]);
        // Complex Filtering
        const queryStr = JSON.stringify(queryObj);
        queryObj = JSON.parse(queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (match)=>`$${match}`));
        this.query = this.query.find(queryObj);
        return this;
    }
    sort() {
        // Sorting
        let { sort: sortStr  } = this.queryString;
        if (sortStr) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            sortStr = sortStr.replace(/(,)/g, " ");
            this.query = this.query.sort(sortStr);
        }
        return this;
    }
    fields() {
        // Fields
        let { fields: fieldsStr  } = this.queryString;
        if (fieldsStr) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fieldsStr = fieldsStr.replace(/(,)/g, " ");
            this.query = this.query.select(fieldsStr);
        } else this.query = this.query.select("-__v");
        return this;
    }
    pagination() {
        // Pagination
        const { page: page , limit: limit  } = this.queryString;
        const pageNumber = page ? +page : 1;
        const limitValue = limit ? +limit : 5;
        this.query = this.query.skip((pageNumber - 1) * limitValue).limit(limitValue);
        return this;
    }
}




const $c53569e0de1a75ca$var$excludeFields = (obj, ...fileds)=>{
    const filteredObj = {
        ...obj
    };
    Object.keys(obj).forEach((key)=>{
        if (fileds.includes(key)) delete filteredObj[key];
    });
    return filteredObj;
};
const $c53569e0de1a75ca$export$c00c16979ce15b0f = (Model1)=>(0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
        const { id: id  } = req.params;
        const documentToDelete = await Model1.findByIdAndRemove(id);
        if (!documentToDelete) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("No document found with this ID.", 404));
        res.status(202).json({
            status: "deleted",
            data: {}
        });
    });
const $c53569e0de1a75ca$export$40eade6eb956113a = (Model2, modelName = "")=>(0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
        const { id: id  } = req.params;
        if (modelName === "Review") // TODO: Check if review belongs to user.
        req.body = $c53569e0de1a75ca$var$excludeFields(req.body, "user", "tour");
        const updatedDocument = await Model2.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedDocument) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("No document found with this ID.", 404));
        res.status(200).json({
            status: "success",
            data: updatedDocument
        });
    });
const $c53569e0de1a75ca$export$37330def6e48b4c9 = (Model3)=>(0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, _next)=>{
        const createdDocument = await Model3.create(req.body);
        res.status(201).json({
            status: "success",
            data: createdDocument
        });
    });
const $c53569e0de1a75ca$export$f65ca476c09acec0 = (Model4, populateOptions)=>(0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
        const { id: id  } = req.params;
        let query = Model4.findById(id);
        if (populateOptions) query = query.populate(populateOptions);
        const documentToFind = await query;
        if (!documentToFind) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("No document found with this ID.", 404));
        // Getting all tours from db
        res.status(200).json({
            status: "success",
            data: documentToFind
        });
    });
const $c53569e0de1a75ca$export$2d32231e5af339ac = (Model5, modelName = "")=>(0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, _next)=>{
        let queryFilter = {};
        if (modelName === "Review") req.params.id && (queryFilter = {
            tour: req.params.id
        });
        // Craete a query request
        const features = new (0, $011e10be0fb6bd31$export$2e2bcd8739ae039)(Model5.find(queryFilter), req.query);
        features.filter().sort().fields();
        const total = await features.query.countDocuments();
        features.filter().sort().fields().pagination();
        let documents;
        if (modelName === "Review") documents = await features.query.populate("user").clone();
        else documents = await features.query.clone();
        // Getting all tours from db
        res.status(200).json({
            status: "success",
            total: total,
            results: documents.length,
            data: documents
        });
    });


const $441744675012c50d$export$98596c466f7b9045 = (0, $c53569e0de1a75ca$export$2d32231e5af339ac)((0, $242185dbbfccbaa9$export$2e2bcd8739ae039), "Review");
const $441744675012c50d$export$5a3f3c5b17313fb0 = (req, _res, next)=>{
    if (!req.body.tour) req.body.tour = req.params.id;
    req.body.user = req.currentUser?._id;
    next();
};
const $441744675012c50d$export$eac79620c8ab6ec1 = (0, $c53569e0de1a75ca$export$37330def6e48b4c9)((0, $242185dbbfccbaa9$export$2e2bcd8739ae039));
const $441744675012c50d$export$189a68d831f3e4ec = (0, $c53569e0de1a75ca$export$c00c16979ce15b0f)((0, $242185dbbfccbaa9$export$2e2bcd8739ae039));
const $441744675012c50d$export$7019c694ef9e681d = (0, $c53569e0de1a75ca$export$40eade6eb956113a)((0, $242185dbbfccbaa9$export$2e2bcd8739ae039), "Review");
const $441744675012c50d$export$807e12b6c57b3e8d = (0, $c53569e0de1a75ca$export$f65ca476c09acec0)((0, $242185dbbfccbaa9$export$2e2bcd8739ae039));


const $7ead2b4393053d39$var$router = (0, $1zVyf$express.Router)({
    mergeParams: true
});
$7ead2b4393053d39$var$router.route("/").get($441744675012c50d$export$98596c466f7b9045).post((0, $f714d77269cfd46b$export$e9299ef5b0671ee1), (0, $f714d77269cfd46b$export$e1bac762c84d3b0c)("user"), $441744675012c50d$export$5a3f3c5b17313fb0, $441744675012c50d$export$eac79620c8ab6ec1);
// TODO: Authorization with protectroute and ...
$7ead2b4393053d39$var$router.route("/:id").get($441744675012c50d$export$807e12b6c57b3e8d).delete((0, $f714d77269cfd46b$export$e9299ef5b0671ee1), (0, $f714d77269cfd46b$export$e1bac762c84d3b0c)("user", "admin"), $441744675012c50d$export$189a68d831f3e4ec).patch((0, $f714d77269cfd46b$export$e9299ef5b0671ee1), (0, $f714d77269cfd46b$export$e1bac762c84d3b0c)("user", "admin"), $441744675012c50d$export$7019c694ef9e681d);
var $7ead2b4393053d39$export$2e2bcd8739ae039 = $7ead2b4393053d39$var$router;








const $9f4fcf0c50282850$export$1b246d2f2efdafde = (0, $c53569e0de1a75ca$export$2d32231e5af339ac)((0, $65d183415e2dff27$export$2e2bcd8739ae039));
const $9f4fcf0c50282850$export$8564a99269d6b159 = (0, $c53569e0de1a75ca$export$f65ca476c09acec0)((0, $65d183415e2dff27$export$2e2bcd8739ae039), {
    path: "reviews",
    options: {
        limit: "10",
        sort: "-createdAt"
    }
});
const $9f4fcf0c50282850$export$9b8519ca6a5aab84 = (0, $c53569e0de1a75ca$export$40eade6eb956113a)((0, $65d183415e2dff27$export$2e2bcd8739ae039));
const $9f4fcf0c50282850$export$91ab1b0172282720 = (0, $c53569e0de1a75ca$export$c00c16979ce15b0f)((0, $65d183415e2dff27$export$2e2bcd8739ae039));
const $9f4fcf0c50282850$export$7c94657b6dbbb90 = (0, $c53569e0de1a75ca$export$37330def6e48b4c9)((0, $65d183415e2dff27$export$2e2bcd8739ae039));
const $9f4fcf0c50282850$export$b1484211670d44c4 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (_req, res, _next)=>{
    const stats = await (0, $65d183415e2dff27$export$2e2bcd8739ae039).aggregate([
        {
            $group: {
                _id: "$difficulty",
                numTours: {
                    $sum: 1
                },
                minPrice: {
                    $min: "$price"
                },
                maxPrice: {
                    $max: "$price"
                },
                avgPrice: {
                    $avg: "$price"
                }
            }
        }, 
    ]);
    res.status(200).json({
        status: "success",
        data: {
            stats: stats
        }
    });
});
const $9f4fcf0c50282850$export$9b8070085067eab3 = async (req, _res, next)=>{
    try {
        req.query.limit = "5";
        req.query.sort = "-averageRating,price";
        req.query.fields = "name,averageRating,price,difficulty";
        next();
    } catch (error) {
        console.log(error);
    }
};
const $9f4fcf0c50282850$export$f0bf44055fab1ca8 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
    const { distance: distance , latlng: latlng , unit: unit  } = req.params;
    const [lat, lng] = JSON.parse(latlng);
    if (!lat || !lng || !distance || !unit) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Please provide a latitude, longitude, unit and distance.", 400));
    const radian = unit === "km" ? parseInt(distance) / 6371 : parseInt(distance) / 3958;
    const tours = await (0, $65d183415e2dff27$export$2e2bcd8739ae039).find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [
                    [
                        lng,
                        lat
                    ],
                    radian
                ]
            }
        }
    });
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            data: tours
        }
    });
});
const $9f4fcf0c50282850$export$c76b58cfe053f228 = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
    const { latlng: latlng , unit: unit  } = req.params;
    const [lat, lng] = JSON.parse(latlng);
    if (!lat || !lng || !unit) return next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)("Please provide a latitude, longitude and unit.", 400));
    const multiplier = unit === "km" ? 0.001 : 0.000621371;
    const tours = await (0, $65d183415e2dff27$export$2e2bcd8739ae039).aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [
                        lng,
                        lat
                    ]
                },
                distanceField: "distance",
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }, 
    ]);
    res.status(200).json({
        status: "success",
        data: {
            data: tours
        }
    });
});
const $9f4fcf0c50282850$export$ceea8e5283e1d53a = (0, $8d356f125fa9379d$export$e56abc4807b7b2e6)(async (req, res, next)=>{
    const { slug: slug  } = req.params;
    const tourToFind = await (0, $65d183415e2dff27$export$2e2bcd8739ae039).findOne({
        slug: slug
    }).populate("guides");
    res.status(200).json({
        status: "success",
        data: tourToFind
    });
});



const $59c637b82b59978a$var$router = (0, $1zVyf$express.Router)();
$59c637b82b59978a$var$router.route("/get-by-slug/:slug").get($9f4fcf0c50282850$export$ceea8e5283e1d53a);
$59c637b82b59978a$var$router.route("/tours-within/:distance/center/:latlng/unit/:unit").get($9f4fcf0c50282850$export$f0bf44055fab1ca8);
$59c637b82b59978a$var$router.route("/distances/:latlng/unit/:unit").get($9f4fcf0c50282850$export$c76b58cfe053f228);
$59c637b82b59978a$var$router.route("/get-stats").get($9f4fcf0c50282850$export$b1484211670d44c4);
$59c637b82b59978a$var$router.route("/top-5-cheap").get($9f4fcf0c50282850$export$9b8070085067eab3, $9f4fcf0c50282850$export$1b246d2f2efdafde);
$59c637b82b59978a$var$router.route("/").get($9f4fcf0c50282850$export$1b246d2f2efdafde).post((0, $f714d77269cfd46b$export$e9299ef5b0671ee1), (0, $f714d77269cfd46b$export$e1bac762c84d3b0c)("admin", "lead-guide"), $9f4fcf0c50282850$export$7c94657b6dbbb90);
$59c637b82b59978a$var$router.route("/:id").get($9f4fcf0c50282850$export$8564a99269d6b159).patch((0, $f714d77269cfd46b$export$e9299ef5b0671ee1), (0, $f714d77269cfd46b$export$e1bac762c84d3b0c)("admin"), $9f4fcf0c50282850$export$9b8519ca6a5aab84).delete((0, $f714d77269cfd46b$export$e9299ef5b0671ee1), (0, $f714d77269cfd46b$export$e1bac762c84d3b0c)("admin"), $9f4fcf0c50282850$export$91ab1b0172282720);
$59c637b82b59978a$var$router.use("/:id/reviews", (0, $7ead2b4393053d39$export$2e2bcd8739ae039));
var $59c637b82b59978a$export$2e2bcd8739ae039 = $59c637b82b59978a$var$router;






const $7e8f8fa525957e7e$export$69093b9c569a5b5b = (0, $c53569e0de1a75ca$export$2d32231e5af339ac)((0, $6f9b20b42052cb09$export$2e2bcd8739ae039));
const $7e8f8fa525957e7e$export$84e4772154052003 = (0, $c53569e0de1a75ca$export$f65ca476c09acec0)((0, $6f9b20b42052cb09$export$2e2bcd8739ae039));
const $7e8f8fa525957e7e$export$7d0f10f273c0438a = (0, $c53569e0de1a75ca$export$c00c16979ce15b0f)((0, $6f9b20b42052cb09$export$2e2bcd8739ae039));
const $7e8f8fa525957e7e$export$dd7946daa6163e94 = (req, _res, next)=>req.currentUser && (req.params.id = req.currentUser._id) && next();



const $954eef978b11b382$export$66cdde5d6479813c = (max, windowMs, message)=>(0, ($parcel$interopDefault($1zVyf$expressratelimit)))({
        max: max,
        windowMs: windowMs,
        standardHeaders: true,
        legacyHeaders: false,
        message: message
    });


const $44e0339319b5f71e$var$router = (0, $1zVyf$express.Router)();
$44e0339319b5f71e$var$router.post("/register", (0, $954eef978b11b382$export$66cdde5d6479813c)(10, 1800000, "Try making new account later."), $f714d77269cfd46b$export$59f9b8ac40e092d1);
$44e0339319b5f71e$var$router.post("/enter", (0, $954eef978b11b382$export$66cdde5d6479813c)(14, 1800000, "Try loging in later."), $f714d77269cfd46b$export$ad6884e3d0687032);
$44e0339319b5f71e$var$router.post("/forgot", (0, $954eef978b11b382$export$66cdde5d6479813c)(5, 1800000, "Try again later."), $f714d77269cfd46b$export$66791fb2cfeec3e);
$44e0339319b5f71e$var$router.patch("/reset/:token", (0, $954eef978b11b382$export$66cdde5d6479813c)(5, 1800000, "Try again later."), $f714d77269cfd46b$export$dc726c8e334dd814);
$44e0339319b5f71e$var$router.use($f714d77269cfd46b$export$e9299ef5b0671ee1);
$44e0339319b5f71e$var$router.get("/me", $7e8f8fa525957e7e$export$dd7946daa6163e94, $7e8f8fa525957e7e$export$84e4772154052003);
$44e0339319b5f71e$var$router.patch("/change-password", (0, $954eef978b11b382$export$66cdde5d6479813c)(5, 1800000, "Try changing your password in an hour."), $f714d77269cfd46b$export$e2853351e15b7895);
$44e0339319b5f71e$var$router.patch("/update", (0, $954eef978b11b382$export$66cdde5d6479813c)(25, 1800000, "Try updating your profile in an hour."), $f714d77269cfd46b$export$5880729c5d131040);
$44e0339319b5f71e$var$router.delete("/delete-me", $f714d77269cfd46b$export$8788023029506852);
$44e0339319b5f71e$var$router.use($f714d77269cfd46b$export$e1bac762c84d3b0c("admin"));
$44e0339319b5f71e$var$router.route("/").get($7e8f8fa525957e7e$export$69093b9c569a5b5b);
$44e0339319b5f71e$var$router.route("/:id").delete($7e8f8fa525957e7e$export$7d0f10f273c0438a).get($7e8f8fa525957e7e$export$84e4772154052003);
var $44e0339319b5f71e$export$2e2bcd8739ae039 = $44e0339319b5f71e$var$router;




const $feedcb1ee3067266$var$app = (0, ($parcel$interopDefault($1zVyf$express)))();
// Genral middlewares
$feedcb1ee3067266$var$app.use("/api", (0, $954eef978b11b382$export$66cdde5d6479813c)(100, 240000, "Too many requests! Please try again later."));
$feedcb1ee3067266$var$app.use((0, ($parcel$interopDefault($1zVyf$express))).json({
    limit: "10kb"
}), (0, ($parcel$interopDefault($1zVyf$helmet)))(), (0, ($parcel$interopDefault($1zVyf$expressmongosanitize)))(), (0, ($parcel$interopDefault($1zVyf$xssclean)))(), (0, ($parcel$interopDefault($1zVyf$hpp)))({
    whitelist: [
        "duration",
        "price",
        "difficulty",
        "averageRating",
        "ratingsQuantity",
        "maxGroupSize", 
    ]
}));
$feedcb1ee3067266$var$app.use((0, ($parcel$interopDefault($1zVyf$compression)))());
$feedcb1ee3067266$var$app.use((0, ($parcel$interopDefault($1zVyf$cookieparser)))());
$feedcb1ee3067266$var$app.use((0, ($parcel$interopDefault($1zVyf$cors)))());
// Routers middlewares
$feedcb1ee3067266$var$app.use("/api/v1/tours", (0, $59c637b82b59978a$export$2e2bcd8739ae039));
$feedcb1ee3067266$var$app.use("/api/v1/users", (0, $44e0339319b5f71e$export$2e2bcd8739ae039));
$feedcb1ee3067266$var$app.use("/api/v1/reviews", (0, $7ead2b4393053d39$export$2e2bcd8739ae039));
// Unknown route error
$feedcb1ee3067266$var$app.all("*", (req, _, next)=>next(new (0, $9236c11e0578ae89$export$2e2bcd8739ae039)(`No routes specified at ${req.originalUrl}`, 404)));
$feedcb1ee3067266$var$app.use((0, $8d356f125fa9379d$export$f817c67b4a20d3d5));
var $feedcb1ee3067266$export$2e2bcd8739ae039 = $feedcb1ee3067266$var$app;



var $9eab8fe93afb583f$var$__dirname = "src";
$1zVyf$process.on("uncaughtException", (err)=>{
    console.log("\uD83E\uDDE8\uFE0F\uD83E\uDDE8\uFE0FUNHANDLED Execption\uD83E\uDDE8\uFE0F\uD83E\uDDE8\uFE0F:\n");
    console.log(err.name, err.message);
    $1zVyf$process.exit(1);
});
(0, ($parcel$interopDefault($1zVyf$dotenv))).config({
    path: `${$9eab8fe93afb583f$var$__dirname}/../.env`
});
const $9eab8fe93afb583f$var$connectionURL = "mongodb+srv://perisha:<password>@cluster0.ctx5x.mongodb.net/passager?retryWrites=true&w=majority"?.replace("<password>", "MongodbwithJonas");
(0, ($parcel$interopDefault($1zVyf$mongoose))).connect($9eab8fe93afb583f$var$connectionURL).then(()=>console.log("Connection with db has been established.")).catch((err)=>console.log(err));
const $9eab8fe93afb583f$var$server = (0, $feedcb1ee3067266$export$2e2bcd8739ae039).listen("7777", ()=>{
    console.log(`App is running on port ${"7777"}`);
});
$1zVyf$process.on("unhandledRejection", (err)=>{
    console.log("\uD83E\uDDE8\uFE0F\uD83E\uDDE8\uFE0FUNHANDLED PROMISE REGECTION\uD83E\uDDE8\uFE0F\uD83E\uDDE8\uFE0F:\n");
    console.log(err.name, err.message);
    $9eab8fe93afb583f$var$server.close(()=>{
        $1zVyf$process.exit(1);
    });
});


