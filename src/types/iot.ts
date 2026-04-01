export interface AiConfig {
  choice: "OpenAi";
  key: string;
  systemPrompt: string;
  model: string;
  endpoint: string;
  cdn: string;
  extraBody: string;
}

export interface HassConfig {
  endpoint: string;
  token: string;
}

export interface NewsConfig {
  choice: "chinaSound";
}

export interface MusicConfig {
  choice: "api";
  endpoint: string;
  locationId: string;
}

export interface DeviceConfig {
  id: string;
  name: string;
  createdAt?: string;
  aiConfig: AiConfig;
  hassConfig: HassConfig;
  newsConfig: NewsConfig;
  musicConfig: MusicConfig;
}

export interface GlobalConfig {
  hostIp: string;
  ytdlpEndpoint: string;
}

export const DEFAULT_AI_CONFIG: AiConfig = {
  choice: "OpenAi",
  key: "",
  systemPrompt: "你是一个智能音箱",
  model: "Qwen/Qwen3-8B",
  endpoint: "https://api-inference.modelscope.cn/v1",
  cdn: "https://yt.hutang.cloudns.be/v1",
  extraBody: "{\"enable_thinking\":false}",
};

export const DEFAULT_DEVICE_CONFIG = (id: string): DeviceConfig => ({
  id,
  name: "",
  aiConfig: { ...DEFAULT_AI_CONFIG },
  hassConfig: { endpoint: "", token: "" },
  newsConfig: { choice: "chinaSound" },
  musicConfig: { choice: "api", endpoint: "", locationId: "" },
});

export const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  hostIp: "http://192.168.2.2:18888",
  ytdlpEndpoint: "https://yt.hutang.cloudns.be/youtube",
};
