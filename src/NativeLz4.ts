import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
  getLz4VersionNumber(): Promise<number>;
  getLz4VersionString(): Promise<string>;
  compressFile(sourcePath: string, destinationPath: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Lz4');
