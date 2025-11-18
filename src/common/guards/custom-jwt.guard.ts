import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';

@Injectable()
export class CustomJwtGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.tokenService.verifyToken(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
      
      // Attach user to request object
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role
      };
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
