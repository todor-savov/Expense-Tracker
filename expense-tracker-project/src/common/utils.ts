import { styled } from "@mui/material";
import LoadTooltip from "../components/LoadTooltip/LoadTooltip";

export const getCategoryIcon = (category: string): JSX.Element => {
    switch (category) {
        case 'Food':
            return LoadTooltip({imgSrc: 'https://img.icons8.com/emoji/48/hamburger-emoji.png', imgAlt: 'hamburger-emoji', type: 'Food'});
        case 'Transport':
            return LoadTooltip({imgSrc: 'https://img.icons8.com/color/48/suv.png', imgAlt: 'suv', type: 'Transport'});
        case 'Utilities':
            return LoadTooltip({imgSrc: 'https://img.icons8.com/officel/80/light-on.png', imgAlt: 'light-on', type: 'Utilities'});
        default:
            return LoadTooltip({imgSrc: 'https://img.icons8.com/color/48/000000/coin-wallet.png', imgAlt: 'coin-wallet', type: 'Other'});
    }
}

export const getPaymentIcon = (payment: string): JSX.Element => {
    switch (payment) {
        case 'Cash':
            return LoadTooltip({imgSrc: 'https://img.icons8.com/color/48/cash-in-hand.png', imgAlt: 'cash-in-hand', type: 'Cash'});
        case 'Card':
            return LoadTooltip({imgSrc: 'https://img.icons8.com/plasticine/100/bank-cards.png', imgAlt: 'bank-cards', type: 'Card'});
        default:
            return LoadTooltip({imgSrc: 'https://img.icons8.com/color/48/000000/coin-wallet.png', imgAlt: 'coin-wallet', type: 'Other'});
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
       