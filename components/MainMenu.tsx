import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Animated, { 
	BounceInUp, 
	Easing, 
	FadeIn, 
	FadeInDown,
	FadeInLeft,
	FadeInRight,
	FadeInUp,
	SlideInDown,
	interpolateColor, 
	useAnimatedStyle, 
	useDerivedValue, 
	useSharedValue, 
	withDelay, 
	withRepeat, 
	withSequence, 
	withSpring, 
	withTiming 
} from "react-native-reanimated";
import { MenuStateType, useSetAppState } from "@/hooks/useAppState";
import { cssColors } from "@/constants/Color";
import { GameModeType } from '@/hooks/useAppState';
import HighScores from "./HighScoresMenu";
import { PieceData } from "@/constants/Piece";
import { PieceView } from "./PieceView";

const logoBPiece: PieceData = {
	matrix: [
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 0]
	],
	distributionPoints: 0,
	color: { r: 0, g: 147, b: 132 }
};
const logoNPiece: PieceData = {
	matrix: [
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1]
	],
	distributionPoints: 0,
	color: { r: 0, g: 191, b: 165 }
};

function BlockerinoLogo({blockSize, style}: {blockSize: number, style: ViewStyle}) {
	const floatAnim = useSharedValue(0);
	const glowAnim = useSharedValue(0);
	
	useEffect(() => {
		floatAnim.value = withRepeat(
			withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
			-1,
			true
		);
		glowAnim.value = withRepeat(
			withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
			-1,
			true
		);
	}, []);
	
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: floatAnim.value * 4 }],
		shadowOpacity: 0.2 + glowAnim.value * 0.3,
	}));
	
	const nTop = blockSize * 80/30;
	const nLeft = blockSize * 50/30;
	
	return (
		<Animated.View 
			style={[
				{width: blockSize * 4 + nLeft, height: blockSize * 4 + nTop}, 
				style,
				animatedStyle
			]}
		>
			<PieceView 
				style={{
					shadowColor: '#009384',
					shadowOffset: { width: 0, height: 4 },
					shadowRadius: 8,
					elevation: 4,
				}} 
				piece={logoBPiece} 
				blockSize={blockSize}
			/>
			<PieceView 
				style={{
					transform: [{ translateX: nLeft }, { translateY: nTop }], 
					position: 'absolute', 
					zIndex: -1,
					shadowColor: '#00bfa5',
					shadowOffset: { width: 0, height: 2 },
					shadowRadius: 6,
					elevation: 2,
				}} 
				piece={logoNPiece} 
				blockSize={blockSize}
			/>
		</Animated.View>
	);
}

function BackgroundEffects() {
	const particles = Array.from({ length: 8 }, (_, i) => i);
	
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
	const scale = useSharedValue(0.3 + Math.random() * 0.4);
	const opacity = useSharedValue(0.05 + Math.random() * 0.15);
	
	useEffect(() => {
		const duration = 6000 + Math.random() * 3000;
		const delay = Math.random() * 1000;
		
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
					backgroundColor: `hsl(${172 + index * 8}, 70%, 50%)`,
				}
			]}
		/>
	);
}

