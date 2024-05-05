import { SetMetadata } from '@nestjs/common';

export const Role: any = (role: string) => SetMetadata('role', role);
