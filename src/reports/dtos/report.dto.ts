import { Expose, Transform } from 'class-transformer';
import { Report } from '../report.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ obj }: { obj: Report }) => obj.user.id)
  userId: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  miles: number;

  @Expose()
  approved: boolean;
}
