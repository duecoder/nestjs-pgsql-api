import { BaseQueryParametersDto } from 'src/shared/base-query-params.dto';

export class FindUsersQueryDto extends BaseQueryParametersDto {
  name: string;
  email: string;
  status: boolean;
  role: string;
}
