import { AuthGuard } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorMessages } from '../../../common/constants/error-messages.constant';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super()
    }

    handleRequest(err: any, user: any, info: any) {
        if (info?.name === 'TokenExpiredError') {
            throw new UnauthorizedException(ErrorMessages.AUTH.TOKEN_EXPIRADO);
        }

        if (info?.name === 'JsonWebTokenError' || err || !user) {
            throw new UnauthorizedException(ErrorMessages.AUTH.TOKEN_INVALIDO);
        }
        return user;
    }
}