import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Controller()
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get('health')
  health() {
    return this.trafficService.health();
  }

  @Post('traffic/zones')
  createZone(
    @Body()
    body: {
      name?: string;
      bbox?: { minLat?: number; minLng?: number; maxLat?: number; maxLng?: number };
    },
  ) {
    return this.trafficService.createZone(body);
  }

  @Get('traffic/zones')
  listZones() {
    return this.trafficService.listZones();
  }

  @Get('traffic/zones/:id')
  getZone(@Param('id') id: string) {
    return this.trafficService.getZone(id);
  }

  @Post('traffic/zones/:id/calculate')
  calculate(@Param('id') zoneId: string, @Body() body: { windowMinutes?: number }) {
    return this.trafficService.calculate(zoneId, body);
  }
}
