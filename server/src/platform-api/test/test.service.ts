import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {}

  async createTest(body: any) {
    try {
      console.log(body.questions);
      // Test ma'lumotlarini transform qilish
      const transformedTest = {
        title: 'Test Genius Online Test',
        questions: body.questions.map((q) => {
          // Eski ID larni yangi UUID bilan almashtiramiz
          const optionIdMap = q.options.reduce(
            (acc, opt) => {
              const newId = uuidv4();
              acc[opt.id] = newId; // Eski ID -> Yangi ID bog‘lash
              return acc;
            },
            {} as Record<string, string>,
          );

          return {
            question: q.question,
            correctAnswerId: q.correct_answer_id
              ? optionIdMap[q.correct_answer_id]
              : null, // Agar correctAnswerId yo‘q bo‘lsa, null
            explanation: q.explanation,
            options: q.options.map((opt) => ({
              id: optionIdMap[opt.id], // Har bir variant yangi unique ID oladi
              text: opt.text,
            })),
          };
        }),
      };

      // Prisma orqali test yaratish
      const test = await this.prisma.test.create({
        data: {
          id: Math.floor(10000 + Math.random() * 90000).toString(), // Random ID yaratish
          title: transformedTest.title,
          questions: {
            create: transformedTest.questions.map((q) => ({
              question: q.question,
              correctAnswerId: q.correctAnswerId ?? null, // null bo‘lishi mumkin
              explanation: q.explanation,
              options: {
                create: q.options.map((opt) => ({
                  id: opt.id, // Yangi UUID
                  text: opt.text,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      // 5 xonali kod yaratish
      const tempCode = await this.prisma.tempCode.create({
        data: {
          code: Math.floor(10000 + Math.random() * 90000),
          test: { connect: { id: test.id } },
        },
      });
      return { test, tempCode };
    } catch (error) {
      console.log(error);
    }
  }

  findTest(id: string) {
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }
  async findByTempCode(tempCode: number) {
    return await this.prisma.tempCode.findUnique({
      where: { code: tempCode },
      include: { test: true },
    });
  }
}
