import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import card from './metrics_card';

const meta = {
  title: 'Industrial/Metric_card', 
  component: card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onSelect: fn() },
  argTypes: {
    color: { control: 'color' },
  },
} satisfies Meta<typeof card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    id: 1,
    width: 100,
    height: 100,
    color: "#1dad00",
    title: "Titulo",
    text: "Texto",
    isActive: true,
    isSelected: true
  },
};

export const Warning: Story = {
  args: {
    id: 2,
    width: 100,
    height: 100,
    color: '#ed6c02',
    title: "Titulo",
    text: "Texto",
    isActive: true,
    isSelected: false
  },
};

export const Critical: Story = {
  args: {
    id: 3,
    width: 100,
    height: 100,
    color: '#d32f2f',
    title: "Titulo",
    text: "Texto", 
    isActive: true,
    isSelected: false
  },
};