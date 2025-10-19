<script>
  import { robotCoordinates, useSliderControl, updateCoordinates, toggleControlMode } from '$lib/robotStore.js';
  
  // Define reasonable ranges for the robot workspace
  export let xMin = -200;
  export let xMax = 200;
  export let yMin = -100;
  export let yMax = 300;
  export let zMin = 50;
  export let zMax = 400;
  
  // Subscribe to the store values
  let coordinates = { x: 0, y: 180, z: 200 };
  let sliderControlActive = false;
  
  // Subscribe to store changes
  robotCoordinates.subscribe(value => {
    coordinates = value;
  });
  
  useSliderControl.subscribe(value => {
    sliderControlActive = value;
  });
  
  // Update store when coordinates change
  $: updateCoordinates(coordinates.x, coordinates.y, coordinates.z);
  
  function resetToDefault() {
    coordinates.x = 0;
    coordinates.y = 180;
    coordinates.z = 200;
    updateCoordinates(coordinates.x, coordinates.y, coordinates.z);
  }
  
  function handleToggle() {
    toggleControlMode();
  }
</script>

<div class="robot-controls">
  <h3>Robot Position Controls</h3>
  
  <div class="control-group">
    <label for="x-slider">
      X: <span class="value">{coordinates.x.toFixed(1)}</span>
    </label>
    <input 
      id="x-slider"
      type="range" 
      bind:value={coordinates.x} 
      min={xMin} 
      max={xMax} 
      step="0.5"
      class="slider x-slider"
    />
  </div>
  
  <div class="control-group">
    <label for="y-slider">
      Y: <span class="value">{coordinates.y.toFixed(1)}</span>
    </label>
    <input 
      id="y-slider"
      type="range" 
      bind:value={coordinates.y} 
      min={yMin} 
      max={yMax} 
      step="0.5"
      class="slider y-slider"
    />
  </div>
  
  <div class="control-group">
    <label for="z-slider">
      Z: <span class="value">{coordinates.z.toFixed(1)}</span>
    </label>
    <input 
      id="z-slider"
      type="range" 
      bind:value={coordinates.z} 
      min={zMin} 
      max={zMax} 
      step="0.5"
      class="slider z-slider"
    />
  </div>
  
  <button class="reset-btn" on:click={resetToDefault}>
    Reset to Default
  </button>
  
  <button class="toggle-btn" class:active={sliderControlActive} on:click={handleToggle}>
    {sliderControlActive ? 'Switch to Animation' : 'Switch to Sliders'}
  </button>
</div>

<style>
  .robot-controls {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    min-width: 280px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    z-index: 1000;
  }
  
  h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }
  
  .control-group {
    margin-bottom: 16px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
    font-size: 14px;
  }
  
  .value {
    float: right;
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #333;
  }
  
  .slider {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .slider:hover {
    background: #ccc;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2196F3;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }
  
  .slider::-webkit-slider-thumb:hover {
    background: #1976D2;
    transform: scale(1.1);
  }
  
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2196F3;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  /* Color coding for different axes */
  .x-slider::-webkit-slider-thumb {
    background: #ff4444; /* Red for X */
  }
  
  .y-slider::-webkit-slider-thumb {
    background: #44ff44; /* Green for Y */
  }
  
  .z-slider::-webkit-slider-thumb {
    background: #4444ff; /* Blue for Z */
  }
  
  .x-slider::-moz-range-thumb {
    background: #ff4444;
  }
  
  .y-slider::-moz-range-thumb {
    background: #44ff44;
  }
  
  .z-slider::-moz-range-thumb {
    background: #4444ff;
  }
  
  .reset-btn {
    width: 100%;
    padding: 10px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  
  .reset-btn:hover {
    background: #1976D2;
  }
  
  .reset-btn:active {
    transform: scale(0.98);
  }
  
  .toggle-btn {
    width: 100%;
    padding: 10px;
    background: #FF9800;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .toggle-btn:hover {
    background: #F57C00;
  }
  
  .toggle-btn:active {
    transform: scale(0.98);
  }
  
  .toggle-btn.active {
    background: #4CAF50;
  }
  
  .toggle-btn.active:hover {
    background: #45A049;
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .robot-controls {
      background: rgba(40, 40, 40, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    h3 {
      color: #fff;
    }
    
    label {
      color: #ccc;
    }
    
    .value {
      background: #333;
      color: #fff;
    }
    
    .slider {
      background: #555;
    }
    
    .slider:hover {
      background: #666;
    }
  }
</style>