import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export interface TenantRequest extends FastifyRequest {
  tenantId?: string;
  subdomain?: string;
}

@Injectable()
export class TenancyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    
    // Resolve tenant from header or subdomain
    const headerTenantId = request.headers['x-tenant-id'] as string;
    const host = request.headers['host'] || '';
    const subdomain = host.split('.')[0];

    // Priority: x-tenant-id header, then subdomain fallback
    const tenantId = headerTenantId || (subdomain !== 'localhost' && subdomain ? subdomain : 't-1');

    if (!tenantId) {
      throw new BadRequestException('Missing tenant context: x-tenant-id header or valid college subdomain required');
    }

    request.tenantId = tenantId;
    request.subdomain = subdomain;
    return true;
  }
}
