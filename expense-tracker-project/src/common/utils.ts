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

export const getMonthAsNumber = (month: string): string => {
    if ('january'.includes(month)) return '01';
    if ('february'.includes(month)) return '02';
    if ('march'.includes(month)) return '03';
    if ('april'.includes(month)) return '04';
    if ('may'.includes(month)) return '05';
    if ('june'.includes(month)) return '06';
    if ('july'.includes(month)) return '07';
    if ('august'.includes(month)) return '08';
    if ('september'.includes(month)) return '09';
    if ('october'.includes(month)) return '10';
    if ('november'.includes(month)) return '11';
    if ('december'.includes(month)) return '12';
    return 'Invalid month';
}
       