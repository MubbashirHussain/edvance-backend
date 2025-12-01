import { ExecutionContext, Injectable, UnauthorizedException, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type TokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  [key: string]: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      
      // Attach the user payload to the request object
      request.user = payload;
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

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  private getSecret(type: TokenType): string {
    const secret = type === 'access' 
      ? process.env.JWT_ACCESS_SECRET 
      : process.env.JWT_REFRESH_SECRET;
    
    if (!secret) {
      throw new Error(`${type.toUpperCase()}_SECRET is not defined in environment`);
    }
    return secret;
  }

  private getExpiresIn(type: TokenType): string {
    return type === 'access'
      ? process.env.JWT_ACCESS_EXPIRES_IN || '15m'
      : process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, 'access'),
      this.generateToken(payload, 'refresh'),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateToken(payload: JwtPayload, type: TokenType): Promise<string> {
    const tokenPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return this.jwtService.signAsync(
      tokenPayload,
      {
        secret: this.getSecret(type),
        expiresIn: this.getExpiresIn(type),
      } as any
    );
  }

  async verifyToken(token: string, type: TokenType = 'access'): Promise<JwtPayload> {
    try {
      const secret = this.getSecret(type);
      const payload = await this.jwtService.verifyAsync(token, { secret });
      return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateUser(payload: JwtPayload): Promise<JwtPayload> {
    // Here you can add additional validation if needed
    // For example, check if the user exists in the database
    return payload;
  }

  getPayloadFromToken(token: string): JwtPayload | null {
    try {
      const payload = this.jwtService.decode(token);
      return payload as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
