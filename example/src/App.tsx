import { useState, useEffect } from 'react';
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

export default function App() {
  const [versionNumber, setVersionNumber] = useState<number | undefined>();
  const [versionString, setVersionString] = useState<string | undefined>();

  const executeCompressFile = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
      };

      const imageLibraryResult = await launchImageLibrary(options);

      if (imageLibraryResult.didCancel) {
        console.log('User cancelled image picker');
      } else if (imageLibraryResult.errorCode) {
        console.log('Image Picker Error: ', imageLibraryResult.errorMessage);
      } else if (
        imageLibraryResult.assets &&
        imageLibraryResult.assets.length > 0
      ) {
        const asset = imageLibraryResult.assets[0];
        console.log({ asset });

        if (!asset?.uri) {
          console.log('No asset URI found');
          return;
        }

        const compressFileResult = await compressFile(
          // '/Users/mateoguzman/Library/Developer/CoreSimulator/Devices/8EA59C5A-23FA-4BFD-8159-D8FBA3A46D7B/data/Containers/Data/Application/A4C994AC-7778-4B60-AD74-6766E2CE1283/tmp/44307235-C5D8-4533-98E8-DB2F76502344.jpg',
          // 'data/user/0/lz4.example/cache/rn_image_picker_lib_temp_859be96a-cfaa-419f-9d48-0e6be30e8d00.png',
          asset.uri,
          // use the same uri as the source path to overwrite the file and with extension lz4
          '/Users/mateoguzman/Library/Developer/CoreSimulator/Devices/8EA59C5A-23FA-4BFD-8159-D8FBA3A46D7B/data/Containers/Data/Application/A4C994AC-7778-4B60-AD74-6766E2CE1283/tmp.lz4'
        );

        console.log({ compressFileResult });

        const decompressFileResult = await decompressFile(
          '/Users/mateoguzman/Library/Developer/CoreSimulator/Devices/8EA59C5A-23FA-4BFD-8159-D8FBA3A46D7B/data/Containers/Data/Application/A4C994AC-7778-4B60-AD74-6766E2CE1283/tmp.lz4',
          '/Users/mateoguzman/Library/Developer/CoreSimulator/Devices/8EA59C5A-23FA-4BFD-8159-D8FBA3A46D7B/data/Containers/Data/Application/A4C994AC-7778-4B60-AD74-6766E2CE1283/tmp.png'
        );

        console.log({ decompressFileResult });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getLz4VersionNumber().then(setVersionNumber);
    getLz4VersionString().then(setVersionString);
  }, []);

  return (
    <View style={styles.container}>
      <Text>LZ4 Version Number: {versionNumber}</Text>

      <Text>LZ4 Version String: {versionString}</Text>

      <Button title="Compress File" onPress={executeCompressFile} />
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
