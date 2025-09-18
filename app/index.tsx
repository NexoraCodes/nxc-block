import { StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
	FadeIn,
	FadeOut,
	ReanimatedLogLevel,
	configureReanimatedLogger,
} from "react-native-reanimated";
import Game from "@/components/game/Game";
import { GameModeType } from '@/hooks/useAppState';
import React from "react";
import OptionsMenu from "@/components/OptionsMenu";
import { MenuStateType, useAppState } from "@/hooks/useAppState";
import MainMenu from "@/components/MainMenu";
import HighScores from "@/components/HighScoresMenu";

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false,
});

export default function App() {


	const [appState] = useAppState();



	const gameModeSearch = appState.containsGameMode();
	const gameMode = gameModeSearch ? gameModeSearch.current as GameModeType : undefined;

	return (
		<>
			<StatusBar hidden/>
			<LinearGradient
				colors={['#009384', '#007a6e']}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.gradient}
			>
				<Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
					{(appState.containsState(MenuStateType.MENU) && !gameMode) && <MainMenu></MainMenu>}
					{gameMode && <Game gameMode={gameMode}></Game>}
					{appState.containsState(MenuStateType.OPTIONS) && <OptionsMenu></OptionsMenu>}
					{appState.containsState(MenuStateType.HIGH_SCORES) && <HighScores></HighScores>}
				</Animated.View>
			</LinearGradient>
		</>
	);
}

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	container: {
		flex: 1,
		backgroundColor: 'transparent',
		alignItems: "center",
		justifyContent: "center",
		width: '100%',
		height: '100%'
	}
});