export default function MainMenu() {
	const [ _, appendAppState ] = useSetAppState();
	
	return (
		<View style={styles.container}>
			<BackgroundEffects />
			
			<Animated.View 
				entering={FadeInLeft.delay(200).duration(800)}
				style={styles.logoContainer}
			>
				<BlockerinoLogo style={{}} blockSize={6} />
			</Animated.View>

			<Animated.Text 
				entering={BounceInUp.delay(400).duration(1000)} 
				style={styles.logo}
			>
				blockerino
			</Animated.Text>
			
			<Animated.Text 
				entering={FadeIn.delay(600).duration(800)} 
				style={styles.subtitle}
			>
				Next-Gen Block Puzzle Experience
			</Animated.Text>

			<Animated.View 
				entering={FadeInDown.delay(800).duration(800)}
				style={styles.buttonContainer}
			>
				<MainButton
					onClick={() => {
						appendAppState(GameModeType.Classic);
					}}
					backgroundColor="#009384"
					title="Classic ∞"
					flavorText="Classical line breaking"
					icon="🎯"
					gradient={["#009384", "#00a693"]}
					delay={0}
				/>
				
				<MainButton
					onClick={() => {
						appendAppState(GameModeType.Chaos);
					}}
					backgroundColor="#1a1a1a"
					title="Chaos !?"
					flavorText="10x10, 5 piece hand!?"
					icon="⚡"
					style={{ 
						borderWidth: 2, 
						borderColor: "#00bfa5",
						shadowColor: "#00bfa5",
						shadowOpacity: 0.3,
						shadowRadius: 6,
					}}
					textStyle={{ color: "white" }}
					gradient={["#1a1a1a", "#2a2a2a"]}
					chaosMode={true}
					delay={100}
				/>
				
				<MainButton 
					onClick={() => {
						appendAppState(MenuStateType.HIGH_SCORES)
					}} 
					backgroundColor="#00bfa5" 
					title="High Scores" 
					icon="🏆"
					gradient={["#00bfa5", "#26a69a"]}
					delay={200}
				/>
				
				
			</Animated.View>

			<Animated.Text 
				entering={SlideInDown.delay(1200).duration(600)} 
				style={styles.footer}
			>
				Beta Version • Made with ❤️
			</Animated.Text>
		</View>
	);
}

