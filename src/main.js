import './style.css'

// ==========================================
// Subtractive Color Mixing Math (Absorbance Model)
// ==========================================

// Clamp helper
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// Convert RGB to Subtractive Absorbance
function rgbToAbsorbance(r, g, b) {
  // Clamp values and normalize to 0..1
  // We use 12 as a minimum to prevent division by zero / infinite absorption
  const cr = clamp(r, 12, 255) / 255;
  const cg = clamp(g, 12, 255) / 255;
  const cb = clamp(b, 12, 255) / 255;
  
  return {
    r: -Math.log(cr),
    g: -Math.log(cg),
    b: -Math.log(cb)
  };
}

// Convert Subtractive Absorbance to RGB
function absorbanceToRgb(abs) {
  const r = Math.round(255 * Math.exp(-abs.r));
  const g = Math.round(255 * Math.exp(-abs.g));
  const b = Math.round(255 * Math.exp(-abs.b));
  
  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255)
  };
}

// Convert RGB to Hex String
function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert Hex String to RGB
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

// ==========================================
// Artist Paint Swatches Names
// ==========================================
const ARTIST_PIGMENTS = [
  { name: 'Cadmium Red', hex: '#e61e28', r: 230, g: 30, b: 40 },
  { name: 'Cadmium Yellow', hex: '#ffdc00', r: 255, g: 220, b: 0 },
  { name: 'Ultramarine Blue', hex: '#0050c8', r: 0, g: 80, b: 200 },
  { name: 'Phthalo Green', hex: '#00aa50', r: 0, g: 170, b: 80 },
  { name: 'Cadmium Orange', hex: '#ff6e00', r: 255, g: 110, b: 0 },
  { name: 'Dioxazine Violet', hex: '#7800b4', r: 120, g: 0, b: 180 },
  { name: 'Cerulean Blue', hex: '#00c8ff', r: 0, g: 200, b: 255 },
  { name: 'Quinacridone Magenta', hex: '#ff00a0', r: 255, g: 0, b: 160 },
  { name: 'Titanium White', hex: '#ffffff', r: 255, g: 255, b: 255 },
  { name: 'Carbon Black', hex: '#141414', r: 20, g: 20, b: 20 },
  { name: 'Burnt Sienna', hex: '#8b4513', r: 139, g: 69, b: 19 },
  { name: 'Teal Blue', hex: '#008080', r: 0, g: 128, b: 128 },
  { name: 'Lavender Tint', hex: '#e6e6fa', r: 230, g: 230, b: 250 },
  { name: 'Blush Pink', hex: '#ffb6c1', r: 255, g: 182, b: 193 },
  { name: 'Olive Green', hex: '#808000', r: 128, g: 128, b: 0 }
];

function getColorName(r, g, b) {
  let closest = ARTIST_PIGMENTS[0];
  let minDist = Infinity;
  
  for (const pigment of ARTIST_PIGMENTS) {
    const dist = Math.sqrt(
      Math.pow(r - pigment.r, 2) +
      Math.pow(g - pigment.g, 2) +
      Math.pow(b - pigment.b, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      closest = pigment;
    }
  }
  
  if (minDist < 15) {
    return closest.name;
  } else if (minDist < 60) {
    if (closest.name === 'Titanium White') return 'Pale Pastel Mix';
    if (closest.name === 'Carbon Black') return 'Deep Dark Shade';
    return `${closest.name} Tone`;
  } else {
    // Determine shade/tint/hue
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness > 220) return 'Bright Tint Mix';
    if (brightness < 45) return 'Rich Dark Shadow';
    return `${closest.name} Custom Blend`;
  }
}

// ==========================================
// Paint Tube Configs (Presets)
// ==========================================
const PAINT_PRESETS = [
  { name: 'Red', color: '#e61e28' },
  { name: 'Yellow', color: '#ffdc00' },
  { name: 'Blue', color: '#0050c8' },
  { name: 'Orange', color: '#ff6e00' },
  { name: 'Green', color: '#00aa50' },
  { name: 'Purple', color: '#7800b4' },
  { name: 'Magenta', color: '#ff00a0' },
  { name: 'Cyan', color: '#00c8ff' },
  { name: 'White', color: '#ffffff' },
  { name: 'Black', color: '#141414' }
];

// ==========================================
// Application State
// ==========================================
let activePaintColor = '#0050c8'; // Default: Ultramarine Blue
let currentTool = 'spatula'; // 'spatula' (drag/mix), 'stir' (blend marbled), 'knife' (slice)
let activeTheme = 'wood'; // 'wood', 'ceramic', 'slate'
let blobs = [];
let savedSwatches = JSON.parse(localStorage.getItem('mixr-swatches') || '[]');
let activeBlob = null; // Currently selected/dragged blob
let selectedBlobForInfo = null; // Blob shown in top active-color panel

