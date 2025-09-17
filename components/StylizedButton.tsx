import { Pressable, StyleSheet, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";


export default function StylizedButton({text, onClick, backgroundColor, centered, borderColor, style}: {text: string, onClick?: () => void, backgroundColor: string, centered?: boolean, borderColor?: string, style?: any}) {
    if (centered == undefined) {
        centered = true;
    }
    return <Pressable onPress={onClick} style={[styles.stylizedButton, {
            backgroundColor, alignSelf: 
            centered ? 'center' : 'flex-start', 
            borderWidth: 2, 
            borderColor: borderColor ? borderColor : "transparent"
        }, style]}>
        <Text style={styles.stylizedButtonText}>{text}</Text>
    </Pressable>
}

const styles = StyleSheet.create({
	stylizedButton: {
		minWidth: 140,
		borderRadius: 12,
		paddingHorizontal: RFValue(16),
		paddingVertical: RFValue(10),
		justifyContent: 'center',
		alignItems: 'center',
		margin: 6
	},
	stylizedButtonText: {
		fontSize: RFValue(16),
		color: 'white',
		fontWeight: '600'
	}
});