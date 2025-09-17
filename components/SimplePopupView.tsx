import { View } from "react-native";
import { theme } from "@/constants/Color";

export default function SimplePopupView({children, style}: {children: any, style?: any[]}) {
	if (style == undefined)
		style = [];
    return <View style={[{
        width: '90%',
        height: '75%',
        backgroundColor: theme.surface,
        borderRadius: 20,
        borderColor: theme.border,
        borderWidth: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        padding: 16,
        rowGap: 12
    }, ...style]}>{children}</View>
}