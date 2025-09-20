import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  BounceInUp,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import SimplePopupView from './SimplePopupView';
import { GameModeType } from '@/hooks/useAppState';

interface GameOverScreenProps {
  visible: boolean;
  score: number;
  gameMode: GameModeType;
  onRestart: () => void;
  onMainMenu: () => void;
}

export default function GameOverScreen({ 
  visible, 
  score, 
  gameMode, 
  onRestart, 
  onMainMenu 
}: GameOverScreenProps) {
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    if (visible) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [visible]);

  const gameOverPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={styles.backdrop}
      />
      
      {/* Main Game Over Modal */}
      <View style={styles.container}>
        <SimplePopupView visible={visible} style={[styles.modalContainer]}>
          
          {/* Game Over Title with Pulse Animation */}
          <Animated.View 
            entering={BounceInUp.delay(200).duration(800)}
            style={[styles.titleContainer, gameOverPulseStyle]}
          >
            <LinearGradient
              colors={['#ff6b6b', '#ee5a52']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.titleGradient}
            >
              <Text style={styles.gameOverTitle}>GAME OVER</Text>
            </LinearGradient>
          </Animated.View>

          {/* Game Mode Badge */}
          <Animated.View 
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.gameModeBadge}
          >
            <LinearGradient
              colors={gameMode === GameModeType.Chaos ? ['#1a1a1a', '#2a2a2a'] : ['#009384', '#00a693']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badgeGradient}
            >
              <Text style={styles.gameModeText}>
                {gameMode === GameModeType.Chaos ? '⚡ CHAOS MODE' : '🎯 CLASSIC MODE'}
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Final Score */}
          <Animated.View 
            entering={FadeInUp.delay(600).duration(600)}
            style={styles.scoreContainer}
          >
            <Text style={styles.finalScoreLabel}>Final Score</Text>
            <Text style={styles.finalScore}>{score.toLocaleString()}</Text>
          </Animated.View>

          {/* Motivational Message */}
          <Animated.View 
            entering={FadeInUp.delay(800).duration(600)}
            style={styles.messageContainer}
          >
            <Text style={styles.motivationalMessage}>
              {score > 5000 ? "Incredible performance! 🏆" : 
               score > 2000 ? "Great job! Keep improving! 🌟" : 
               "Nice try! Practice makes perfect! 💪"}
            </Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            entering={FadeInDown.delay(1000).duration(600)}
            style={styles.buttonContainer}
          >
            <GameOverButton
              title="🔄 Play Again"
              onPress={onRestart}
              gradient={['#009384', '#00a693']}
              delay={0}
            />
            
            <GameOverButton
              title="🏠 Main Menu"
              onPress={onMainMenu}
              gradient={['#6b73ff', '#9c27b0']}
              delay={100}
            />
          </Animated.View>

          {/* Decorative Elements */}
          <Animated.View 
            entering={FadeIn.delay(1200).duration(800)}
            style={styles.decorativeContainer}
          >
            <Text style={styles.decorativeText}>•••</Text>
          </Animated.View>

        </SimplePopupView>
      </View>
    </>
  );
}

interface GameOverButtonProps {
  title: string;
  onPress: () => void;
  gradient: [string, string];
  delay: number;
}

function GameOverButton({ title, onPress, gradient, delay }: GameOverButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500)}
      style={styles.buttonWrapper}
    >
      <Pressable
        style={styles.buttonPressable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.button, animatedStyle]}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{title}</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 99,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContainer: {
    minHeight: 400,
  },
  titleContainer: {
    marginBottom: 16,
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  titleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  gameOverTitle: {
    fontSize: RFValue(24),
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gameModeBadge: {
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  gameModeText: {
    fontSize: RFValue(12),
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 147, 132, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 147, 132, 0.3)',
  },
  finalScoreLabel: {
    fontSize: RFValue(14),
    color: '#888888',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  finalScore: {
    fontSize: RFValue(32),
    fontWeight: '700',
    color: '#00bfa5',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 191, 165, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  messageContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  motivationalMessage: {
    fontSize: RFValue(14),
    color: '#cccccc',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  buttonWrapper: {
    width: '100%',
  },
  buttonPressable: {
    width: '100%',
    borderRadius: 12,
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: RFValue(16),
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  decorativeContainer: {
    alignSelf: 'center',
    marginTop: 8,
  },
  decorativeText: {
    fontSize: RFValue(16),
    color: 'rgba(0, 147, 132, 0.5)',
    fontWeight: '300',
    letterSpacing: 4,
  },
});
