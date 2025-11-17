import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { SuperAdminSigninDto } from './dto/signin.dto';
import { SuperAdminSignupDto } from './dto/signup.dto';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { TokenService } from '../../../common/services/token.service';

@Injectable()
export class SuperAdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async signup(signupDto: SuperAdminSignupDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
        role: 'SUPER_ADMIN', // Ensure role is set to SUPER_ADMIN
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        middleName: true,
        lastName: true,
        role: true,
      },
    });

    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);

    return {
      user,
      ...tokens,
    };
  }

  async signin(signinDto: SuperAdminSigninDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: signinDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is a SUPER_ADMIN
    if (user.role !== 'SUPER_ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // In a real app, you would validate the refresh token here
    // For simplicity, we're just generating new tokens
    return this.getTokens(user.id, user.email, user.role);
  }

  private async getTokens(userId: string, email: string, role: string) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    return this.tokenService.generateTokens(jwtPayload);
  }
}
