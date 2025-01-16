import { Router } from "express";

import { AuthController } from "../controllers/AuthController";
import { validateResource } from "../middleware/validateResource";
import {
  UserRegistrationSchema,
  UserConfirmationSchema,
  UserLoginSchema,
  ForgotPasswordSchema,
  validateTokenSchema,
  ResetPasswordSchema,
  UpdatePasswordSchema,
  CheckAuthUserPasswordSchema,
} from "../schemas/authSchema";
import { limiter } from "../config/limiter";
import { isAuthenticatedUser } from "../middleware/auth";

const router = Router();

router.use(limiter); // limit requests

/*      public routes       */
router.post(
  "/create-account",
  validateResource(UserRegistrationSchema),
  AuthController.createAccount
);
// Not use get because we don't want splited data in the url var
router.post(
  "/confirm-account",
  validateResource(UserConfirmationSchema),
  AuthController.confirmAccount
);
router.post("/login", validateResource(UserLoginSchema), AuthController.login);
router.post(
  "/forgot-password",
  validateResource(ForgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  "/validate-token",
  validateResource(validateTokenSchema),
  AuthController.validateToken
);
router.post(
  "/reset-password/:token",
  validateResource(ResetPasswordSchema),
  AuthController.resetPasswordWithToken
);

/*      privates routes       */
router.get("/user", isAuthenticatedUser, AuthController.getUser);
router.post(
  "/reset-auth-password",
  validateResource(UpdatePasswordSchema),
  isAuthenticatedUser,
  AuthController.updateCurrentUserPassword
);
router.post(
  "/check-password",
  validateResource(CheckAuthUserPasswordSchema),
  isAuthenticatedUser,
  AuthController.checkPassword
);

export default router;
