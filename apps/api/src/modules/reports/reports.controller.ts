import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Module 08: Reports & Regulatory Analytics')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('kpi')
  @ApiOperation({ summary: 'Query fast Materialized View summary KPIs' })
  async getKpis() {
    return this.reportsService.getExecutiveKpis();
  }

  @Post('regulatory-export')
  @ApiOperation({ summary: 'Generate 1-click statutory compliance return package (NAAC/NBA/NIRF/AISHE)' })
  async generateReturn(@Body() body: { agency: 'NAAC' | 'NBA' | 'NIRF' | 'AISHE' }) {
    return this.reportsService.generateRegulatoryReturn(body.agency);
  }

  @Post('query-builder/execute')
  @ApiOperation({ summary: 'Anti-Injection: Execute safe parameterized SQL against curated view catalog' })
  async executeQuery(
    @Body()
    body: {
      entity: string;
      columns: string[];
      deptFilter?: string;
      minCgpa?: number;
    }
  ) {
    return this.reportsService.executeCuratedQuery(
      body.entity,
      body.columns,
      body.deptFilter,
      body.minCgpa
    );
  }
}