// Interaction variables
let dragOffset = { x: 0, y: 0 };
let isSlicing = false;
let sliceStart = { x: 0, y: 0 };
let sliceCurrent = { x: 0, y: 0 };

// ==========================================
// Scaffolding UI HTML
// ==========================================
const appContainer = document.querySelector('#app');
appContainer.innerHTML = `
  <div class="studio-container">
    <div id="sidebar-backdrop" class="sidebar-backdrop"></div>
    
    <!-- Header Area -->
    <header class="studio-header">
      <div class="header-logo-row">
        <button id="btn-menu-toggle" class="btn-menu-toggle" title="Open Studio Controls" aria-label="Open Studio Controls">
          <span class="hamburger-icon">☰</span>
          <span class="toggle-text">Controls</span>
        </button>
        <div class="header-logo">
          <span class="logo-icon">🎨</span>
          <h1>Mixr</h1>
          <span class="logo-sub">Paint Studio</span>
        </div>
      </div>
      
      <!-- Real-time Active Color Bar -->
      <div id="active-color-panel" class="active-color-panel">
        <div class="swatch-wrapper">
          <div id="active-swatch" class="active-swatch"></div>
        </div>
        <div class="color-details">
          <div id="color-name" class="color-name">Ultramarine Blue</div>
          <div class="hex-row">
            <code id="color-hex" class="color-hex">#0050c8</code>
            <button id="btn-copy-hex" class="btn-icon" title="Copy Hex Code">📋</button>
          </div>
        </div>
        <button id="btn-save-swatch" class="btn-primary">✨ Save Swatch</button>
      </div>
    </header>

    <div class="studio-workspace">
      <!-- Sidebar Control Panel -->
      <aside id="control-panel" class="control-panel">
        <div class="sidebar-header">
          <h3>Studio Controls</h3>
          <button id="btn-menu-close" class="btn-menu-close" title="Close Controls" aria-label="Close Controls">✕</button>
        </div>
        
        <!-- Paint Tubes -->
        <section class="panel-section">
          <h2>Paint Palette Tubes</h2>
          <div class="paint-tubes-grid">
            ${PAINT_PRESETS.map(preset => `
              <button 
                class="paint-tube-btn ${preset.color === activePaintColor ? 'active' : ''}" 
                data-color="${preset.color}"
                style="--tube-color: ${preset.color}"
                title="${preset.name} Paint"
              >
                <div class="tube-cap"></div>
                <div class="tube-body">
                  <span class="tube-label">${preset.name}</span>
                </div>
              </button>
            `).join('')}
          </div>
          
          <!-- Custom Color Picker -->
          <div class="custom-picker-row">
            <label for="custom-picker">Custom Tube Picker:</label>
            <input type="color" id="custom-picker" value="#9c27b0" title="Choose custom paint color">
          </div>
        </section>

        <!-- Studio Tools -->
        <section class="panel-section">
          <h2>Studio Tools</h2>
          <div class="tools-grid">
            <button id="tool-spatula" class="tool-btn active" title="Spatula: Move & Mix Paint Blobs">
              <span class="tool-icon">🥄</span>
              <span class="tool-label">Spatula Tool</span>
            </button>
            <button id="tool-stir" class="tool-btn" title="Stir Knife: Stir Marbled Paint to blend thoroughly">
              <span class="tool-icon">🔄</span>
              <span class="tool-label">Stir Knife</span>
            </button>
            <button id="tool-knife" class="tool-btn" title="Slicing Knife: Drag through paint to slice in half">
              <span class="tool-icon">🔪</span>
              <span class="tool-label">Slice Knife</span>
            </button>
          </div>
        </section>

        <!-- Palette Board Theme Selection -->
        <section class="panel-section">
          <h2>Palette Theme</h2>
          <div class="themes-row">
            <button class="theme-btn active" data-theme="wood" title="Classic Wooden Board">🪵 Wood</button>
            <button class="theme-btn" data-theme="ceramic" title="Glossy Ceramic Plate">🍽️ Ceramic</button>
            <button class="theme-btn" data-theme="slate" title="Sleek Slate Board">🪨 Slate</button>
          </div>
        </section>

        <!-- Board Actions -->
        <section class="panel-section actions-section">
          <button id="btn-clear-palette" class="btn-danger">🧽 Clean Palette Board</button>
        </section>
      </aside>

      <!-- Main Canvas Board Container -->
      <main class="canvas-board-container">
        <div id="board-frame" class="board-frame theme-wood">
          <canvas id="palette-canvas" width="800" height="550"></canvas>
          <div id="slice-laser" class="slice-laser"></div>
        </div>
        
        <!-- Mobile Floating Quick-Tools -->
        <div class="mobile-quick-tools">
          <button class="quick-tool-btn active" data-tool="spatula" title="Spatula Tool">
            <span class="quick-icon">🥄</span>
            <span class="quick-label">Spatula</span>
          </button>
          <button class="quick-tool-btn" data-tool="stir" title="Stir Knife">
            <span class="quick-icon">🔄</span>
            <span class="quick-label">Stir</span>
          </button>
          <button class="quick-tool-btn" data-tool="knife" title="Slice Knife">
            <span class="quick-icon">🔪</span>
            <span class="quick-label">Slice</span>
          </button>
        </div>

        <div class="canvas-instruction">
          <span id="instruction-text">💡 Click on blank space to place a dollop of paint. Drag dollops together with the Spatula to mix!</span>
        </div>
      </main>
    </div>

    <!-- Saved Color Swatches History (Premium Feature Area) -->
    <footer class="swatches-footer">
      <div class="footer-header">
        <h2>Saved Swatches Palette History</h2>
        <div class="footer-actions">
          <button id="btn-export-css" class="btn-secondary">Export CSS</button>
          <button id="btn-export-png" class="btn-secondary">Download Palette PNG</button>
        </div>
      </div>
      <div id="swatches-grid" class="swatches-grid">
        <!-- Injected via JavaScript -->
        <div class="empty-swatches">No saved swatches yet. Mix paint and click "Save Swatch" to start your palette collection!</div>
      </div>
    </footer>
  </div>
`;

