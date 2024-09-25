import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getLz4VersionNumber, multiply } from 'react-native-lz4';

export default function App() {
  const [result, setResult] = useState<number | undefined>();
  const [version, setVersion] = useState<string | undefined>();

  useEffect(() => {
    multiply(3, 10).then(setResult);
    getLz4VersionNumber().then(setVersion);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>

      <Text>LZ4 Version Number: {version}</Text>
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
