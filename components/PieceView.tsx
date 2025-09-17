import { PieceData } from "@/constants/Piece";
import { Image, View } from "react-native";
import { createFilledBlockStyle } from "@/constants/Piece";
import { getBlockTextureForColor } from "@/constants/BlockTextures";

export function PieceView({piece, blockSize, style}: {piece: PieceData, blockSize: number, style?: any}) {
    const pieceHeight = piece.matrix.length;
    const pieceWidth = piece.matrix[0].length;
    const pieceBlocks = [];

    for (let y = 0; y < pieceHeight; y++) {
        for (let x = 0; x < pieceWidth; x++) {
            if (piece.matrix[y][x] == 1) {
                const blockStyle = {
                    width: blockSize,
                    height: blockSize,
                    top: y * blockSize,
                    left: x * blockSize,
                    position: 'absolute' as const,
                    opacity: 0.8,
                };
                pieceBlocks.push(
                    <Image
                        key={`${x},${y}`}
                        source={getBlockTextureForColor(piece.color)}
                        style={[blockStyle, { width: blockSize, height: blockSize }]}
                        resizeMode="cover"
                    />,
                );
            }
        }
    }

    return <View style={[{
        width: pieceWidth * blockSize,
        height: pieceHeight * blockSize
    }, style]}>
        {pieceBlocks}
    </View>
}