// ==========================================
// Canvas Setup & Elements
// ==========================================
const canvas = document.getElementById('palette-canvas');
const ctx = canvas.getContext('2d');
const boardFrame = document.getElementById('board-frame');

// Update UI references
const activeSwatchEl = document.getElementById('active-swatch');
const colorNameEl = document.getElementById('color-name');
const colorHexEl = document.getElementById('color-hex');
const btnCopyHex = document.getElementById('btn-copy-hex');
const btnSaveSwatch = document.getElementById('btn-save-swatch');
const btnClearPalette = document.getElementById('btn-clear-palette');
const swatchesGrid = document.getElementById('swatches-grid');
const customPicker = document.getElementById('custom-picker');

// Instruction texts
const toolInstructions = {
  spatula: "💡 Click blank space to add paint dollops. Drag dollops together to merge & subtractively blend them!",
  stir: "🔄 Rub/Stir marbled paint dollops with the cursor to blend their pigments into a smooth homogeneous color!",
  knife: "🔪 Click and drag a slicing line straight through a paint dollop to slice it cleanly in half!"
};

// Update active color panels
function updateActiveColorPanel(r, g, b) {
  const hex = rgbToHex(r, g, b);
  activeSwatchEl.style.backgroundColor = hex;
  colorHexEl.textContent = hex;
  colorNameEl.textContent = getColorName(r, g, b);
}

// Set up active color preset listener
document.querySelectorAll('.paint-tube-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.paint-tube-btn').forEach(b => b.classList.remove('active'));
    const targetBtn = e.currentTarget;
    targetBtn.classList.add('active');
    activePaintColor = targetBtn.dataset.color;
    const rgb = hexToRgb(activePaintColor);
    updateActiveColorPanel(rgb.r, rgb.g, rgb.b);
  });
});

// Custom color picker listener
customPicker.addEventListener('input', (e) => {
  // Deselect preset tubes
  document.querySelectorAll('.paint-tube-btn').forEach(b => b.classList.remove('active'));
  activePaintColor = e.target.value;
  const rgb = hexToRgb(activePaintColor);
  updateActiveColorPanel(rgb.r, rgb.g, rgb.b);
});

