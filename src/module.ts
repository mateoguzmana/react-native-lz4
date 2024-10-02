import { NativeModules, Platform } from 'react-native';
import type { Lz4Type } from './types';

const LINKING_ERROR =
  `The package 'react-native-lz4' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const Lz4Module = isTurboModuleEnabled
  ? require('./NativeLz4').default
  : NativeModules.Lz4;

export const Lz4 = Lz4Module
  ? Lz4Module
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const _global = global as unknown as Lz4Type;
