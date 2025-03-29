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
import { TestService } from 'src/platform-api/test/test.service';

interface IPayload {
  subject: string;
  topic: string;
  difficulty_level: string;
  test_format: string;
  number_of_questions: number;
  user_prompt: string;
}

interface OnlineTestExam {
  id: string;
  isStarted: boolean;
  isFinished: boolean;
  time: string;
  startTime?: Date;
  endTime?: Date;
  participants: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    score?: number;
    isFinished?: boolean;
    isCheating?: boolean;
  }[];
  questions: any[];
  results?: {
    userId: string;
    score: number;
    submittedAt: Date;
  }[];
  isPublic?: boolean;
  isLive?: boolean;
}

@WebSocketGateway({
  cors: {
    origin: ['*'],
    credentials: true,
  },
})
export class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('TestGateway');
  private activeTests: Map<string, OnlineTestExam> = new Map();

  constructor(
    private readonly geminiFlashService: GeminiFlashService,
    private readonly testService: TestService,
  ) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.removeClientFromTests(client);
  }

  private removeClientFromTests(client: Socket) {
    for (const [testId, test] of this.activeTests.entries()) {
      if (!test || !test.participants) continue; // Xatolikni oldini olish

      const index = test.participants.findIndex((p) => p.id === client.id);
      if (index !== -1) {
        test.participants.splice(index, 1); // Ishtirokchini olib tashlash
        this.logger.log(`Client ${client.id} left test: ${testId}`);

        this.server
          .to(`test:${testId}`)
          .emit(EVENTS.USER_LEFT, { userId: client.id });

        // Agar testda hech kim qolmagan bo'lsa, testni o‘chiramiz
        if (test.participants.length === 0) {
          this.activeTests.delete(testId);
          this.logger.log(`Test ${testId} ended (no participants left).`);
        }
      }
    }
  }

  @SubscribeMessage(EVENTS.CREATE_TEST_BY_FORM)
  async handleCreateTestByForm(client: Socket, payload: IPayload) {
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
      this.activeTests.set(test.test_id, test);
      client.emit(EVENTS.TEST_CREATED, test);
    } catch (error) {
      this.logger.error(`Error creating test: ${error.message}`);
      client.emit(EVENTS.ERROR, { message: error.message });
    }
  }

  @SubscribeMessage(EVENTS.START_TEST)
  async handleStartTest(client: Socket, payload: any) {
    const { test, tempCode } = await this.testService.createTest(payload);
    console.log(tempCode);
    this.server.to(client.id).emit(EVENTS.START_TEST, { test, tempCode });
    this.logger.log(`Test ${test.id} started.`);
  }

  @SubscribeMessage(EVENTS.JOIN_TEST)
  async handleJoinTest(client: Socket, payload: { tempCode: number }) {
    try {
      const tempCode = Number(payload.tempCode);
      const tempCodeWithTest = await this.testService.findByTempCode(tempCode);
      if (!tempCodeWithTest) {
        return client.emit(EVENTS.ERROR, {
          message: 'Invalid code. Please recheck your code!',
        });
      }

      const test = await this.testService.findTest(tempCodeWithTest.testId);
      let testInstance = this.activeTests.get(test.id);

      if (!testInstance) {
        testInstance = {
          id: test.id,
          isStarted: false,
          isFinished: false,
          time: '60m',
          participants: [],
          questions: test.questions || [],
        };
        this.activeTests.set(test.id, testInstance);
      }

      client.join(`test:${test.id}`);
      testInstance.participants.push({
        id: client.id,
        firstName: 'Unknown',
        lastName: 'User',
        email: 'unknown@example.com',
      });

      this.server.to(`test:${test.id}`).emit(EVENTS.USER_JOINED, {
        testId: test.id,
        userId: client.id,
        test: test,
      });

      this.logger.log(`Client ${client.id} joined test: ${test.id}`);
    } catch (error) {
      this.logger.error(`Error joining test: ${error.message}`);
      client.emit(EVENTS.ERROR, {
        message: 'An error occurred while joining the test.',
      });
    }
  }

  @SubscribeMessage(EVENTS.LEAVE_TEST)
  async handleLeaveTest(client: Socket, payload: { testId: string }) {
    const test = this.activeTests.get(payload.testId);

    if (test) {
      test.participants = test.participants.filter((p) => p.id !== client.id);
      client.leave(`test:${payload.testId}`);

      this.logger.log(`Client ${client.id} left test: ${payload.testId}`);

      this.server.to(`test:${payload.testId}`).emit(EVENTS.USER_LEFT, {
        testId: payload.testId,
        userId: client.id,
      });

      if (test.participants.length === 0) {
        this.activeTests.delete(payload.testId);
        this.logger.log(`Test ${payload.testId} ended (no participants left).`);
      }
    } else {
      client.emit(EVENTS.ERROR, { message: 'Test not found!' });
    }
  }

  @SubscribeMessage(EVENTS.SUBMIT_ANSWER)
  handleSubmitAnswer(client: Socket, payload: { testId: string; answer: any }) {
    this.server.to(`test:${payload.testId}`).emit(EVENTS.ANSWER_SUBMITTED, {
      clientId: client.id,
      answer: payload.answer,
    });
  }

  @SubscribeMessage(EVENTS.TEST_PROGRESS)
  handleTestProgress(
    client: Socket,
    payload: { testId: string; progress: number },
  ) {
    this.server.to(`test:${payload.testId}`).emit(EVENTS.PROGRESS_UPDATED, {
      clientId: client.id,
      progress: payload.progress,
    });
  }

  private isValidPayload(payload: any, requiredFields: string[]): boolean {
    return requiredFields.every((field) => payload.hasOwnProperty(field));
  }
}