// Tool selector buttons
function setTool(toolName) {
  currentTool = toolName;
  document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
  const sidebarToolBtn = document.getElementById(`tool-${toolName}`);
  if (sidebarToolBtn) sidebarToolBtn.classList.add('active');
  
  // Sync quick tools active state
  document.querySelectorAll('.quick-tool-btn').forEach(btn => {
    if (btn.dataset.tool === toolName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.getElementById('instruction-text').textContent = toolInstructions[toolName];
  canvas.style.cursor = toolName === 'spatula' ? 'cell' : toolName === 'stir' ? 'w-resize' : 'crosshair';
}

document.getElementById('tool-spatula').addEventListener('click', () => setTool('spatula'));
document.getElementById('tool-stir').addEventListener('click', () => setTool('stir'));
document.getElementById('tool-knife').addEventListener('click', () => setTool('knife'));

// Mobile sidebar toggle event listeners
const controlPanel = document.getElementById('control-panel');
const btnMenuToggle = document.getElementById('btn-menu-toggle');
const btnMenuClose = document.getElementById('btn-menu-close');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');

if (btnMenuToggle && btnMenuClose && sidebarBackdrop && controlPanel) {
  const openSidebar = () => {
    controlPanel.classList.add('open');
    sidebarBackdrop.classList.add('open');
  };
  const closeSidebar = () => {
    controlPanel.classList.remove('open');
    sidebarBackdrop.classList.remove('open');
  };
  btnMenuToggle.addEventListener('click', openSidebar);
  btnMenuClose.addEventListener('click', closeSidebar);
  sidebarBackdrop.addEventListener('click', closeSidebar);
}

// Mobile quick tools listeners and sync with main sidebar tools
const quickToolBtns = document.querySelectorAll('.quick-tool-btn');
quickToolBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tool = e.currentTarget.dataset.tool;
    setTool(tool);
  });
});

// Theme switcher buttons
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeTheme = e.target.dataset.theme;
    
    // Update frame class
    boardFrame.className = `board-frame theme-${activeTheme}`;
  });
});

// ==========================================
// Painting Blob Class & Generation
// ==========================================
class PaintBlob {
  constructor(x, y, rgb, volume = 1.0) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = x;
    this.y = y;
    this.volume = volume;
    this.radius = this.calculateRadius();
    this.absorbance = rgbToAbsorbance(rgb.r, rgb.g, rgb.b);
    
    // Marble/Swirling state
    this.homogeneity = 1.0;
    this.color1 = null;
    this.color2 = null;
    this.marbleSeed = Math.random(); // Used to draw stable marble lines
    this.marbleCurves = this.generateMarbleSwirls();
    
    this.isDragging = false;
    this.updateColor();
  }

  calculateRadius() {
    // Volume scales radius proportionally to square root of volume (Area ~ Volume)
    return 24 * Math.sqrt(this.volume);
  }

  updateColor() {
    const rgb = absorbanceToRgb(this.absorbance);
    this.color = rgbToHex(rgb.r, rgb.g, rgb.b);
    this.rgb = rgb;
  }

  generateMarbleSwirls() {
    // Generate static relative control points for Bézier curves to represent swirls
    const curves = [];
    const numCurves = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numCurves; i++) {
      curves.push({
        cp1x: (Math.random() - 0.5) * 1.5,
        cp1y: (Math.random() - 0.5) * 1.5,
        cp2x: (Math.random() - 0.5) * 1.5,
        cp2y: (Math.random() - 0.5) * 1.5,
        x: (Math.random() - 0.5) * 1.6,
        y: (Math.random() - 0.5) * 1.6,
        width: 2 + Math.random() * 6
      });
    }
    return curves;
  }

  // Set marble composition when two different color blobs merge
  setMarbled(color1, color2) {
    this.homogeneity = 0.0;
    this.color1 = color1;
    this.color2 = color2;
    this.marbleCurves = this.generateMarbleSwirls();
  }

  // Slowly mix colors when stirred
  stir(amount = 0.02) {
    if (this.homogeneity < 1.0) {
      this.homogeneity = clamp(this.homogeneity + amount, 0.0, 1.0);
    }
  }

  draw(ctx) {
    // 1. Draw Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    ctx.fill();
    ctx.restore();

    // 2. Draw thick height edge at bottom-right
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x + 1.5, this.y + 1.5, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // 3. Draw Body (with clip for marbled swirls)
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.clip();

    if (this.homogeneity < 1.0 && this.color1 && this.color2) {
      // Draw partially blended marble/swirl paint!
      ctx.fillStyle = this.color1;
      ctx.fill();

      // Draw swirling marble ribbons
      ctx.strokeStyle = this.color2;
      ctx.lineCap = 'round';
      
      this.marbleCurves.forEach(curve => {
        ctx.beginPath();
        ctx.lineWidth = curve.width * (1.0 - this.homogeneity) * (this.radius / 24);
        
        // Swirl offset coordinates
        const startX = this.x - this.radius * 0.8;
        const startY = this.y - this.radius * 0.8;
        ctx.moveTo(startX, startY);
        
        ctx.bezierCurveTo(
          this.x + curve.cp1x * this.radius, this.y + curve.cp1y * this.radius,
          this.x + curve.cp2x * this.radius, this.y + curve.cp2y * this.radius,
          this.x + curve.x * this.radius, this.y + curve.y * this.radius
        );
        // Alpha fades as homogeneity blends
        ctx.globalAlpha = 1.0 - this.homogeneity;
        ctx.stroke();
      });
      ctx.globalAlpha = 1.0;

      // Draw overlay homogeneous fade
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.homogeneity;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    } else {
      // Fully blended solid paint
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    ctx.restore();

    // 4. Draw Specular Highlight (Shiny Gloss dome reflection)
    const highlightGradient = ctx.createRadialGradient(
      this.x - this.radius * 0.35, this.y - this.radius * 0.35, 0,
      this.x, this.y, this.radius
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    highlightGradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.25)');
    highlightGradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.02)');
    highlightGradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.05)');
    highlightGradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = highlightGradient;
    ctx.fill();
    ctx.restore();

    // 5. Draw active outline if selected
    if (selectedBlobForInfo === this) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(170, 59, 255, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 3]);
      ctx.stroke();
      ctx.restore();
    }
  }

  isPointInside(px, py) {
    const dist = Math.sqrt((px - this.x) ** 2 + (py - this.y) ** 2);
    return dist <= this.radius;
  }
}

