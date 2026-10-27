import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Authentication & Identity')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and issue short-lived JWT' })
  @ApiResponse({ status: 200, description: 'JWT Access Token generated' })
  async login(
    @Body() body: { email: string; role?: string },
    @Headers('x-tenant-id') tenantId?: string
  ) {
    return this.authService.login(body.email, body.role, tenantId || 't-1');
  }

  @Get('me')
  @ApiOperation({ summary: 'Retrieve authenticated profile and permissions' })
  async getProfile(@Headers('x-tenant-id') tenantId?: string) {
    return this.authService.getProfile({
      sub: 'usr-current',
      email: 'principal@jssate.campus.edu',
      role: 'PRINCIPAL',
      tenantId: tenantId || 't-1',
    });
  }
}
