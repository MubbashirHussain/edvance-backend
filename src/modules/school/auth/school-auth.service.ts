import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { SchoolSigninDto } from './dto/signin.dto';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { TokenService } from '../../../common/services/token.service';
import { UserRole } from '../../../common/enums/user-role.enum';

@Injectable()
export class SchoolAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async signin(signinDto: SchoolSigninDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: signinDto.email },
    });

    if (!user?.id) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is a school admin or staff
    if (
      user.role !== UserRole.SCHOOL_ADMIN &&
      user.role !== UserRole.SCHOOL_STAFF
    ) {
      throw new UnauthorizedException('Access denied. School personnel only.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);

    // Update last login and refresh token
    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLogin: new Date(),
        refreshToken: tokens.refreshToken 
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        role: user.role,
        schoolId: user.schoolId,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { 
        id: userId,
        refreshToken: refreshToken,
      },
      select: { 
        id: true, 
        email: true, 
        role: true,
        schoolId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);

    // Update refresh token in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
      },
      ...tokens,
    };
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
