import { Module } from '@nestjs/common';
import { TestGateway } from './test.gateway';
import { ConfigModule } from '@nestjs/config';
import { GeminiFlashService } from './services/gemini-flash.service';
import { TestService } from 'src/platform-api/test/test.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [TestGateway, GeminiFlashService, TestService, PrismaService],
  exports: [TestGateway],
})
export class TestGatewayModule {}
