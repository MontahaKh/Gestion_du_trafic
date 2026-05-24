import { Module } from '@nestjs/common';
import { IncidentModule } from './incident/incident.module';

@Module({
  imports: [IncidentModule],
})
export class AppModule {}
