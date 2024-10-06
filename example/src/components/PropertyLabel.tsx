import { StyleSheet, Text } from 'react-native';

const MAX_STRING_LENGTH = 50;

const formatString = (value: string) => {
  return value.length > MAX_STRING_LENGTH
    ? value.slice(0, MAX_STRING_LENGTH) +
        '...' +
        value.slice(-MAX_STRING_LENGTH)
    : value;
};

interface PropertyLabelProps {
  title: string;
  value: string | number;
}

export function PropertyLabel({ title, value }: PropertyLabelProps) {
  return (
    <Text style={styles.label}>
      {title}: {formatString(value.toString())}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: '#333',
    padding: 10,
  },
});
