import { SetMetadata } from '@nestjs/common';

export const IsConnected = (): MethodDecorator & ClassDecorator => SetMetadata('isConnected', true);
