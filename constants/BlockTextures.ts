import { Color } from '@/constants/Color';

// Import block textures
// Note: these PNGs are pre-colored; we pick the closest texture by RGB distance
export const BLOCK_TEXTURES = {
    green: require('@/assets/images/green_block.png'),
    red: require('@/assets/images/red_block.png'),
    pink: require('@/assets/images/pink_block.png'),
    gold: require('@/assets/images/gold_block.png'),
    blue: require('@/assets/images/blue_block.png'),
    purple: require('@/assets/images/purple_block.png'),
} as const;

const TARGET_COLORS: Array<{ key: keyof typeof BLOCK_TEXTURES; color: Color }> = [
    { key: 'green',  color: { r: 16,  g: 158, b: 40  } },
    { key: 'red',    color: { r: 186, g: 19,  b: 38  } },
    { key: 'pink',   color: { r: 255, g: 0,   b: 255 } },
    { key: 'gold',   color: { r: 227, g: 143, b: 16  } },
    { key: 'blue',   color: { r: 20,  g: 56,  b: 184 } },
    { key: 'purple', color: { r: 101, g: 19,  b: 148 } },
];

function colorDistanceSquared(a: Color, b: Color): number {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return dr * dr + dg * dg + db * db;
}

export function getBlockTextureForColor(color: Color | null): any {
    if (!color) return BLOCK_TEXTURES.green;
    let bestKey: keyof typeof BLOCK_TEXTURES = 'green';
    let bestDist = Number.POSITIVE_INFINITY;
    for (const entry of TARGET_COLORS) {
        const dist = colorDistanceSquared(color, entry.color);
        if (dist < bestDist) {
            bestDist = dist;
            bestKey = entry.key;
        }
    }
    return BLOCK_TEXTURES[bestKey];
}


