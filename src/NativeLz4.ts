import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getLz4VersionNumber(): Promise<number>;
  getLz4VersionString(): Promise<string>;
  compressFile(sourcePath: string, destinationPath: string): Promise<boolean>;
  decompressFile(sourcePath: string, destinationPath: string): Promise<boolean>;
  initializeLz4(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Lz4');
