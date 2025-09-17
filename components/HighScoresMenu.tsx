import { getHighScores, HighScore } from "@/constants/Storage";
import SimplePopupView from "./SimplePopupView";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StylizedButton from "./StylizedButton";
import { cssColors } from "@/constants/Color";
import { GameModeType, useSetAppState } from "@/hooks/useAppState";
import Animated, { 
    FadeIn, 
    FadeInDown, 
    FadeInLeft,
    FadeInRight,
    SlideInLeft,
    SlideInRight,
    useAnimatedStyle, 
    useSharedValue, 
    withDelay, 
    withRepeat, 
    withTiming,
    Easing
} from "react-native-reanimated";

interface EnhancedStylizedButtonProps {
    text: string;
    onClick: () => void;
    backgroundColor: string;
    borderColor?: string;
    style?: ViewStyle;
    icon?: string;
    isSelected?: boolean;
    gradient?: [string, string];
}

function EnhancedStylizedButton({
    text,
    onClick,
    backgroundColor,
    borderColor,
    style,
    icon,
    isSelected,
    gradient
}: EnhancedStylizedButtonProps) {
    const scale = useSharedValue(1);
    const glow = useSharedValue(isSelected ? 1 : 0);

    useEffect(() => {
        glow.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
    }, [isSelected]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        shadowOpacity: 0.2 + glow.value * 0.3,
        shadowRadius: 6 + glow.value * 8,
    }));

    const handlePress = () => {
        scale.value = withTiming(0.96, { duration: 80 }, () => {
            scale.value = withTiming(1, { duration: 120 });
        });
        onClick();
    };

    return (
        <Animated.View style={[animatedStyle, { marginHorizontal: 3 }]}>
            <StylizedButton
                text={icon ? `${icon} ${text}` : text}
                onClick={handlePress}
                backgroundColor={backgroundColor}
                borderColor={borderColor || (isSelected ? '#ffffff' : undefined)}
                style={[
                    {
                        shadowColor: backgroundColor,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 6,
                        borderWidth: isSelected ? 2 : 1,
                    },
                    style
                ]}
            />
        </Animated.View>
    );
}

function BackgroundEffects() {
    const particles = Array.from({ length: 6 }, (_, i) => i);
    
    return (
        <View style={styles.backgroundEffects}>
            {particles.map((i) => (
                <FloatingParticle key={i} index={i} />
            ))}
            <View style={styles.gradientOverlay} />
        </View>
    );
}

function FloatingParticle({ index }: { index: number }) {
    const translateX = useSharedValue(Math.random() * 200 - 100);
    const translateY = useSharedValue(Math.random() * 400 - 200);
    const scale = useSharedValue(0.2 + Math.random() * 0.3);
    const opacity = useSharedValue(0.08 + Math.random() * 0.12);
    
    useEffect(() => {
        const duration = 8000 + Math.random() * 4000;
        const delay = Math.random() * 2000;
        
        translateX.value = withRepeat(
            withDelay(delay, withTiming(translateX.value + (Math.random() - 0.5) * 200, { duration })),
            -1,
            true
        );
        translateY.value = withRepeat(
            withDelay(delay, withTiming(translateY.value + (Math.random() - 0.5) * 200, { duration })),
            -1,
            true
        );
    }, []);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ],
        opacity: opacity.value,
    }));
    
    return (
        <Animated.View
            style={[
                styles.particle,
                animatedStyle,
                {
                    backgroundColor: `hsl(${172 + index * 10}, 65%, 55%)`,
                }
            ]}
        />
    );
}

