import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { DatabaseModule } from '@app/common/database/database.module';
import { ReservationsModule as RestReservationModule } from './reservations/reservations.module';

@Module({
  imports: [DatabaseModule, RestReservationModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
