import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  getLz4VersionNumber,
  getLz4VersionString,
  multiply,
} from 'react-native-lz4';

export default function App() {
  const [result, setResult] = useState<number | undefined>();
  const [versionNumber, setVersionNumber] = useState<number | undefined>();
  const [versionString, setVersionString] = useState<string | undefined>();

  useEffect(() => {
    multiply(3, 10).then(setResult);
    getLz4VersionNumber().then(setVersionNumber);
    getLz4VersionString().then(setVersionString);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>

      <Text>LZ4 Version Number: {versionNumber}</Text>

      <Text>LZ4 Version String: {versionString}</Text>
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
