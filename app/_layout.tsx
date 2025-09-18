import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeAnim] = useState(new Animated.Value(1));
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(onFinish);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.imageContainer, { height: screenHeight }]}>
        <Image
          source={require('@/assets/images/nx-screen.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <View style={{ flex: 1 }}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false, autoHideHomeIndicator: true }} />;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
