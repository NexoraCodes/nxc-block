import {
	Board,
	BoardBlockType,
	forEachBoardBlock,
	GRID_BLOCK_SIZE,
	HITBOX_SIZE,
	PossibleBoardSpots,
	getResponsiveBlockSize,
	getResponsiveHitboxSize,
} from "@/constants/Board";
import { colorToHex } from "@/constants/Color";
import { Hand } from "@/constants/Hand";
import { randomWithRange } from "@/constants/Math";
import {
	createEmptyBlockStyle,
	createFilledBlockStyle,
} from "@/constants/Piece";
import { useDroppable } from "@mgcrea/react-native-dnd";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	SharedValue,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withTiming,
} from "react-native-reanimated";

interface BlockGridProps {
	board: SharedValue<Board>;
	possibleBoardDropSpots: SharedValue<PossibleBoardSpots>;
	hand: SharedValue<Hand>
	draggingPiece: SharedValue<number | null>
}

function encodeDndId(x: number, y: number): string {
	return `${x},${y}`;
}

function createBlockStyle(x: number, y: number, board: SharedValue<Board>): any {
    const animatedStyle = useAnimatedStyle(() => {
        const block = board.value[y][x];
        let style: any = createEmptyBlockStyle();
        
        if (block.blockType == BoardBlockType.FILLED || block.blockType == BoardBlockType.HOVERED) {
            style = {
                ...createFilledBlockStyle(block.color),
                opacity: block.blockType == BoardBlockType.HOVERED ? 0.3 : 1,
            };
        } else if (block.blockType == BoardBlockType.HOVERED_BREAK_EMPTY || block.blockType == BoardBlockType.HOVERED_BREAK_FILLED) {
            const blockColor =
                block.blockType == BoardBlockType.HOVERED_BREAK_EMPTY
                    ? block.hoveredBreakColor
                    : block.hoveredBreakColor;
            // Show colored blocks without shadow
            const hasValidHoverColor = blockColor.r !== 0 || blockColor.g !== 0 || blockColor.b !== 0;
            if (hasValidHoverColor) {
                style = {
                    ...createFilledBlockStyle(blockColor),
                    opacity: 0.7
                };
            } else {
                style = createEmptyBlockStyle();
            }
        }

        return style;
    });
    
    return animatedStyle;
}

export default function BlockGrid({
	board,
	possibleBoardDropSpots,
	draggingPiece,
	hand
}: BlockGridProps) {
	const blockElements: any[] = [];
	const boardLength = board.value.length;
	const responsiveBlockSize = getResponsiveBlockSize(boardLength);
	const responsiveHitboxSize = getResponsiveHitboxSize(boardLength);
	forEachBoardBlock(board.value, (_block, x, y) => {
		const blockStyle = createBlockStyle(x, y, board);
		const blockPositionStyle = {
			position: "absolute",
			top: y * responsiveBlockSize,
			left: x * responsiveBlockSize,
		};

		blockElements.push(
			<Animated.View
				key={`av${x},${y}`}
				style={[styles.emptyBlock, blockPositionStyle as any, blockStyle, { width: responsiveBlockSize, height: responsiveBlockSize }]}
			>
				<BlockDroppable
					x={x}
					y={y}
					style={[styles.hitbox, { width: responsiveHitboxSize, height: responsiveHitboxSize }]}
					possibleBoardDropSpots={possibleBoardDropSpots}
				></BlockDroppable>
			</Animated.View>
		);
	});
	
	const gridStyle = useAnimatedStyle(() => {
		let style: any;
		if (draggingPiece.value == null) {
			style = {
				borderColor: 'white'
			}
		} else {
			style = {
				borderColor: colorToHex(hand.value[draggingPiece.value!]!.color)
			}
		}
		return style;
	});
	
	return (
		<Animated.View
				style={[
					styles.grid,
					{
						width: responsiveBlockSize * boardLength + 6,
						height: responsiveBlockSize * boardLength + 6,
					},
					gridStyle
				]}
		>
			{blockElements}
		</Animated.View>
	);
}

interface BlockDroppableProps {
	children?: any;
	x: number;
	y: number;
	style: any;
	possibleBoardDropSpots: SharedValue<PossibleBoardSpots>;
}

function BlockDroppable({
	children,
	x,
	y,
	style,
	possibleBoardDropSpots,
	...otherProps
}: BlockDroppableProps) {
	const id = `${x},${y}`;
	const { props, activeId } = useDroppable({
		id,
	});

	// internally of react-native-dnd, the cache of this draggable's layout is only updated in onLayout
	// reanimated styles/animated styles do not call onLayout
	// because of above, react-native-dnd does not see width or height changes and collisions become off
	// below is a very hacky fix

	const updateLayout = () => {
		// this is a weird solution, but pretty much there is a race condition with updating layout immediately
		// after returning a style within useAnimatedStyle on the UI thread
		// 20ms should be good (> 1000ms/60)
		setTimeout(() => {
			(props.onLayout as any)(null);
		}, 1000 / 60);
	};

	const animatedStyle = useAnimatedStyle(() => {
		runOnJS(updateLayout)();
		const active = possibleBoardDropSpots.value[y][x] == 1;
		if (active) {
			// use a smaller size droppable than the block so that detection does not overlap with other blocks.
			return {
				width: HITBOX_SIZE,
				height: HITBOX_SIZE,
			};
		} else {
			return {
				width: 0,
				height: 0,
			};
		}
	}, [props, possibleBoardDropSpots]);

	return (
		<Animated.View {...props} style={[style, animatedStyle]} {...otherProps}>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	emptyBlock: {
		width: GRID_BLOCK_SIZE,
		height: GRID_BLOCK_SIZE,
		margin: 0,
		borderWidth: 1,
		borderRadius: 0,
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	grid: {
		//width: GRID_BLOCK_SIZE * BOARD_LENGTH + 8,
		//height: GRID_BLOCK_SIZE * BOARD_LENGTH + 8,
		position: "relative",
		backgroundColor: "rgb(0, 0, 0, 0.2)",
		borderWidth: 3,
		borderRadius: 5,
		borderColor: "rgb(255, 255, 255)",
		opacity: 1,
	},
	hitbox: {
		width: HITBOX_SIZE,
		height: HITBOX_SIZE,
	},
});
