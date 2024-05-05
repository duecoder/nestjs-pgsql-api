import { BaseQueryParameters } from 'src/shared/BaseQueryParameters';

export class FindUsersQueryDto extends BaseQueryParameters {
  name: string;
  email: string;
  status: boolean;
  role: string;
}
