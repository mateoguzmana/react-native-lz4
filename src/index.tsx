import { NativeModules, Platform } from 'react-native';
import { formatFilePath } from './utils/formatFilePath';

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

const Lz4 = Lz4Module
  ? Lz4Module
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function getLz4VersionNumber(): Promise<number> {
  return Lz4.getLz4VersionNumber();
}

export function getLz4VersionString(): Promise<string> {
  return Lz4.getLz4VersionString();
}

export function compressFile(
  sourcePath: string,
  destinationPath: string
): Promise<boolean> {
  const strippedSourcePath = formatFilePath(sourcePath);
  const strippedDestinationPath = formatFilePath(destinationPath);

  return Lz4.compressFile(strippedSourcePath, strippedDestinationPath);
}

export function decompressFile(
  sourcePath: string,
  destinationPath: string
): Promise<boolean> {
  const strippedSourcePath = formatFilePath(sourcePath);
  const strippedDestinationPath = formatFilePath(destinationPath);

  return Lz4.decompressFile(strippedSourcePath, strippedDestinationPath);
}

export function initializeLz4(): void {
  return Lz4.initializeLz4();
}

const g = global as any;

export function globalGetLz4VersionNumber(): Promise<number> {
  return g.lz4.getLz4VersionNumber();
}
