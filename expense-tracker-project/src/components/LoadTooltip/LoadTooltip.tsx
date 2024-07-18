import Tooltip from '@mui/material/Tooltip';

interface TooltipProps {
    imgSrc: string;
    imgAlt: string;
    category: string;
}

const LoadTooltip = ({ imgSrc, imgAlt, category }: TooltipProps) => {
    return (
        <Tooltip title={category}>
            <img width="48" height="48" src={imgSrc} alt={imgAlt} />
        </Tooltip>
    );
}

export default LoadTooltip;