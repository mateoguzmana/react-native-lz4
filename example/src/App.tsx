import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import {
  decompressFile,
  getLz4VersionNumber,
  getLz4VersionString,
  globalCompressFile,
  globalGetLz4VersionNumber,
  globalGetLz4VersionString,
  initializeLz4,
} from 'react-native-lz4';
import {
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { pick } from 'react-native-document-picker';

export default function App() {
  const [versionNumber, setVersionNumber] = useState<number | undefined>();
  const [versionString, setVersionString] = useState<string | undefined>();

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

        const compressFileResult = await globalCompressFile(
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

  const printGlobalGetLz4VersionNumber = async () => {
    const globalVersionNumber = await globalGetLz4VersionNumber();
    console.log({ globalVersionNumber });
  };

  const printGlobalGetLz4VersionString = async () => {
    const globalVersionString = await globalGetLz4VersionString();
    console.log({ globalVersionString });
  };

  useEffect(() => {
    initializeLz4();
    getLz4VersionNumber().then(setVersionNumber);
    getLz4VersionString().then(setVersionString);
  }, []);

  return (
    <View style={styles.container}>
      <Text>LZ4 Version Number: {versionNumber}</Text>

      <Text>LZ4 Version String: {versionString}</Text>

      <Button title="Compress File" onPress={executeCompressFile} />

      <Button title="Decompress File" onPress={executeDecompressFile} />

      <Button
        title="Global Get LZ4 Version Number"
        onPress={printGlobalGetLz4VersionNumber}
      />

      <Button
        title="Global Get LZ4 Version String"
        onPress={printGlobalGetLz4VersionString}
      />
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
