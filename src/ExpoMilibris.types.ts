enum ReaderLanguage {
  EN_US = "en-US",
  FR_FR = "fr-FR",
  ES_ES = "es-ES",
  DE_DE = "de-DE",
  IT_IT = "it-IT",
  PT_PT = "pt-PT",
  NL_NL = "nl-NL",
}

enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

type ReaderConfig = {
  features?: {
    printEnabled?: boolean;
    textToSpeechEnabled?: boolean;
    shareEnabled?: boolean;
    summaryEnabled?: boolean;
    summaryImagesEnabled?: boolean;
    faceCropEnabled?: boolean;
    imageCropEnabled?: boolean;
  };
  articleReader?: {
    features?: {
      forceLayout?: "default" | "custom";
      isImageCropEnabled?: boolean;
    };
  };
  logo?: string;
  targetPageNumber?: number;
  debugBoxes?: boolean;
};

type SearchResult = {
  articleId: string;
  title: string;
  highlights: string[];
};

type SearchResponse = {
  results: SearchResult[];
  suggestions?: string[];
};

type ArticlePreview = {
  articleId: string;
  title: string;
  summary?: string;
  imageUrl?: string;
};

type SharingContent = {
  url: string;
  title: string;
};

type BookmarkActionSource = "article" | "summary";

type ReaderEvent = {
  type: "pageChanged" | "articleOpened" | "readerClosed" | "error";
  data?: Record<string, unknown>;
};

type OpenReaderOptions = {
  releasePath: string;
  articlesLanguageCode: ReaderLanguage;
  config?: ReaderConfig;
  licenseKey?: string;
  baseUrl?: string;
  issueId?: string;
  coverImageUrl?: string;
  coverRatio?: number;
};

type ReaderResult = {
  status: "success" | "error" | "cancelled";
  data?: {
    lastPageNumber?: number;
    error?: string;
  };
};

export { LogLevel, ReaderLanguage };
export type {
  ArticlePreview,
  BookmarkActionSource,
  OpenReaderOptions,
  ReaderConfig,
  ReaderEvent,
  ReaderResult,
  SearchResponse,
  SearchResult,
  SharingContent,
};