export default function HighScores() {
    const [setAppState, _appendAppState, popAppState] = useSetAppState();
    const [highScores, setHighScores] = useState<HighScore[]>([]);
    const [gameMode, setGameMode] = useState(GameModeType.Classic);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        setIsLoading(true);
        getHighScores(gameMode, true, true, 10).then((value) => {
            setHighScores(value);
            setIsLoading(false);
        });
    }, [gameMode, setHighScores]);

    const getModeDisplayName = (mode: GameModeType) => {
        return mode === GameModeType.Classic ? 'Classic' : 'Chaos';
    };

    const getModeIcon = (mode: GameModeType) => {
        return mode === GameModeType.Classic ? '🎯' : '⚡';
    };

    return (
        <SimplePopupView style={[styles.container]}>
            <BackgroundEffects />
            
            <Animated.View 
                entering={FadeInLeft.delay(100).duration(500)}
                style={styles.header}
            >
                <EnhancedStylizedButton 
                    text="Back" 
                    onClick={popAppState} 
                    backgroundColor="#26a69a"
                    icon="←"
                    style={styles.backButton}
                />
                
                <Animated.Text 
                    entering={FadeIn.delay(200).duration(600)}
                    style={styles.title}
                >
                    🏆 High Scores
                </Animated.Text>
                
                <Animated.Text 
                    entering={FadeIn.delay(350).duration(500)}
                    style={styles.subtitle}
                >
                    Your greatest achievements
                </Animated.Text>
            </Animated.View>

            {highScores.length > 0 && (
                <Animated.View 
                    entering={FadeInDown.delay(500).duration(600)}
                    style={styles.content}
                >
                    <View style={styles.gameModeSection}>
                        <Text style={styles.sectionTitle}>Select Game Mode</Text>
                        <View style={styles.gameModeButtons}>
                            <EnhancedStylizedButton
                                text="Classic"
                                onClick={() => setGameMode(GameModeType.Classic)}
                                backgroundColor="#009384"
                                icon="🎯"
                                isSelected={gameMode === GameModeType.Classic}
                            />
                            <EnhancedStylizedButton
                                text="Chaos"
                                onClick={() => setGameMode(GameModeType.Chaos)}
                                backgroundColor="#1a1a1a"
                                borderColor="#00bfa5"
                                icon="⚡"
                                isSelected={gameMode === GameModeType.Chaos}
                            />
                        </View>
                    </View>

                    <Animated.View 
                        entering={FadeInRight.delay(700).duration(500)}
                        style={styles.scoresSection}
                    >
                        <View style={styles.scoreHeader}>
                            <Text style={styles.scoresTitle}>
                                {getModeIcon(gameMode)} {getModeDisplayName(gameMode)} Leaderboard
                            </Text>
                            <Text style={styles.scoresSubtitle}>
                                Top {highScores.length} scores
                            </Text>
                        </View>

                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>Loading scores...</Text>
                            </View>
                        ) : (
                            <ScrollView 
                                style={styles.scoresContainer}
                                showsVerticalScrollIndicator={false}
                            >
                                {highScores.map((score, idx) => (
                                    <ScoreItem 
                                        key={idx} 
                                        rank={idx + 1} 
                                        score={score}
                                        delay={idx * 80}
                                    />
                                ))}
                            </ScrollView>
                        )}
                    </Animated.View>
                </Animated.View>
            )}

            {highScores.length === 0 && !isLoading && (
                <Animated.View 
                    entering={FadeInDown.delay(500).duration(600)}
                    style={styles.emptyState}
                >
                    <Text style={styles.emptyStateIcon}>🎮</Text>
                    <Text style={styles.emptyStateTitle}>No Scores Yet!</Text>
                    <Text style={styles.emptyStateText}>
                        Time to make your mark on the leaderboard
                    </Text>
                    
                    <View style={styles.playButtons}>
                        <EnhancedStylizedButton
                            text="Play Classic"
                            onClick={() => setAppState(GameModeType.Classic)}
                            backgroundColor="#009384"
                            icon="🎯"
                        />
                        <EnhancedStylizedButton
                            text="Play Chaos"
                            onClick={() => setAppState(GameModeType.Chaos)}
                            backgroundColor="#1a1a1a"
                            borderColor="#00bfa5"
                            icon="⚡"
                        />
                    </View>
                </Animated.View>
            )}
        </SimplePopupView>
    );
}

