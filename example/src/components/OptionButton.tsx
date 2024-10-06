import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface OptionButtonProps {
  title: string;
  onPress(): void;
}

export function OptionButton({ title, onPress }: OptionButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    color: '#2196F3',
    margin: 4,
  },
  buttonText: {
    color: '#2196F3',
    padding: 10,
  },
});
