import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  compressFile,
  decompressFile,
  getLz4VersionNumber,
  getLz4VersionString,
  type FileOperationResult,
} from 'react-native-lz4';
import {
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { pick } from 'react-native-document-picker';
import { ProgressBar } from './components/ProgressBar';
import { OptionButton } from './components/OptionButton';
import { PropertyLabel } from './components/PropertyLabel';

interface FileOperationResultExtended extends FileOperationResult {
  sourcePath: string;
  destinationPath: string;
  operation: 'compress' | 'decompress';
}

export default function App() {
  const [versionNumber, setVersionNumber] = useState<number | undefined>();
  const [versionString, setVersionString] = useState<string | undefined>();
  const [fileOperationResult, setFileOperationResult] =
    useState<FileOperationResultExtended>();
  const [progress, setProgress] = useState<number | undefined>();

  const onReset = () => {
    setProgress(undefined);
    setFileOperationResult(undefined);
  };

  /**
   * Example of a callback function that is called with the progress of the operation.
   * @param processedSize
   * @param totalSize
   */
  const onProgress = (processedSize: number, totalSize: number) => {
    const _progress = Math.round((processedSize / totalSize) * 100);

    // doing it in intervals of 10% to avoid unnecessary re-renders.
    // it would be more efficient to have this progress in a ref and using reanimated to animate the progress
    if (_progress % 10 === 0) {
      setProgress(_progress);
    }
  };

  const executeGetLz4VersionNumber = async () => {
    const _versionNumber = await getLz4VersionNumber();

    console.log({ _versionNumber });

    setVersionNumber(_versionNumber);
  };

  const executeGetLz4VersionString = async () => {
    const _versionString = await getLz4VersionString();

    setVersionString(_versionString);
  };

  const executeCompressFileUsingImageLibrary = async () => {
    onReset();

    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
      };

      const imageLibraryResult = await launchImageLibrary(options);

      if (imageLibraryResult.assets && imageLibraryResult.assets.length > 0) {
        const asset = imageLibraryResult.assets[0];

        if (!asset?.uri) return;

        const sourcePath = asset.uri;
        const destinationPath = asset.uri.replace(/(.*)(\..*)/, '$1.lz4');

        try {
          const compressFileResult = await compressFile(
            sourcePath,
            destinationPath,
            onProgress
          );

          setFileOperationResult({
            ...compressFileResult,
            sourcePath,
            destinationPath,
            operation: 'compress',
          });
        } catch (error) {
          console.log({ error });
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const executeCompressFileUsingDocumentPicker = async () => {
    onReset();

    const [file] = await pick({ copyTo: 'cachesDirectory' });

    if (!file || !file.fileCopyUri) return;

    const sourcePath = file.fileCopyUri;
    const destinationPath = file.fileCopyUri.replace(/(.*)(\..*)/, '$1.lz4');

    try {
      const decompressFileResult = await compressFile(
        sourcePath,
        destinationPath,
        onProgress
      );

      setFileOperationResult({
        ...decompressFileResult,
        sourcePath,
        destinationPath,
        operation: 'compress',
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const executeDecompressFile = async () => {
    onReset();

    const [file] = await pick({ copyTo: 'cachesDirectory' });

    if (!file || !file.fileCopyUri) return;

    const sourcePath = file.fileCopyUri;
    const destinationPath = file.fileCopyUri.replace(/(.*)(\..*)/, '$1.lz4');

    try {
      const decompressFileResult = await decompressFile(
        sourcePath,
        destinationPath,
        onProgress
      );

      setFileOperationResult({
        ...decompressFileResult,
        sourcePath,
        destinationPath,
        operation: 'decompress',
      });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <View style={styles.container}>
      {versionNumber && (
        <Text style={styles.label}>LZ4 Version Number: {versionNumber}</Text>
      )}

      {versionString && (
        <Text style={styles.label}>LZ4 Version String: {versionString}</Text>
      )}

      {fileOperationResult && (
        <View style={styles.subContainer}>
          {Object.entries(fileOperationResult).map(([key, value]) => (
            <PropertyLabel title={key} value={value} key={key} />
          ))}
        </View>
      )}

      {progress ? <ProgressBar progress={progress} /> : null}

      <View style={styles.separator} />

      <OptionButton
        title="> Get LZ4 Version Number"
        onPress={executeGetLz4VersionNumber}
      />

      <OptionButton
        title="> Get LZ4 Version String"
        onPress={executeGetLz4VersionString}
      />

      <OptionButton
        title="> Compress File Using Image Library"
        onPress={executeCompressFileUsingImageLibrary}
      />

      <OptionButton
        title="> Compress File Using Document Picker"
        onPress={executeCompressFileUsingDocumentPicker}
      />

      <OptionButton title="> Decompress File" onPress={executeDecompressFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  subContainer: {
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: '#333',
    padding: 10,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
