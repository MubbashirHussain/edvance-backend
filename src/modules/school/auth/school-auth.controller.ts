import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SchoolSigninDto } from './dto/signin.dto';
import { SchoolAuthService } from './school-auth.service';
import { RefreshTokenDto } from '../../superadmin/auth/dto/refresh-token.dto';

@ApiTags('school/auth')
@Controller('school/auth')
export class SchoolAuthController {
  constructor(private readonly authService: SchoolAuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login for school personnel' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully authenticated' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials or access denied' 
  })
  @ApiBody({ type: SchoolSigninDto })
  async signin(@Body() signinDto: SchoolSigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token successfully refreshed' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid refresh token' 
  })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(
      refreshTokenDto.userId,
      refreshTokenDto.refreshToken,
    );
  }
}
