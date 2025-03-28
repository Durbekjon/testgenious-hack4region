import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

interface Option {
  text: string;
}

interface Question {
  questionId: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options: Option[];
  correctAnswerId: string;
  explanation?: string;
}

interface Test {
  title: string;
  questions: Question[];
}

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {}
  async createTest(test: Test) {
    return this.prisma.test.create({
      data: {
        title: test.title,
        questions: {
          create: test.questions.map((q) => ({
            questionId: q.questionId,
            text: q.text,
            type: q.type,
            correctAnswerId: q.correctAnswerId,
            explanation: q.explanation,
            options: {
              create: q.options.map((opt) => ({ text: opt.text })),
            },
          })),
        },
      },
    });
  }
}
