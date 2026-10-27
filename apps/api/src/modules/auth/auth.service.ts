import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../platform/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, role = 'PRINCIPAL', tenantId = 't-1') {
    // Generate access token (15-minute expiration per spec)
    const payload = {
      sub: `user-${Date.now()}`,
      email,
      role,
      tenantId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 900, // 15 mins
      user: {
        id: payload.sub,
        email,
        role,
        tenantId,
      },
    };
  }

  async getProfile(user: any) {
    return {
      id: user.sub,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      permissions: [
        'academic:read',
        'attendance:write',
        'exams:moderate',
        'fees:audit',
        'payroll:view',
      ],
    };
  }
}
