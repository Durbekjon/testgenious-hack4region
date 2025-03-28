import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { TestGatewayModule } from './test-gateway/test-gateway.module';
import { TestModule } from './platform-api/test/test.module';

@Module({
  imports: [CoreModule, TestGatewayModule, TestModule],
})
export class AppModule {}