// Initial default blobs
function initDefaultBlobs() {
  blobs = [
    new PaintBlob(250, 200, hexToRgb('#ffdc00'), 1.2), // Yellow
    new PaintBlob(450, 200, hexToRgb('#0050c8'), 1.2), // Blue
    new PaintBlob(350, 360, hexToRgb('#e61e28'), 1.0)  // Red
  ];
  selectedBlobForInfo = blobs[0];
  const rgb = blobs[0].rgb;
  updateActiveColorPanel(rgb.r, rgb.g, rgb.b);
}

// ==========================================
// Blending Subtractive Physics Collision
// ==========================================
function checkBlobCollisions() {
  if (currentTool !== 'spatula') return;

  for (let i = 0; i < blobs.length; i++) {
    const b1 = blobs[i];
    
    for (let j = i + 1; j < blobs.length; j++) {
      const b2 = blobs[j];
      
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = b1.radius + b2.radius;

      // When they overlap by more than 15%, merge them!
      if (distance < minDistance * 0.85) {
        // We found a collision! Merge b2 into b1
        const totalVolume = b1.volume + b2.volume;
        
        // Capture colors for the marble swirl effect
        const b1Color = b1.color;
        const b2Color = b2.color;

        // Calculate subtractive mixed absorbance (weighted by volume)
        const mixedAbsorbance = {
          r: (b1.absorbance.r * b1.volume + b2.absorbance.r * b2.volume) / totalVolume,
          g: (b1.absorbance.g * b1.volume + b2.absorbance.g * b2.volume) / totalVolume,
          b: (b1.absorbance.b * b1.volume + b2.absorbance.b * b2.volume) / totalVolume
        };

        // Determine new weighted position
        const newX = (b1.x * b1.volume + b2.x * b2.volume) / totalVolume;
        const newY = (b1.y * b1.volume + b2.y * b2.volume) / totalVolume;

        // Perform merge values update on b1
        b1.absorbance = mixedAbsorbance;
        b1.volume = totalVolume;
        b1.radius = b1.calculateRadius();
        b1.x = clamp(newX, b1.radius, canvas.width - b1.radius);
        b1.y = clamp(newY, b1.radius, canvas.height - b1.radius);
        b1.updateColor();

        // Create gorgeous marble swirl effect!
        if (b1Color !== b2Color) {
          b1.setMarbled(b1Color, b2Color);
        }

        // If we are dragging b2, transfer drag action to b1
        if (b2.isDragging || activeBlob === b2) {
          b1.isDragging = true;
          activeBlob = b1;
        }

        // Select the merged blob
        selectedBlobForInfo = b1;
        const rgb = b1.rgb;
        updateActiveColorPanel(rgb.r, rgb.g, rgb.b);

        // Splat particles effect
        spawnMergeParticles(b1.x, b1.y, b1.color);

        // Remove b2
        blobs.splice(j, 1);
        
        // Adjust loop index
        j--;
        
        break; // Return early to handle only one collision per check
      }
    }
  }
}

// ==========================================
// Splat Particles Animation Effect
// ==========================================
let particles = [];
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 2 + Math.random() * 4;
    
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    this.alpha = 1.0;
    this.decay = 0.03 + Math.random() * 0.04;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // Add gravity
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.restore();
  }
}

function spawnMergeParticles(x, y, color) {
  for (let i = 0; i < 12; i++) {
    particles.push(new Particle(x, y, color));
  }
}

