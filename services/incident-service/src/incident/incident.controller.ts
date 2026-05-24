import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { IncidentService } from './incident.service';

@Controller('incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  report(@Body() body: { title: string; description?: string; zone?: string; severity?: string; reportedBy?: string }) {
    return this.incidentService.report(body);
  }

  @Get()
  list(@Query('status') status?: string) {
    return this.incidentService.list(status);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.incidentService.detail(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.incidentService.updateStatus(id, body.status);
  }
}
