import { NextFunction, Request, Response } from 'express';
import { jwtHelper } from '../../helpers/jwtHelper';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Authorization Failed');
      }
      let verifiedUser = null;
      verifiedUser = jwtHelper.verifyToken(
        token as string,
        config.jwt.jwt_secret as Secret,
      );
      if (!verifiedUser) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Token');
      }
      req.user = verifiedUser;
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
