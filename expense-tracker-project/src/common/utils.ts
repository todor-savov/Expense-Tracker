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