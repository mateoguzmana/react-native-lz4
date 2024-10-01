import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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

interface FileOperationResultExtended extends FileOperationResult {
  sourcePath: string;
  destinationPath: string;
  operation: 'compress' | 'decompress';
}

/**
 * Example of a callback function that is called with the progress of the operation.
 * @param processedSize
 * @param totalSize
 */
function onProgress(processedSize: number, totalSize: number) {
  console.log({
    processedSize,
    totalSize,
    progress: `${Math.round((processedSize / totalSize) * 100)}%`,
  });
}

export default function App() {
  const [versionNumber, setVersionNumber] = useState<number | undefined>();
  const [versionString, setVersionString] = useState<string | undefined>();
  const [fileOperationResult, setFileOperationResult] =
    useState<FileOperationResultExtended>();

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
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const executeCompressFileUsingDocumentPicker = async () => {
    const [file] = await pick({ copyTo: 'cachesDirectory' });

    if (!file || !file.fileCopyUri) return;

    const sourcePath = file.fileCopyUri;
    const destinationPath = file.fileCopyUri.replace(/(.*)(\..*)/, '$1.lz4');

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
  };

  const executeDecompressFile = async () => {
    const [file] = await pick({ copyTo: 'cachesDirectory' });

    if (!file || !file.fileCopyUri) return;

    const sourcePath = file.fileCopyUri;
    const destinationPath = file.fileCopyUri.replace(/(.*)(\..*)/, '$1.lz4');

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
            <Text key={key} style={styles.label}>
              {key}: {value.toString()}
            </Text>
          ))}
        </View>
      )}

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

interface ButtonProps {
  title: string;
  onPress(): void;
}

function OptionButton({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
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
  button: {
    backgroundColor: 'transparent',
    color: '#2196F3',
    margin: 4,
  },
  buttonText: {
    color: '#2196F3',
    padding: 10,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