function ScoreItem({ score, rank, delay = 0 }: { score: HighScore; rank: number; delay?: number }) {
    const glow = useSharedValue(0);
    
    useEffect(() => {
        // Special glow effect for top 3
        if (rank <= 3) {
            glow.value = withRepeat(
                withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
                -1,
                true
            );
        }
    }, [rank]);

    const animatedStyle = useAnimatedStyle(() => ({
        shadowOpacity: rank <= 3 ? 0.25 + glow.value * 0.25 : 0.15,
        shadowRadius: rank <= 3 ? 10 + glow.value * 6 : 6,
    }));

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    const getRankStyle = (rank: number) => {
        if (rank <= 3) {
            return [styles.scoreCard, styles.topThreeCard];
        }
        return styles.scoreCard;
    };

    return (
        <Animated.View 
            entering={SlideInLeft.delay(delay).duration(400)}
            style={animatedStyle}
        >
            <View style={getRankStyle(rank)}>
                <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>
                        {getRankIcon(rank)}
                    </Text>
                </View>
                
                <View style={styles.scoreInfo}>
                    <Text style={styles.scoreValue}>
                        {score.score.toLocaleString()}
                    </Text>
                    <Text style={styles.scoreTime}>
                        {createTimeAgoString(score.date)}
                    </Text>
                </View>
                
                <View style={styles.scoreBadge}>
                    <Text style={styles.scoreBadgeText}>pts</Text>
                </View>
            </View>
        </Animated.View>
    );
}

function createTimeAgoString(date: number): string {
    const now = new Date();
    const seconds = Math.round((now.getTime() - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30);
    const years = Math.round(days / 365);
  
    if (seconds < 60) {
        return seconds <= 0 ? 'just now' : `${seconds}s ago`;
    } else if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else if (days < 30) {
        return `${days}d ago`;
    } else if (months < 12) {
        return `${months}mo ago`;
    } else {
        return `${years}y ago`;
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        backgroundColor: '#0f1419',
        paddingHorizontal: 18,
        paddingVertical: 18,
    },
    backgroundEffects: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -2,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'radial-gradient(circle at 30% 20%, rgba(0, 147, 132, 0.08) 0%, rgba(0, 191, 165, 0.04) 50%, transparent 100%)',
        zIndex: -1,
    },
    particle: {
        position: 'absolute',
        width: 2.5,
        height: 2.5,
        borderRadius: 1.25,
        zIndex: -1,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: RFValue(24),
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 6,
        textShadowColor: 'rgba(0, 147, 132, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
    },
    subtitle: {
        fontSize: RFValue(12),
        color: '#888888',
        textAlign: 'center',
        fontWeight: '300',
    },
    content: {
        flex: 1,
        width: '100%',
    },
    gameModeSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: RFValue(16),
        color: '#ffffff',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 12,
    },
    gameModeButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    scoresSection: {
        flex: 1,
    },
    scoreHeader: {
        marginBottom: 16,
        alignItems: 'center',
    },
    scoresTitle: {
        fontSize: RFValue(18),
        color: '#ffffff',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 3,
    },
    scoresSubtitle: {
        fontSize: RFValue(11),
        color: '#aaaaaa',
        textAlign: 'center',
    },
    scoresContainer: {
        flex: 1,
        maxHeight: 350,
    },
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: RFValue(14),
        color: '#888888',
    },
    scoreCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },
    topThreeCard: {
        backgroundColor: 'rgba(0, 147, 132, 0.12)',
        borderColor: 'rgba(0, 147, 132, 0.25)',
        shadowColor: '#009384',
    },
    rankContainer: {
        width: 44,
        alignItems: 'center',
    },
    rankText: {
        fontSize: RFValue(16),
        fontWeight: '600',
    },
    scoreInfo: {
        flex: 1,
        marginLeft: 14,
    },
    scoreValue: {
        fontSize: RFValue(18),
        color: '#ffffff',
        fontWeight: '600',
        marginBottom: 1,
    },
    scoreTime: {
        fontSize: RFValue(11),
        color: '#aaaaaa',
        fontWeight: '300',
    },
    scoreBadge: {
        backgroundColor: 'rgba(0, 147, 132, 0.2)',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 147, 132, 0.35)',
    },
    scoreBadgeText: {
        fontSize: RFValue(9),
        color: '#009384',
        fontWeight: '500',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    emptyStateIcon: {
        fontSize: RFValue(40),
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: RFValue(20),
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyStateText: {
        fontSize: RFValue(14),
        color: '#888888',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: RFValue(18),
    },
    playButtons: {
        gap: 12,
        alignItems: 'center',
    },
});