function MainButton({
	style,
	textStyle,
	backgroundColor,
	title,
	flavorText,
	icon,
	gradient,
	chaosMode,
	delay = 0,
	onClick,
}: {
	style?: any;
	textStyle?: any;
	backgroundColor: string;
	title: string;
	flavorText?: string;
	icon?: string;
	gradient?: [string, string];
	chaosMode?: boolean;
	delay?: number;
	onClick?: () => void;
}) {
	const scale = useSharedValue(1);
	const translateY = useSharedValue(0);
	const rotationDeg = useSharedValue(0);
	const glowIntensity = useSharedValue(0);
	const pressed = useSharedValue(false);

	const animatedStyle = useAnimatedStyle(() => {
		const shadowOpacity = 0.15 + glowIntensity.value * 0.2;
		const shadowRadius = 4 + glowIntensity.value * 6;
		
		return {
			transform: [
				{ translateY: translateY.value },
				{ rotate: `${rotationDeg.value}deg` },
				{ scale: scale.value }
			],
			shadowOpacity,
			shadowRadius,
			shadowOffset: {
				width: 0,
				height: 2 + glowIntensity.value * 2,
			},
		};
	});

	useEffect(() => {
		if (chaosMode) {
			// Chaos mode glitch effect
			const glitchSequence = () => {
				rotationDeg.value = withSequence(
					withTiming(1.5, { duration: 40 }),
					withTiming(-1.5, { duration: 40 }),
					withTiming(0.5, { duration: 40 }),
					withTiming(0, { duration: 40 })
				);
			};
			
			const glitchInterval = setInterval(glitchSequence, 4000 + Math.random() * 2000);
			return () => clearInterval(glitchInterval);
		} else {
			// Subtle floating animation for other buttons
			translateY.value = withRepeat(
				withTiming(-2, { duration: 2500 + delay * 100, easing: Easing.inOut(Easing.sin) }),
				-1,
				true
			);
		}
	}, []);

	const onPress = () => {
		pressed.value = true;
		scale.value = withSequence(
			withTiming(0.96, { duration: 80 }),
			withTiming(1.02, { duration: 120 }),
			withTiming(1, { duration: 80 })
		);
		
		if (onClick) {
			setTimeout(onClick, 200);
		}
		
		setTimeout(() => {
			pressed.value = false;
		}, 280);
	};
	
	const onHoverIn = () => {
		if (!pressed.value) {
			translateY.value = withSpring(-4, { damping: 15, stiffness: 200 });
			glowIntensity.value = withTiming(1, { duration: 250 });
			scale.value = withSpring(1.01, { damping: 15, stiffness: 200 });
		}
	};
	
	const onHoverOut = () => {
		if (!pressed.value) {
			translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
			glowIntensity.value = withTiming(0, { duration: 250 });
			scale.value = withSpring(1, { damping: 15, stiffness: 200 });
		}
	};
	
	return (
		<Animated.View
			entering={FadeInUp.delay(delay).duration(500)}
			style={styles.buttonWrapper}
		>
			<Pressable 
				style={styles.buttonPressable} 
				onPress={onPress} 
				onHoverIn={onHoverIn} 
				onHoverOut={onHoverOut}
			>
				<Animated.View
					style={[
						styles.button,
						{ 
							backgroundColor: gradient ? gradient[0] : backgroundColor,
							shadowColor: backgroundColor,
						},
						animatedStyle,
						style || {},
					]}
				>
					{gradient && (
						<View 
							style={[
								StyleSheet.absoluteFill,
								{
									backgroundColor: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
									borderRadius: 12,
								}
							]} 
						/>
					)}
					
					<View style={styles.buttonContent}>
						{icon && (
							<Text style={styles.buttonIcon}>{icon}</Text>
						)}
						<View style={styles.buttonTextContainer}>
							<Text style={[styles.buttonText, textStyle || {}]}>
								{title}
							</Text>
							{flavorText && (
								<Text style={[styles.buttonFlavorText, textStyle || {}]}>
									{flavorText}
								</Text>
							)}
						</View>
					</View>
					
					{/* Shine effect overlay */}
					<View style={styles.shineOverlay} />
				</Animated.View>
			</Pressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: '100%',
		height: '100%',
		paddingHorizontal: 20,
		backgroundColor: '#0f1419',
		position: 'relative',
	},
	backgroundEffects: {
		...StyleSheet.absoluteFillObject,
		zIndex: -2,
	},
	gradientOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'radial-gradient(circle at 50% 50%, rgba(0, 147, 132, 0.08) 0%, rgba(0, 191, 165, 0.04) 50%, transparent 100%)',
		zIndex: -1,
	},
	particle: {
		position: 'absolute',
		width: 3,
		height: 3,
		borderRadius: 1.5,
		zIndex: -1,
	},
	logoContainer: {
		marginBottom: 16,
		alignItems: 'center',
	},
	logo: {
		fontSize: RFValue(28),
		color: "#ffffff",
		marginBottom: 6,
		textAlign: "center",
		fontWeight: '600',
		letterSpacing: 1.5,
		textShadowColor: 'rgba(0, 147, 132, 0.4)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 6,
	},
	subtitle: {
		fontSize: RFValue(12),
		color: "#888888",
		marginBottom: 32,
		textAlign: "center",
		fontWeight: '300',
		letterSpacing: 0.8,
	},
	buttonContainer: {
		width: '100%',
		maxWidth: 320,
		gap: 12,
		alignItems: 'center',
	},
	buttonWrapper: {
		width: '100%',
	},
	buttonPressable: {
		width: "100%",
		minHeight: 56,
		borderRadius: 12,
	},
	button: {
		width: "100%",
		minHeight: 56,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
		position: 'relative',
		overflow: 'hidden',
		elevation: 4,
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		paddingHorizontal: 16,
	},
	buttonIcon: {
		fontSize: RFValue(16),
	},
	buttonTextContainer: {
		alignItems: 'center',
	},
	buttonText: {
		fontSize: RFValue(16),
		color: "#ffffff",
		textAlign: 'center',
		fontWeight: '500',
		textShadowColor: 'rgba(0, 0, 0, 0.2)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 1,
	},
	buttonFlavorText: {
		fontSize: RFValue(10),
		color: "rgba(255, 255, 255, 0.75)",
		textAlign: 'center',
		marginTop: 1,
		fontWeight: '300',
	},
	shineOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.08) 50%, transparent 70%)',
		transform: [{ translateX: -200 }],
		borderRadius: 12,
	},
	footer: {
		fontSize: RFValue(10),
		color: "#666666",
		position: "absolute",
		bottom: 16,
		textAlign: 'center',
		fontWeight: '300',
	},
});