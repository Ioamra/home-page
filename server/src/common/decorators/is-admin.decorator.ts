import { SetMetadata } from '@nestjs/common';

export const IsAdmin = (): MethodDecorator & ClassDecorator => SetMetadata('isAdmin', true);
