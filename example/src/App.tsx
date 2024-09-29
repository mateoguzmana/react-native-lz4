import { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import {
  compressFile,
  decompressFile,
  getLz4VersionNumber,
  getLz4VersionString,
} from 'react-native-lz4';
import {
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { pick } from 'react-native-document-picker';

export default function App() {
  const [versionNumber, setVersionNumber] = useState<number | undefined>();
  const [versionString, setVersionString] = useState<string | undefined>();

  const executeGetLz4VersionNumber = async () => {
    const _versionNumber = await getLz4VersionNumber();

    console.log({ _versionNumber });

    setVersionNumber(_versionNumber);
  };

  const executeGetLz4VersionString = async () => {
    const _versionString = await getLz4VersionString();

    setVersionString(_versionString);
  };

  const executeCompressFile = async () => {
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
          destinationPath
        );

        console.log({ compressFileResult });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const executeDecompressFile = async () => {
    const [file] = await pick({ copyTo: 'cachesDirectory' });

    if (!file || !file.fileCopyUri) return;

    const sourcePath = file.fileCopyUri;
    const destinationPath = file.fileCopyUri.replace(/(.*)(\..*)/, '$1.lz4');

    const decompressFileResult = await decompressFile(
      sourcePath,
      destinationPath
    );

    console.log({ decompressFileResult });
  };

  return (
    <View style={styles.container}>
      <Text>LZ4 Version Number: {versionNumber}</Text>

      <Text>LZ4 Version String: {versionString}</Text>

      <Button
        title="Get LZ4 Version Number"
        onPress={executeGetLz4VersionNumber}
      />

      <Button
        title="Get LZ4 Version String"
        onPress={executeGetLz4VersionString}
      />

      <Button title="Compress File" onPress={executeCompressFile} />

      <Button title="Decompress File" onPress={executeDecompressFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
