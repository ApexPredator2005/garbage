import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CommunicationService } from './communication.service';

@ApiTags('Module 07: Communication & SLA Helpdesk')
@Controller('communication')
export class CommunicationController {
  constructor(private readonly commService: CommunicationService) {}

  @Get('notices')
  @ApiOperation({ summary: 'Fetch audience-targeted campus notices and circulars' })
  async getNotices(@Query('audience') audience = 'ALL') {
    return this.commService.getNotices(audience);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'Fetch SLA-tracked helpdesk and grievance tickets' })
  async getTickets(@Query('status') status = 'ALL') {
    return this.commService.getTickets(status);
  }

  @Post('tickets/:id/resolve')
  @ApiOperation({ summary: 'Resolve grievance ticket and notify student via In-App / Email' })
  async resolve(
    @Param('id') ticketId: string,
    @Body() body: { remarks: string; staffEmpId: string }
  ) {
    return this.commService.resolveTicket(ticketId, body.remarks, body.staffEmpId);
  }
}
