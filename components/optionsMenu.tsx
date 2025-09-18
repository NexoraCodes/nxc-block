import { cssColors } from "@/constants/Color";
import { MenuStateType, useAppState } from "@/hooks/useAppState";
import { StyleSheet, Text, View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import SimplePopupView from "./SimplePopupView";
import StylizedButton from "./StylizedButton";

export default function OptionsMenu() {
    const [appState, setAppState, _appendAppState, popAppState] = useAppState();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Options</Text>
                <View style={styles.divider} />
            </View>
            
            <View style={styles.content}>
                <View style={styles.buttonGroup}>
                    <StylizedButton 
                        onClick={popAppState} 
                        text="Back to Game" 
                        backgroundColor="rgba(40, 40, 40, 0.9)"
                        borderColor="rgba(0, 147, 132, 0.3)"
                        centered
                    />
                    {appState.containsGameMode() && (
                        <StylizedButton 
                            onClick={() => setAppState(MenuStateType.MENU)} 
                            text="Quit Run"
                            backgroundColor="rgba(200, 60, 60, 0.2)"
                            borderColor="rgba(200, 60, 60, 0.5)"
                            centered
                        />
                    )}
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: -150 }],
        width: '85%',
        maxWidth: 400,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: 20,
    },
    header: {
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Silkscreen',
        marginBottom: 12,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 147, 132, 0.3)',
        marginBottom: 16,
    },
    content: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    buttonGroup: {
        width: '100%',
        gap: 12,
    },
    // Button styles are now handled by StylizedButton component
    settingLabelContainer: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'rgba(30, 30, 30, 0.6)',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 147, 132, 0.2)',
    },
    settingTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Silkscreen',
        marginBottom: 4,
    },
    settingDesc: {
        color: 'rgba(200, 200, 200, 0.7)',
		fontSize: 8,
		fontFamily: 'Silkscreen'
	}
});