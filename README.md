# Mixr: Subtractive Paint Mixing Studio

Mixr is a realistic, web-based paint mixing simulator that lets users blend colors by hand and see the resulting hex color code update instantly. Built for designers, artists, and hobbyists, it provides a tactile and professional environment for exploring color palettes.

## 🎨 Key Features

- **Realistic Subtractive Mixing**: Uses a physical absorbance math engine (Lambert-Beer law) for authentic results (e.g., Yellow + Blue = Green).
- **Tactile 3D Paint Dollops**: Features specular gloss highlights, volumetric edges, and drop shadows for a "wet paint" look.
- **Interactive Tools**:
  - **Spatula**: Drag and merge dollops to mix pigments.
  - **Stir Knife**: Blend marbled dollops into a homogeneous color.
  - **Slice Knife**: Cut paint dollops into smaller droplets.
- **Progressive Mobile Responsiveness**: Optimized for all screens, from 1550px desktop down to 375px mobile phones, with a dedicated mobile quick-tools bar and sidebar drawer.
- **Premium Features**:
  - **Color History**: Save mixed swatches to a local palette collection.
  - **CSS Export**: Download your palette as a reusable CSS stylesheet.
  - **PNG Download**: Export a high-resolution palette board for artists.
- **Customizable Themes**: Choose between *Classic Wood*, *Glossy Ceramic*, and *Sleek Slate* boards.

## 🚀 Deployment

The project is deployed to GitHub Pages and can be accessed at:
[https://donkade.github.io/Mixr/](https://donkade.github.io/Mixr/)

## 🛠️ Technical Stack

- **Frontend**: Vite + React
- **Canvas API**: For high-performance paint rendering and interaction.
- **CSS**: Custom responsive system with multiple breakpoints.
- **CI/CD**: GitHub Actions for automated deployment.

## 📂 Project Structure

- `src/main.js`: Core simulation and interaction engine.
- `src/style.css`: Visual styling and responsive layouts.
- `index.html`: Main application entry point.
- `vite.config.js`: Build and deployment configuration.
