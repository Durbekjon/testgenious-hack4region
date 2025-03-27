import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { TestGatewayModule } from './test-gateway/test-gateway.module';

@Module({
  imports: [CoreModule, TestGatewayModule],
})
export class AppModule {}
