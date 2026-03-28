import type { Meta, StoryObj } from '@storybook/react-vite';
import VibrationGauge from './vibration_gauge';

const meta = {
  title: 'Industrial/VibrationGauge', 
  component: VibrationGauge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 200, step: 1 } },
    color: { control: 'color' },
  },
} satisfies Meta<typeof VibrationGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Estado padrão de operação
export const Normal: Story = {
  args: {
    value: 30,
    max: 100,
    label: 'Motor Principal - RPM',
    color: '#2e7d32',
  },
};

// Estado de Alerta (Vibração alta)
export const Warning: Story = {
  args: {
    value: 85,
    max: 100,
    label: 'Ventilador Sul - Vibração Alta',
    color: '#ed6c02',
  },
};

// Estado Crítico / Falha
export const Critical: Story = {
  args: {
    value: 115,
    max: 120,
    label: 'Bomba de Resfriamento - CRÍTICO',
    color: '#d32f2f', 
  },
};