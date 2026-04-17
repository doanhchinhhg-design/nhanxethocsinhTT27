import { GoogleGenAI } from "@google/genai";
import { Level, AssessmentPeriod } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateComment(
  subject: string,
  level: Level,
  grade?: string,
  period?: AssessmentPeriod,
  previousComments: string[] = [],
  retries = 3
): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Bạn là chuyên gia giáo dục tiểu học tại Việt Nam. Hãy viết 01 lời nhận xét học sinh (tối đa 15 từ) cho môn ${subject}${grade ? ` khối ${grade}` : ""}.
    Thời điểm đánh giá: ${period || "Cuối năm học"}.
    Đánh giá theo Thông tư 27/2020/TT-BGDĐT và bám sát "Yêu cầu cần đạt" của Chương trình GDPT 2018.
    
    Mức độ đánh giá: ${level === 'Tốt' ? 'Hoàn thành tốt (T)' : level === 'Đạt' ? 'Hoàn thành (H)' : 'Chưa hoàn thành (C)'}.
    
    Yêu cầu nội dung cho từng mức độ:
    - Nếu là Hoàn thành tốt (T): Nhận xét phải nêu bật được sự vượt trội, kỹ năng thành thạo, tính sáng tạo hoặc khả năng vận dụng linh hoạt kiến thức. Sử dụng các từ mạnh như "thành thạo", "sáng tạo", "tự giác", "xuất sắc".
    - Nếu là Hoàn thành (H): Nhận xét khẳng định học sinh nắm vững kiến thức cơ bản, hoàn thành đầy đủ các yêu cầu và nhiệm vụ học tập. Sử dụng các từ như "nắm vững", "đầy đủ", "đúng quy trình".
    - Nếu là Chưa hoàn thành (C): Nhận xét mang tính khích lệ, chỉ rõ phần kiến thức/kỹ năng còn yếu và hướng khắc phục cụ thể.
    
    Quy tắc:
    1. KHÔNG ghi tên học sinh, không xưng hô (Em/Con).
    2. Viết trực tiếp vào năng lực chuyên môn (VD: "Tính toán thành thạo, giải toán có lời văn mạch lạc.").
    3. Tránh trùng lặp với các câu sau: ${previousComments.slice(-5).join("; ")}.
    4. Ngôn ngữ súc tích, chuẩn mực sư phạm, không sáo rỗng.
    5. Phải phù hợp với thời điểm ${period || "Cuối năm học"}.
    
    Chỉ trả về duy nhất nội dung nhận xét.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.code === 429)) {
      const delay = (4 - retries) * 2000; // Exponential backoff: 2s, 4s, 6s
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateComment(subject, level, grade, period, previousComments, retries - 1);
    }
    console.error("Error generating comment:", error);
    return "Hoàn thành các yêu cầu cần đạt của môn học.";
  }
}
