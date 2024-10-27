import { Expose } from "class-transformer";

import { TourStatusEnum } from "../enums/tour-status.enum";

export class GetTourResponseDto {
  @Expose()
  readonly _id: string;
  @Expose()
  readonly message: string;
  @Expose()
  readonly status: TourStatusEnum;
  @Expose()
  readonly tenant: string;
  @Expose()
  readonly owner: string;
  @Expose()
  readonly property: string;
  @Expose()
  readonly tourDate: Date;
}