// ==========================================
// Stirring (Marbling Blend) Physics
// ==========================================
function checkBlobStirring(mx, my) {
  if (currentTool !== 'stir') return;
  
  blobs.forEach(blob => {
    if (blob.isPointInside(mx, my) && blob.homogeneity < 1.0) {
      blob.stir(0.015); // Progress blend
      if (blob.homogeneity >= 1.0) {
        // Fully mixed trigger visual splash
        spawnMergeParticles(blob.x, blob.y, blob.color);
      }
    }
  });
}

// ==========================================
// Slicing (Knife Split Tool) Physics
// ==========================================
function executeKnifeSlice(p1, p2) {
  const lineSegmentDistance = (x, y, x1, y1, x2, y2) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const newBlobs = [];
  const blobsToRemove = [];

  blobs.forEach(blob => {
    // Check if slice line intersected the paint blob
    const dist = lineSegmentDistance(blob.x, blob.y, p1.x, p1.y, p2.x, p2.y);
    
    // If cut cuts through the paint circle (needs to cut significantly, dist < radius)
    if (dist < blob.radius * 0.9 && blob.volume >= 0.25) {
      blobsToRemove.push(blob);

      // Slice direction normal
      const sliceDx = p2.x - p1.x;
      const sliceDy = p2.y - p1.y;
      const sliceLength = Math.sqrt(sliceDx * sliceDx + sliceDy * sliceDy);
      
      // Calculate normalized perpendicular vector
      const nx = -sliceDy / sliceLength;
      const ny = sliceDx / sliceLength;

      // Splitting volume in half
      const splitVolume = blob.volume / 2;
      
      // Push the split dollops slightly apart perpendicular to the cut direction
      const separation = blob.radius * 0.65;
      const blob1_x = clamp(blob.x + nx * separation, 25, canvas.width - 25);
      const blob1_y = clamp(blob.y + ny * separation, 25, canvas.height - 25);
      const blob2_x = clamp(blob.x - nx * separation, 25, canvas.width - 25);
      const blob2_y = clamp(blob.y - ny * separation, 25, canvas.height - 25);

      const b1 = new PaintBlob(blob1_x, blob1_y, blob.rgb, splitVolume);
      const b2 = new PaintBlob(blob2_x, blob2_y, blob.rgb, splitVolume);

      // Preserve marbling state to daughters if parent was marbled
      if (blob.homogeneity < 1.0) {
        b1.setMarbled(blob.color1, blob.color2);
        b1.homogeneity = blob.homogeneity;
        b2.setMarbled(blob.color1, blob.color2);
        b2.homogeneity = blob.homogeneity;
      }

      newBlobs.push(b1, b2);
      spawnMergeParticles(blob.x, blob.y, blob.color);
    }
  });

  // Apply slice changes
  if (blobsToRemove.length > 0) {
    blobs = blobs.filter(b => !blobsToRemove.includes(b));
    blobs.push(...newBlobs);
    
    // Auto reset selection
    selectedBlobForInfo = blobs[blobs.length - 1] || null;
    if (selectedBlobForInfo) {
      const rgb = selectedBlobForInfo.rgb;
      updateActiveColorPanel(rgb.r, rgb.g, rgb.b);
    }
  }
}

// ==========================================
// Mouse / Touch Gesture Listeners
// ==========================================
function getCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  // Support touch interface
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  // Prevent division by zero if rect has 0 width or height (not fully rendered yet)
  const widthRatio = rect.width > 0 ? (canvas.width / rect.width) : 1;
  const heightRatio = rect.height > 0 ? (canvas.height / rect.height) : 1;

  return {
    x: (clientX - rect.left) * widthRatio,
    y: (clientY - rect.top) * heightRatio
  };
}

function handleStart(coords, e) {
  if (currentTool === 'spatula') {
    // Check if we hit an existing blob
    activeBlob = blobs.find(b => b.isPointInside(coords.x, coords.y));
    
    if (activeBlob) {
      activeBlob.isDragging = true;
      selectedBlobForInfo = activeBlob;
      dragOffset.x = coords.x - activeBlob.x;
      dragOffset.y = coords.y - activeBlob.y;
      
      const rgb = activeBlob.rgb;
      updateActiveColorPanel(rgb.r, rgb.g, rgb.b);
    } else {
      // Squeeze out new dollop of selected color!
      const rgb = hexToRgb(activePaintColor);
      const newBlob = new PaintBlob(coords.x, coords.y, rgb, 1.0);
      
      // Keep inside bounds
      newBlob.x = clamp(newBlob.x, newBlob.radius, canvas.width - newBlob.radius);
      newBlob.y = clamp(newBlob.y, newBlob.radius, canvas.height - newBlob.radius);
      
      blobs.push(newBlob);
      selectedBlobForInfo = newBlob;
      spawnMergeParticles(newBlob.x, newBlob.y, activePaintColor);
      updateActiveColorPanel(rgb.r, rgb.g, rgb.b);
    }
  } else if (currentTool === 'stir') {
    checkBlobStirring(coords.x, coords.y);
  } else if (currentTool === 'knife') {
    isSlicing = true;
    sliceStart = { ...coords };
    sliceCurrent = { ...coords };
  }
}

