import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Image, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeAnim] = useState(new Animated.Value(1));
  const screenHeight = Dimensions.get('window').height + (StatusBar.currentHeight || 0);

  useEffect(() => {
    // Hide status bar when splash screen is mounted
    StatusBar.setHidden(true);
    
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
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
    <Animated.View style={[styles.container, { height: screenHeight, opacity: fadeAnim }]}>
      <Image
        source={require('@/assets/images/nx-screen.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
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
    zIndex: 1000,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
