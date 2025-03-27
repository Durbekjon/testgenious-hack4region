import { Module } from '@nestjs/common';
import { TestGateway } from './test.gateway';
import { ConfigModule } from '@nestjs/config';
import { GeminiFlashService } from './services/gemini-flash.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [TestGateway, GeminiFlashService],
  exports: [TestGateway],
})
export class TestGatewayModule {}
