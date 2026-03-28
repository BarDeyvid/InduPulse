import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

// 1. Defina a Interface das Props
interface VibrationGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
}

function GaugePointer({ color = 'red' }: { color?: string }) {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) return null;

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke={color}
        strokeWidth={3}
      />
    </g>
  );
}

// 2. Componente Principal recebendo argumentos
export default function VibrationGauge({ 
  value, 
  min = 0, 
  max = 100, 
  label,
  color = '#2196f3' // Um azul industrial padrão
}: VibrationGaugeProps) {
  
  return (
    <div style={{ textAlign: 'center' }}>
      <GaugeContainer
        width={200}
        height={200}
        startAngle={-110}
        endAngle={110}
        value={value}
        valueMin={min}
        valueMax={max}
      >
        <GaugeReferenceArc />
        <GaugeValueArc style={{ fill: color }} />
        <GaugePointer color={color} />
      </GaugeContainer>
      {label && <p style={{ fontFamily: 'monospace', marginTop: -20 }}>{label}</p>}
    </div>
  );
}