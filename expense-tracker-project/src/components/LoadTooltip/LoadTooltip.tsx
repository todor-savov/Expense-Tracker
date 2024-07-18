import Tooltip from '@mui/material/Tooltip';

interface TooltipProps {
    imgSrc: string;
    imgAlt: string;
    type: string;
}

const LoadTooltip = ({ imgSrc, imgAlt, type }: TooltipProps) => {
    return (
        <Tooltip title={type}>
            <img width="48" height="48" src={imgSrc} alt={imgAlt} />
        </Tooltip>
    );
}

export default LoadTooltip;