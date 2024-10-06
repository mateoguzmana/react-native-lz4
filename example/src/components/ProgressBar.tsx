import { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, { width: animatedWidth }]} />
      <Text style={styles.progressBarText}>{progress}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    marginHorizontal: 10,
  },
  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: 'rgba(5, 171, 55, 0.555)',
    alignSelf: 'center',
    borderRadius: 10,
  },
  progressBarText: {
    color: '#333',
    textAlign: 'center',
  },
});
