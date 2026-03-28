import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface CardSettings {
    id: number;
    width: number | string;
    height: number | string;
    color: string;
    title: string;
    text: string;
    isActive: boolean;
    isSelected: boolean; 
    onSelect: (id: number) => void;
}

export default function MachineCard({ 
    id, width, height, color, title, text, isActive, isSelected, onSelect 
}: CardSettings) {
    
    return (
        <Box sx={{ width, height, m: 1 }}>
            <Card 
                sx={{ 
                    bgcolor: '#1d212a',
                    border: isSelected ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? `0 0 15px ${color}44` : 'none'
                }}
            >
                <CardActionArea
                    onClick={() => onSelect(id)}
                    sx={{
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}
                >
                    <CardContent sx={{ color: color }}>
                        <Typography 
                            variant="overline" 
                            display="block" 
                            sx={{ color: 'rgba(255,255,255,0.5)' }}
                        >
                            {isActive ? '● Online' : '○ Offline'}
                        </Typography>
                        
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {title}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                            {text}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    );
}