function handleMove(coords, e) {
  if (currentTool === 'spatula' && activeBlob && activeBlob.isDragging) {
    // Drag selected blob
    const targetX = coords.x - dragOffset.x;
    const targetY = coords.y - dragOffset.y;
    
    // Bounds check
    activeBlob.x = clamp(targetX, activeBlob.radius, canvas.width - activeBlob.radius);
    activeBlob.y = clamp(targetY, activeBlob.radius, canvas.height - activeBlob.radius);
    
    // Constantly check merge as we drag
    checkBlobCollisions();
  } else if (currentTool === 'stir') {
    checkBlobStirring(coords.x, coords.y);
  } else if (currentTool === 'knife' && isSlicing) {
    sliceCurrent = { ...coords };
  }
}

function handleEnd(e) {
  if (activeBlob) {
    activeBlob.isDragging = false;
    activeBlob = null;
  }
  
  if (currentTool === 'knife' && isSlicing) {
    isSlicing = false;
    executeKnifeSlice(sliceStart, sliceCurrent);
  }
}

// Attach Mouse event listeners
canvas.addEventListener('mousedown', (e) => {
  const coords = getCoordinates(e);
  handleStart(coords, e);
});

canvas.addEventListener('mousemove', (e) => {
  const coords = getCoordinates(e);
  handleMove(coords, e);
});

window.addEventListener('mouseup', handleEnd);

// Attach Touch event listeners for tablet support!
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent standard page scroll
  const coords = getCoordinates(e);
  handleStart(coords, e);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const coords = getCoordinates(e);
  handleMove(coords, e);
});

window.addEventListener('touchend', handleEnd);

// ==========================================
// Board Clear Actions
// ==========================================
btnClearPalette.addEventListener('click', () => {
  // Wipe animation: clear blobs and trigger particles
  blobs.forEach(b => spawnMergeParticles(b.x, b.y, b.color));
  blobs = [];
  selectedBlobForInfo = null;
  
  // Reset panel default
  const rgb = hexToRgb(activePaintColor);
  updateActiveColorPanel(rgb.r, rgb.g, rgb.b);
});

// Copy Hex code helper
btnCopyHex.addEventListener('click', () => {
  const hex = colorHexEl.textContent;
  navigator.clipboard.writeText(hex).then(() => {
    btnCopyHex.textContent = '✅';
    setTimeout(() => { btnCopyHex.textContent = '📋'; }, 1500);
  });
});

// ==========================================
// Swatch Palette Collection History (Premium Features)
// ==========================================
function renderSwatchesHistory() {
  if (savedSwatches.length === 0) {
    swatchesGrid.innerHTML = `
      <div class="empty-swatches">No saved swatches yet. Mix paint and click "Save Swatch" to start your palette collection!</div>
    `;
    return;
  }

  swatchesGrid.innerHTML = savedSwatches.map((swatch, idx) => `
    <div class="swatch-card" style="--swatch-color: ${swatch.hex}">
      <div class="swatch-paint-dollop"></div>
      <div class="swatch-card-details">
        <div class="swatch-card-name" title="${swatch.name}">${swatch.name}</div>
        <div class="swatch-card-hex"><code>${swatch.hex}</code></div>
      </div>
      <button class="btn-card-copy" data-hex="${swatch.hex}" title="Copy Hex">📋</button>
      <button class="btn-card-delete" data-idx="${idx}" title="Delete Swatch">❌</button>
    </div>
  `).join('');

  // Register swatch triggers
  document.querySelectorAll('.btn-card-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const hex = e.target.dataset.hex;
      navigator.clipboard.writeText(hex).then(() => {
        e.target.textContent = '✅';
        setTimeout(() => { e.target.textContent = '📋'; }, 1500);
      });
    });
  });

  document.querySelectorAll('.btn-card-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      savedSwatches.splice(idx, 1);
      localStorage.setItem('mixr-swatches', JSON.stringify(savedSwatches));
      renderSwatchesHistory();
    });
  });
}

