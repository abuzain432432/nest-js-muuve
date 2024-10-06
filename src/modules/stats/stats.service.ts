import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PropertyService } from '../property/property.service';
import { IUser } from 'src/common/types/user.type';

@Injectable()
export class StatsService {
  constructor(private propertyService: PropertyService) {}
  async getStatsByYear(user: IUser, year: number) {
    const propertyStats = await this.propertyService.gePropertiesStats(
      user,
      year,
    );
    return propertyStats;
  }
}
