import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

type TokenType = 'access' | 'refresh';

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
    // Create a new object with only the required properties
    const tokenPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return this.jwtService.signAsync(
      tokenPayload as any, // Temporary type assertion to avoid type issues
      {
        secret: this.getSecret(type),
        expiresIn: this.getExpiresIn(type),
      } as any,
    );
  }

  async verifyToken(token: string, isRefreshToken = false): Promise<JwtPayload | null> {
    try {
      const type: TokenType = isRefreshToken ? 'refresh' : 'access';
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.getSecret(type),
      });
    } catch (error) {
      return null;
    }
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
