import { SetMetadata } from '@nestjs/common';

export const Role = (roleMetaData: string) => SetMetadata('role', roleMetaData);
