import { writable } from 'svelte/store';

// Create a store for robot coordinates
export const robotCoordinates = writable({
  x: 0,
  y: 180, 
  z: 200
});

// Create a store for control mode (true = slider control, false = animation mode)
export const useSliderControl = writable(false);

// Helper function to update coordinates
export function updateCoordinates(x, y, z) {
  robotCoordinates.set({ x, y, z });
}

// Helper function to toggle control mode between slider and animation
export function toggleControlMode() {
  useSliderControl.update(current => !current);
}