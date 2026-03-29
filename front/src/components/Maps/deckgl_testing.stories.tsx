import type { Meta, StoryObj } from '@storybook/react-vite';
import DGMap from './deckgl_testing';

const meta = {
  title: 'Industrial/Map', 
  component: DGMap,
  parameters: {
    // Como o DeckGL usa 100vh/100vw, o 'fullscreen' é melhor que o 'centered'
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DGMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultView: Story = {
  args: {}, 
};

export const SplitScreen: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DGMap />
    </div>
  ),
};