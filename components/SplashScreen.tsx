import { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(1));
  const screenHeight = Dimensions.get('window').height + (StatusBar.currentHeight || 0);

  useEffect(() => {
    // Hide status bar when splash screen is mounted
    StatusBar.setHidden(true);
    
    // Start fade out animation after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Half second fade out
        useNativeDriver: true,
      }).start(() => {
        StatusBar.setHidden(false);
        onFinish();
      });
    }, 2500);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { height: screenHeight }]}>
      <Image
        source={require('@/assets/images/nx-screen.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 1000,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
