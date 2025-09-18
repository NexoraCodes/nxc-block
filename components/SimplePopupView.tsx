import { View, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function SimplePopupView({children, style, visible = true}: {children: any, style?: any[], visible?: boolean}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: visible ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: visible ? 1 : 0.9,
                useNativeDriver: true,
                bounciness: 0,
            })
        ]).start();
    }, [visible]);

    if (style == undefined) style = [];
    
    return (
        <Animated.View 
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
                ...style
            ]}
        >
            <View style={styles.content}>
                {children}
            </View>
            <View style={styles.shineOverlay} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '85%',
        maxWidth: 400,
        maxHeight: '90%',
        backgroundColor: 'rgba(20, 20, 20, 0.98)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 147, 132, 0.3)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    content: {
        width: '100%',
        padding: 20,
        paddingTop: 24,
    },
    shineOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        pointerEvents: 'none',
    },
});
