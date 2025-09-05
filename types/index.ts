export type ScreenParamList = {
    MainTabs: undefined;
    Chat: { llmId: string };
  };
  
  export interface LLMIconDef {
    lib: "Ionicons" | "MaterialCommunityIcons";
    name: string;
  }
  
  export interface LLM {
    id: string;
    name: string;
    icon: LLMIconDef;
    description: string;
    colorStart: string;
    colorEnd: string;
    status: "active" | "coming-soon";
  }
  
  export interface Message {
    id: string;
    from: "user" | "ai";
    text: string;
    time: string;
  }