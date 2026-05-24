import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';

@Controller()
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('health')
  health() {
    return this.vehicleService.health();
  }

  @Post('vehicles')
  createVehicle(@Body() body: { plateNumber?: string; model?: string; status?: string }) {
    return this.vehicleService.createVehicle(body);
  }

  @Get('vehicles')
  listVehicles() {
    return this.vehicleService.listVehicles();
  }

  @Get('vehicles/:id')
  getVehicle(@Param('id') id: string) {
    return this.vehicleService.getVehicle(id);
  }

  @Post('vehicles/:id/positions')
  recordPosition(
    @Param('id') vehicleId: string,
    @Body() body: { lat?: number; lng?: number; speed?: number; recordedAt?: string },
  ) {
    return this.vehicleService.recordPosition(vehicleId, body);
  }

  @Get('vehicles/:id/positions')
  listPositions(@Param('id') vehicleId: string, @Query('limit') limit?: string) {
    return this.vehicleService.listPositions(vehicleId, limit);
  }
}
