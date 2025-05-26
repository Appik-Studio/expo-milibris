import { requireNativeModule } from "expo-modules-core";
import type { OpenReaderOptions, ReaderResult } from "./ExpoMilibris.types";

interface ExpoMilibrisModule {
  openReader(options: OpenReaderOptions): Promise<ReaderResult>;
  setLogLevel(level: string): void;
  downloadAndUnpackArchive(
    ticketUrl: string,
    destinationPath: string
  ): Promise<string>;
}

export default requireNativeModule<ExpoMilibrisModule>("ExpoMilibris");
