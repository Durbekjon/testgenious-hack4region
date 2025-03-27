import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, BadRequestException } from '@nestjs/common';
import { EVENTS } from './events';
import { GeminiFlashService } from './services/gemini-flash.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('TestGateway');

  constructor(private readonly geminiFlashService: GeminiFlashService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      const test = await this.geminiFlashService.generateTest(
        'Math',
        'Algebra',
        'Easy',
        'Multiple Choice',
        30,
        'English',
      );
      this.logger.log('Test generated successfully', test);
      client.emit('testGenerated', test);
    } catch (error) {
      this.logger.error('Error generating test:', error);
      client.emit('error', { message: 'Failed to generate test' });
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private isValidPayload(payload: any, requiredFields: string[]): boolean {
    return requiredFields.every((field) => payload.hasOwnProperty(field));
  }

  @SubscribeMessage(EVENTS.CREATE_TEST_BY_FORM)
  async handleCreateTestByForm(
    client: Socket,
    payload: {
      subject: string;
      topic: string;
      difficulty_level: string;
      test_format: string;
      number_of_questions: number;
      user_prompt: string;
    },
  ) {
    try {
      const requiredFields = [
        'subject',
        'topic',
        'difficulty_level',
        'test_format',
        'number_of_questions',
        'user_prompt',
      ];
      if (!this.isValidPayload(payload, requiredFields)) {
        throw new BadRequestException('Invalid payload structure');
      }

      this.logger.log(
        `Client ${client.id} created test: ${payload.subject} - ${payload.topic}`,
      );

      const test = await this.geminiFlashService.generateTest(
        payload.subject,
        payload.topic,
        payload.difficulty_level,
        payload.test_format,
        payload.number_of_questions,
        payload.user_prompt,
      );

      client.emit(EVENTS.TEST_CREATED, test);
    } catch (error) {
      this.logger.error(`Error creating test: ${error.message}`);
      client.emit(EVENTS.ERROR, { message: error.message });
    }
  }

  @SubscribeMessage(EVENTS.CREATE_TEST_BY_BOOK)
  async handleCreateTestByBook(client: Socket, payload: any) {
    try {
      if (!payload.testId) {
        throw new BadRequestException('testId is required');
      }

      client.join(`test:${payload.testId}`);
      this.logger.log(
        `Client ${client.id} created test by book: ${payload.testId}`,
      );

      return { event: EVENTS.TEST_CREATED, data: { testId: payload.testId } };
    } catch (error) {
      this.logger.error(`Error creating test by book: ${error.message}`);
      client.emit(EVENTS.ERROR, { message: error.message });
    }
  }

  @SubscribeMessage('joinTest')
  handleJoinTest(client: Socket, payload: { testId: string }) {
    client.join(`test:${payload.testId}`);
    this.logger.log(`Client ${client.id} joined test: ${payload.testId}`);
    return { event: 'joinTest', data: { testId: payload.testId } };
  }

  @SubscribeMessage('leaveTest')
  handleLeaveTest(client: Socket, payload: { testId: string }) {
    client.leave(`test:${payload.testId}`);
    this.logger.log(`Client ${client.id} left test: ${payload.testId}`);
    return { event: 'leaveTest', data: { testId: payload.testId } };
  }

  @SubscribeMessage('submitAnswer')
  handleSubmitAnswer(client: Socket, payload: { testId: string; answer: any }) {
    this.server.to(`test:${payload.testId}`).emit('answerSubmitted', {
      clientId: client.id,
      answer: payload.answer,
    });
    return { event: 'submitAnswer', data: { testId: payload.testId } };
  }

  @SubscribeMessage('testProgress')
  handleTestProgress(
    client: Socket,
    payload: { testId: string; progress: number },
  ) {
    this.server.to(`test:${payload.testId}`).emit('progressUpdated', {
      clientId: client.id,
      progress: payload.progress,
    });
    return {
      event: 'testProgress',
      data: { testId: payload.testId, progress: payload.progress },
    };
  }
}
