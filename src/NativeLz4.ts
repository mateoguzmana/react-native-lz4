import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  initializeLz4(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Lz4');