// Save Current Swatch Trigger
btnSaveSwatch.addEventListener('click', () => {
  const currentHex = colorHexEl.textContent;
  const currentName = colorNameEl.textContent;

  // Avoid duplicates in history
  if (savedSwatches.some(s => s.hex.toLowerCase() === currentHex.toLowerCase())) {
    alert("This swatch is already saved in your history!");
    return;
  }

  savedSwatches.unshift({
    name: currentName,
    hex: currentHex
  });

  localStorage.setItem('mixr-swatches', JSON.stringify(savedSwatches));
  renderSwatchesHistory();
});

// CSS Palette Export (Premium Feature)
document.getElementById('btn-export-css').addEventListener('click', () => {
  if (savedSwatches.length === 0) {
    alert("Save some swatches first to export your palette css!");
    return;
  }

  let cssOutput = `/* Mixr Color Palette Export */\n:root {\n`;
  savedSwatches.forEach((swatch, idx) => {
    const varName = `--color-${swatch.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx + 1}`;
    cssOutput += `  ${varName}: ${swatch.hex};\n`;
  });
  cssOutput += `}`;

  const blob = new Blob([cssOutput], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mixr-palette.css';
  a.click();
  URL.revokeObjectURL(url);
});

// PNG Color Swatches Download (High-resolution, premium feature)
document.getElementById('btn-export-png').addEventListener('click', () => {
  if (savedSwatches.length === 0) {
    alert("Please save some swatches first to generate your downloadable PNG color board!");
    return;
  }

  // Generate high-resolution color swatches PNG card
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  // Set canvas size (1200x800 for high quality)
  tempCanvas.width = 1200;
  tempCanvas.height = 800;

  // Draw background board
  tempCtx.fillStyle = '#1e1e24'; // Sleek dark slate
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw Header
  tempCtx.fillStyle = '#ffffff';
  tempCtx.font = 'bold 44px sans-serif';
  tempCtx.fillText('Mixr Palette Board', 80, 100);

  tempCtx.fillStyle = '#8a8d9a';
  tempCtx.font = '22px sans-serif';
  tempCtx.fillText('Subtractive Hand-mixed Color Studio Collection', 80, 140);

  // Draw Grid of Swatches
  const startX = 80;
  const startY = 200;
  const cardW = 320;
  const cardH = 140;
  const gap = 30;

  savedSwatches.slice(0, 9).forEach((swatch, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    // Card background
    tempCtx.fillStyle = '#2d2d38';
    // Rounded Card
    tempCtx.beginPath();
    tempCtx.roundRect ? tempCtx.roundRect(x, y, cardW, cardH, 12) : tempCtx.rect(x, y, cardW, cardH);
    tempCtx.fill();

    // Color Box
    tempCtx.fillStyle = swatch.hex;
    tempCtx.beginPath();
    tempCtx.roundRect ? tempCtx.roundRect(x + 15, y + 15, 110, 110, 8) : tempCtx.rect(x + 15, y + 15, 110, 110);
    tempCtx.fill();

    // Write labels
    tempCtx.fillStyle = '#ffffff';
    tempCtx.font = 'bold 22px sans-serif';
    tempCtx.fillText(swatch.name, x + 140, y + 55, cardW - 150);

    tempCtx.fillStyle = '#a0a5b5';
    tempCtx.font = '19px monospace';
    tempCtx.fillText(swatch.hex.toUpperCase(), x + 140, y + 90);
  });

  // Export URL download
  const imageURL = tempCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = imageURL;
  a.download = 'mixr-studio-palette.png';
  a.click();
});

// ==========================================
// Primary Canvas Animation / Simulation Loop
// ==========================================
function updateLoop() {
  // 1. Clear main palette canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Paint Blobs
  blobs.forEach(blob => blob.draw(ctx));

  // 3. Draw Slicing Laser Line (if knife active)
  if (currentTool === 'knife' && isSlicing) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sliceStart.x, sliceStart.y);
    ctx.lineTo(sliceCurrent.x, sliceCurrent.y);
    ctx.strokeStyle = '#ff0033'; // Vibrant neon red knife line
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 10;
    ctx.setLineDash([4, 2]);
    ctx.stroke();
    ctx.restore();
    
    // Draw knife handle/laser dot markers
    ctx.beginPath();
    ctx.arc(sliceStart.x, sliceStart.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0033';
    ctx.fill();
  }

  // 4. Update and Draw Particles
  particles.forEach((p, idx) => {
    p.update();
    p.draw(ctx);
    if (p.alpha <= 0) {
      particles.splice(idx, 1);
    }
  });

  // Re-run animation frame
  requestAnimationFrame(updateLoop);
}

// ==========================================
// Initialization Triggers
// ==========================================
initDefaultBlobs();
renderSwatchesHistory();
requestAnimationFrame(updateLoop);
