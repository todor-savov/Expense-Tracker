import { styled } from "@mui/material";

export const getCategoryIcon = (category: string): string => {
        switch (category) {
            case 'Food':
                return '🍔';
            case 'Transport':
                return '🚗';
            case 'Utilities':
                return '💡';
            case 'Health':
                return '🏥';
            case 'Rent':
                return '🏠';
            case 'Entertainment':
                return '🎥';
            case 'Miscellaneous':
                return '💰';
            default:
                return '💰';
        }
}

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});