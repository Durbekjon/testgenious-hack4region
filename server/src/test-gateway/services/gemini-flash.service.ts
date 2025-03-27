import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GeminiFlashService {
  private ai: any;
  private model: string;
  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get('GEMINI_API_KEY'),
    });
    this.model = this.configService.get('GEMINI_MODEL');
  }

  async generateTest(
    subject: string,
    topic: string,
    difficulty_level: string,
    test_format: string,
    number_of_questions: number,
    language: string,
  ) {
    const prompt = `You are an AI specialized in generating structured tests.
         Generate a test in **${language}** with the following details:
         
         - **Subject**: ${subject}
         - **Topic**: ${topic}
         - **Difficulty Level**: ${difficulty_level} (Easy, Medium, Hard)
         - **Test Format**: ${test_format} (Multiple Choice, True/False, Fill in the Blank, etc.)
         - **Number of Questions**: ${number_of_questions}

         ***IMPORTANT:*** Return the response in **valid JSON format only** without markdown, explanations, or extra text.
         The JSON must follow this structure:
         {
           "test_id": "unique_test_id",
           "generated_part": 1,
           "total_parts": 1,
           "questions": [
             {
               "question_id": "unique_question_id",
               "question": "Example question?",
               "options": [
                 { "id": "a1", "text": "Option 1" },
                 { "id": "b1", "text": "Option 2" },
                 { "id": "c1", "text": "Option 3" },
                 { "id": "d1", "text": "Option 4" }
               ],
               "correct_answer_id": "a1",
               "options_order": ["b1", "a1", "d1", "c1"]
             }
           ],
           "continue": false
         }`;
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: [
        {
          type: 'text',
          text: prompt,
        },
      ],
    });
    const result = response.candidates[0].content.parts[0].text
    if (result.includes('```json')) {
      return JSON.parse(result.replace('```json', '').replace('```', ''));
    }
    return result;
  }

  async continueTest(
    testId: string,
    generatedPart: number,
    totalParts: number,
  ) {
    const prompt = `Continue generating the test. Use the same format.
         Test ID: ${testId}, Part: ${generatedPart}/${totalParts}`;
    const response = await this.ai.generateContent({
      model: this.model,
      prompt,
    });
    return response.text();
  }
}
