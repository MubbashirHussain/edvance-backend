import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SuperAdminSigninDto } from './dto/signin.dto';
import { SuperAdminSignupDto } from './dto/signup.dto';
import { SuperAdminAuthService } from './superadmin-auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('superadmin/auth')
@Controller('superadmin/auth')
export class SuperAdminAuthController {
  constructor(private readonly authService: SuperAdminAuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new super admin' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: SuperAdminSignupDto })
  async signup(@Body() signupDto: SuperAdminSignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login for super admin' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: SuperAdminSigninDto })
  async signin(@Body() signinDto: SuperAdminSigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(
      refreshTokenDto.userId,
      refreshTokenDto.refreshToken
    );
  }

//   @UseGuards(AuthGuard('jwt'))
//   @Get('profile')
//   @ApiOperation({ summary: 'Get current user profile' })
//   @ApiResponse({ status: 200, description: 'Returns the user profile' })
//   @ApiResponse({ status: 401, description: 'Unauthorized' })
//   getProfile(@Request() req) {
//     return this.authService.getProfile(req.user.userId);
//   }
}
