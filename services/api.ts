
const API_BASE_URL = "http://localhost:8000";

export class ApiService {
  static async sendChatMessage(prompt: string, llmId?: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          prompt,
          model: llmId // if your backend supports model selection
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response ?? "No response received.";
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // You can add more API methods here
  static async getModels() {
    // Future: fetch available models from backend
  }

  static async getChatHistory(chatId: string) {
    // Future: fetch chat history
  }
}