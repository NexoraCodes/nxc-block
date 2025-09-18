import { Pressable, StyleSheet, Text } from "react-native";


import { StyleProp, TextStyle, ViewStyle } from "react-native";

export default function StylizedButton({
    text, 
    onClick, 
    backgroundColor, 
    centered, 
    borderColor,
    style,
    textStyle
}: {
    text: string, 
    onClick?: () => void, 
    backgroundColor?: string, 
    centered?: boolean, 
    borderColor?: string,
    style?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>
}) {
    if (centered == undefined) {
        centered = true;
    }
    return (
        <Pressable 
            onPress={onClick} 
            style={[
                styles.stylizedButton, 
                {
                    backgroundColor: backgroundColor || 'transparent',
                    alignSelf: centered !== false ? 'center' : 'flex-start',
                    borderWidth: borderColor ? 2 : 0,
                    borderColor: borderColor || 'transparent',
                },
                style
            ]}
        >
            <Text style={[styles.stylizedButtonText, textStyle]}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
	stylizedButton: {
		minWidth: 160,
		height: 44,
        paddingHorizontal: 20,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
	},
	stylizedButtonText: {
		fontSize: 16,
		color: 'white',
		fontFamily: 'Silkscreen',
        fontWeight: 'normal',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
	}
});