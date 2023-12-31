import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelper } from '../../../helpers/jwtHelper';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;
  const isUserExist = await User.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (!(await User.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { id: userId, role, needsPasswordChange } = isUserExist;

  const accessToken = jwtHelper.createToken(
    { userId, role },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string,
  );

  const refreshToken = jwtHelper.createToken(
    { userId, role },
    config.jwt.jwt_refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelper.verifyToken(
      token,
      config.jwt.jwt_refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  const isUserExist = await User.isUserExist(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const newAccessToken = jwtHelper.createToken(
    { id: userId, role: isUserExist.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  const isUserExist = await User.findOne({ id: user.userId }).select(
    '+password',
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (!(await User.isPasswordMatched(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  isUserExist.password = newPassword;
  isUserExist.needsPasswordChange = false;
  isUserExist.save();
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
