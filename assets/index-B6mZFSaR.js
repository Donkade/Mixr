(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=(e,t,n)=>Math.max(t,Math.min(n,e));function t(t,n,r){let i=e(t,12,255)/255,a=e(n,12,255)/255,o=e(r,12,255)/255;return{r:-Math.log(i),g:-Math.log(a),b:-Math.log(o)}}function n(t){let n=Math.round(255*Math.exp(-t.r)),r=Math.round(255*Math.exp(-t.g)),i=Math.round(255*Math.exp(-t.b));return{r:e(n,0,255),g:e(r,0,255),b:e(i,0,255)}}function r(e,t,n){let r=e=>{let t=e.toString(16);return t.length===1?`0`+t:t};return`#${r(e)}${r(t)}${r(n)}`}function i(e){let t=e.replace(`#`,``);return{r:parseInt(t.substring(0,2),16),g:parseInt(t.substring(2,4),16),b:parseInt(t.substring(4,6),16)}}var a=[{name:`Cadmium Red`,hex:`#e61e28`,r:230,g:30,b:40},{name:`Cadmium Yellow`,hex:`#ffdc00`,r:255,g:220,b:0},{name:`Ultramarine Blue`,hex:`#0050c8`,r:0,g:80,b:200},{name:`Phthalo Green`,hex:`#00aa50`,r:0,g:170,b:80},{name:`Cadmium Orange`,hex:`#ff6e00`,r:255,g:110,b:0},{name:`Dioxazine Violet`,hex:`#7800b4`,r:120,g:0,b:180},{name:`Cerulean Blue`,hex:`#00c8ff`,r:0,g:200,b:255},{name:`Quinacridone Magenta`,hex:`#ff00a0`,r:255,g:0,b:160},{name:`Titanium White`,hex:`#ffffff`,r:255,g:255,b:255},{name:`Carbon Black`,hex:`#141414`,r:20,g:20,b:20},{name:`Burnt Sienna`,hex:`#8b4513`,r:139,g:69,b:19},{name:`Teal Blue`,hex:`#008080`,r:0,g:128,b:128},{name:`Lavender Tint`,hex:`#e6e6fa`,r:230,g:230,b:250},{name:`Blush Pink`,hex:`#ffb6c1`,r:255,g:182,b:193},{name:`Olive Green`,hex:`#808000`,r:128,g:128,b:0}];function o(e,t,n){let r=a[0],i=1/0;for(let o of a){let a=Math.sqrt((e-o.r)**2+(t-o.g)**2+(n-o.b)**2);a<i&&(i=a,r=o)}if(i<15)return r.name;if(i<60)return r.name===`Titanium White`?`Pale Pastel Mix`:r.name===`Carbon Black`?`Deep Dark Shade`:`${r.name} Tone`;{let i=(e*299+t*587+n*114)/1e3;return i>220?`Bright Tint Mix`:i<45?`Rich Dark Shadow`:`${r.name} Custom Blend`}}var s=[{name:`Red`,color:`#e61e28`},{name:`Yellow`,color:`#ffdc00`},{name:`Blue`,color:`#0050c8`},{name:`Orange`,color:`#ff6e00`},{name:`Green`,color:`#00aa50`},{name:`Purple`,color:`#7800b4`},{name:`Magenta`,color:`#ff00a0`},{name:`Cyan`,color:`#00c8ff`},{name:`White`,color:`#ffffff`},{name:`Black`,color:`#141414`}],c=`#0050c8`,l=`spatula`,u=`wood`,d=[],f=JSON.parse(localStorage.getItem(`mixr-swatches`)||`[]`),p=null,m=null,h={x:0,y:0},g=!1,_={x:0,y:0},v={x:0,y:0},y=document.querySelector(`#app`);y.innerHTML=`
  <div class="studio-container">
    <!-- Header Area -->
    <header class="studio-header">
      <div class="header-logo">
        <span class="logo-icon">🎨</span>
        <h1>Mixr</h1>
        <span class="logo-sub">Paint Studio</span>
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
      <aside class="control-panel">
        <!-- Paint Tubes -->
        <section class="panel-section">
          <h2>Paint Palette Tubes</h2>
          <div class="paint-tubes-grid">
            ${s.map(e=>`
              <button 
                class="paint-tube-btn ${e.color===c?`active`:``}" 
                data-color="${e.color}"
                style="--tube-color: ${e.color}"
                title="${e.name} Paint"
              >
                <div class="tube-cap"></div>
                <div class="tube-body">
                  <span class="tube-label">${e.name}</span>
                </div>
              </button>
            `).join(``)}
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
`;var b=document.getElementById(`palette-canvas`),x=b.getContext(`2d`),S=document.getElementById(`board-frame`),C=document.getElementById(`active-swatch`),w=document.getElementById(`color-name`),T=document.getElementById(`color-hex`),E=document.getElementById(`btn-copy-hex`),D=document.getElementById(`btn-save-swatch`),O=document.getElementById(`btn-clear-palette`),k=document.getElementById(`swatches-grid`),A=document.getElementById(`custom-picker`),j={spatula:`💡 Click blank space to add paint dollops. Drag dollops together to merge & subtractively blend them!`,stir:`🔄 Rub/Stir marbled paint dollops with the cursor to blend their pigments into a smooth homogeneous color!`,knife:`🔪 Click and drag a slicing line straight through a paint dollop to slice it cleanly in half!`};function M(e,t,n){let i=r(e,t,n);C.style.backgroundColor=i,T.textContent=i,w.textContent=o(e,t,n)}document.querySelectorAll(`.paint-tube-btn`).forEach(e=>{e.addEventListener(`click`,e=>{document.querySelectorAll(`.paint-tube-btn`).forEach(e=>e.classList.remove(`active`));let t=e.currentTarget;t.classList.add(`active`),c=t.dataset.color;let n=i(c);M(n.r,n.g,n.b)})}),A.addEventListener(`input`,e=>{document.querySelectorAll(`.paint-tube-btn`).forEach(e=>e.classList.remove(`active`)),c=e.target.value;let t=i(c);M(t.r,t.g,t.b)});function N(e){l=e,document.querySelectorAll(`.tool-btn`).forEach(e=>e.classList.remove(`active`)),document.getElementById(`tool-${e}`).classList.add(`active`),document.getElementById(`instruction-text`).textContent=j[e],b.style.cursor=e===`spatula`?`cell`:e===`stir`?`w-resize`:`crosshair`}document.getElementById(`tool-spatula`).addEventListener(`click`,()=>N(`spatula`)),document.getElementById(`tool-stir`).addEventListener(`click`,()=>N(`stir`)),document.getElementById(`tool-knife`).addEventListener(`click`,()=>N(`knife`)),document.querySelectorAll(`.theme-btn`).forEach(e=>{e.addEventListener(`click`,e=>{document.querySelectorAll(`.theme-btn`).forEach(e=>e.classList.remove(`active`)),e.target.classList.add(`active`),u=e.target.dataset.theme,S.className=`board-frame theme-${u}`})});var P=class{constructor(e,n,r,i=1){this.id=Math.random().toString(36).substr(2,9),this.x=e,this.y=n,this.volume=i,this.radius=this.calculateRadius(),this.absorbance=t(r.r,r.g,r.b),this.homogeneity=1,this.color1=null,this.color2=null,this.marbleSeed=Math.random(),this.marbleCurves=this.generateMarbleSwirls(),this.isDragging=!1,this.updateColor()}calculateRadius(){return 24*Math.sqrt(this.volume)}updateColor(){let e=n(this.absorbance);this.color=r(e.r,e.g,e.b),this.rgb=e}generateMarbleSwirls(){let e=[],t=5+Math.floor(Math.random()*5);for(let n=0;n<t;n++)e.push({cp1x:(Math.random()-.5)*1.5,cp1y:(Math.random()-.5)*1.5,cp2x:(Math.random()-.5)*1.5,cp2y:(Math.random()-.5)*1.5,x:(Math.random()-.5)*1.6,y:(Math.random()-.5)*1.6,width:2+Math.random()*6});return e}setMarbled(e,t){this.homogeneity=0,this.color1=e,this.color2=t,this.marbleCurves=this.generateMarbleSwirls()}stir(t=.02){this.homogeneity<1&&(this.homogeneity=e(this.homogeneity+t,0,1))}draw(e){e.save(),e.shadowColor=`rgba(0, 0, 0, 0.35)`,e.shadowBlur=10,e.shadowOffsetX=3,e.shadowOffsetY=6,e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.fillStyle=`rgba(0,0,0,0.02)`,e.fill(),e.restore(),e.save(),e.beginPath(),e.arc(this.x+1.5,this.y+1.5,this.radius,0,Math.PI*2),e.strokeStyle=`rgba(0, 0, 0, 0.2)`,e.lineWidth=3,e.stroke(),e.restore(),e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.clip(),this.homogeneity<1&&this.color1&&this.color2?(e.fillStyle=this.color1,e.fill(),e.strokeStyle=this.color2,e.lineCap=`round`,this.marbleCurves.forEach(t=>{e.beginPath(),e.lineWidth=t.width*(1-this.homogeneity)*(this.radius/24);let n=this.x-this.radius*.8,r=this.y-this.radius*.8;e.moveTo(n,r),e.bezierCurveTo(this.x+t.cp1x*this.radius,this.y+t.cp1y*this.radius,this.x+t.cp2x*this.radius,this.y+t.cp2y*this.radius,this.x+t.x*this.radius,this.y+t.y*this.radius),e.globalAlpha=1-this.homogeneity,e.stroke()}),e.globalAlpha=1,e.fillStyle=this.color,e.globalAlpha=this.homogeneity,e.fill(),e.globalAlpha=1):(e.fillStyle=this.color,e.fill()),e.restore();let t=e.createRadialGradient(this.x-this.radius*.35,this.y-this.radius*.35,0,this.x,this.y,this.radius);t.addColorStop(0,`rgba(255, 255, 255, 0.55)`),t.addColorStop(.15,`rgba(255, 255, 255, 0.25)`),t.addColorStop(.55,`rgba(255, 255, 255, 0.02)`),t.addColorStop(.9,`rgba(0, 0, 0, 0.05)`),t.addColorStop(1,`rgba(0, 0, 0, 0.25)`),e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.fillStyle=t,e.fill(),e.restore(),m===this&&(e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius+3,0,Math.PI*2),e.strokeStyle=`rgba(170, 59, 255, 0.7)`,e.lineWidth=2.5,e.setLineDash([5,3]),e.stroke(),e.restore())}isPointInside(e,t){return Math.sqrt((e-this.x)**2+(t-this.y)**2)<=this.radius}};function F(){d=[new P(250,200,i(`#ffdc00`),1.2),new P(450,200,i(`#0050c8`),1.2),new P(350,360,i(`#e61e28`),1)],m=d[0];let e=d[0].rgb;M(e.r,e.g,e.b)}function I(){if(l===`spatula`)for(let t=0;t<d.length;t++){let n=d[t];for(let r=t+1;r<d.length;r++){let t=d[r],i=t.x-n.x,a=t.y-n.y;if(Math.sqrt(i*i+a*a)<(n.radius+t.radius)*.85){let i=n.volume+t.volume,a=n.color,o=t.color,s={r:(n.absorbance.r*n.volume+t.absorbance.r*t.volume)/i,g:(n.absorbance.g*n.volume+t.absorbance.g*t.volume)/i,b:(n.absorbance.b*n.volume+t.absorbance.b*t.volume)/i},c=(n.x*n.volume+t.x*t.volume)/i,l=(n.y*n.volume+t.y*t.volume)/i;n.absorbance=s,n.volume=i,n.radius=n.calculateRadius(),n.x=e(c,n.radius,b.width-n.radius),n.y=e(l,n.radius,b.height-n.radius),n.updateColor(),a!==o&&n.setMarbled(a,o),(t.isDragging||p===t)&&(n.isDragging=!0,p=n),m=n;let u=n.rgb;M(u.r,u.g,u.b),z(n.x,n.y,n.color),d.splice(r,1),r--;break}}}}var L=[],R=class{constructor(e,t,n){this.x=e,this.y=t,this.color=n,this.radius=2+Math.random()*4;let r=Math.random()*Math.PI*2,i=1+Math.random()*4;this.vx=Math.cos(r)*i,this.vy=Math.sin(r)*i,this.alpha=1,this.decay=.03+Math.random()*.04}update(){this.x+=this.vx,this.y+=this.vy,this.vy+=.1,this.alpha-=this.decay}draw(e){e.save(),e.beginPath(),e.arc(this.x,this.y,this.radius,0,Math.PI*2),e.fillStyle=this.color,e.globalAlpha=this.alpha,e.fill(),e.restore()}};function z(e,t,n){for(let r=0;r<12;r++)L.push(new R(e,t,n))}function B(e,t){l===`stir`&&d.forEach(n=>{n.isPointInside(e,t)&&n.homogeneity<1&&(n.stir(.015),n.homogeneity>=1&&z(n.x,n.y,n.color))})}function V(t,n){let r=(e,t,n,r,i,a)=>{let o=e-n,s=t-r,c=i-n,l=a-r,u=o*c+s*l,d=c*c+l*l,f=-1;d!==0&&(f=u/d);let p,m;f<0?(p=n,m=r):f>1?(p=i,m=a):(p=n+f*c,m=r+f*l);let h=e-p,g=t-m;return Math.sqrt(h*h+g*g)},i=[],a=[];if(d.forEach(o=>{if(r(o.x,o.y,t.x,t.y,n.x,n.y)<o.radius*.9&&o.volume>=.25){a.push(o);let r=n.x-t.x,s=n.y-t.y,c=Math.sqrt(r*r+s*s),l=-s/c,u=r/c,d=o.volume/2,f=o.radius*.65,p=e(o.x+l*f,25,b.width-25),m=e(o.y+u*f,25,b.height-25),h=e(o.x-l*f,25,b.width-25),g=e(o.y-u*f,25,b.height-25),_=new P(p,m,o.rgb,d),v=new P(h,g,o.rgb,d);o.homogeneity<1&&(_.setMarbled(o.color1,o.color2),_.homogeneity=o.homogeneity,v.setMarbled(o.color1,o.color2),v.homogeneity=o.homogeneity),i.push(_,v),z(o.x,o.y,o.color)}}),a.length>0&&(d=d.filter(e=>!a.includes(e)),d.push(...i),m=d[d.length-1]||null,m)){let e=m.rgb;M(e.r,e.g,e.b)}}function H(e){let t=b.getBoundingClientRect(),n=e.touches?e.touches[0].clientX:e.clientX,r=e.touches?e.touches[0].clientY:e.clientY;return{x:n-t.left,y:r-t.top}}function U(t,n){if(l===`spatula`)if(p=d.find(e=>e.isPointInside(t.x,t.y)),p){p.isDragging=!0,m=p,h.x=t.x-p.x,h.y=t.y-p.y;let e=p.rgb;M(e.r,e.g,e.b)}else{let n=i(c),r=new P(t.x,t.y,n,1);r.x=e(r.x,r.radius,b.width-r.radius),r.y=e(r.y,r.radius,b.height-r.radius),d.push(r),m=r,z(r.x,r.y,c),M(n.r,n.g,n.b)}else l===`stir`?B(t.x,t.y):l===`knife`&&(g=!0,_={...t},v={...t})}function W(t,n){if(l===`spatula`&&p&&p.isDragging){let n=t.x-h.x,r=t.y-h.y;p.x=e(n,p.radius,b.width-p.radius),p.y=e(r,p.radius,b.height-p.radius),I()}else l===`stir`?B(t.x,t.y):l===`knife`&&g&&(v={...t})}function G(e){p&&=(p.isDragging=!1,null),l===`knife`&&g&&(g=!1,V(_,v))}b.addEventListener(`mousedown`,e=>{U(H(e),e)}),b.addEventListener(`mousemove`,e=>{W(H(e),e)}),window.addEventListener(`mouseup`,G),b.addEventListener(`touchstart`,e=>{e.preventDefault(),U(H(e),e)}),b.addEventListener(`touchmove`,e=>{e.preventDefault(),W(H(e),e)}),window.addEventListener(`touchend`,G),O.addEventListener(`click`,()=>{d.forEach(e=>z(e.x,e.y,e.color)),d=[],m=null;let e=i(c);M(e.r,e.g,e.b)}),E.addEventListener(`click`,()=>{let e=T.textContent;navigator.clipboard.writeText(e).then(()=>{E.textContent=`✅`,setTimeout(()=>{E.textContent=`📋`},1500)})});function K(){if(f.length===0){k.innerHTML=`
      <div class="empty-swatches">No saved swatches yet. Mix paint and click "Save Swatch" to start your palette collection!</div>
    `;return}k.innerHTML=f.map((e,t)=>`
    <div class="swatch-card" style="--swatch-color: ${e.hex}">
      <div class="swatch-paint-dollop"></div>
      <div class="swatch-card-details">
        <div class="swatch-card-name" title="${e.name}">${e.name}</div>
        <div class="swatch-card-hex"><code>${e.hex}</code></div>
      </div>
      <button class="btn-card-copy" data-hex="${e.hex}" title="Copy Hex">📋</button>
      <button class="btn-card-delete" data-idx="${t}" title="Delete Swatch">❌</button>
    </div>
  `).join(``),document.querySelectorAll(`.btn-card-copy`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.dataset.hex;navigator.clipboard.writeText(t).then(()=>{e.target.textContent=`✅`,setTimeout(()=>{e.target.textContent=`📋`},1500)})})}),document.querySelectorAll(`.btn-card-delete`).forEach(e=>{e.addEventListener(`click`,e=>{let t=parseInt(e.target.dataset.idx);f.splice(t,1),localStorage.setItem(`mixr-swatches`,JSON.stringify(f)),K()})})}D.addEventListener(`click`,()=>{let e=T.textContent,t=w.textContent;if(f.some(t=>t.hex.toLowerCase()===e.toLowerCase())){alert(`This swatch is already saved in your history!`);return}f.unshift({name:t,hex:e}),localStorage.setItem(`mixr-swatches`,JSON.stringify(f)),K()}),document.getElementById(`btn-export-css`).addEventListener(`click`,()=>{if(f.length===0){alert(`Save some swatches first to export your palette css!`);return}let e=`/* Mixr Color Palette Export */
:root {
`;f.forEach((t,n)=>{let r=`--color-${t.name.toLowerCase().replace(/[^a-z0-9]/g,`-`)}-${n+1}`;e+=`  ${r}: ${t.hex};\n`}),e+=`}`;let t=new Blob([e],{type:`text/css`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`mixr-palette.css`,r.click(),URL.revokeObjectURL(n)}),document.getElementById(`btn-export-png`).addEventListener(`click`,()=>{if(f.length===0){alert(`Please save some swatches first to generate your downloadable PNG color board!`);return}let e=document.createElement(`canvas`),t=e.getContext(`2d`);e.width=1200,e.height=800,t.fillStyle=`#1e1e24`,t.fillRect(0,0,e.width,e.height),t.fillStyle=`#ffffff`,t.font=`bold 44px sans-serif`,t.fillText(`Mixr Palette Board`,80,100),t.fillStyle=`#8a8d9a`,t.font=`22px sans-serif`,t.fillText(`Subtractive Hand-mixed Color Studio Collection`,80,140),f.slice(0,9).forEach((e,n)=>{let r=n%3,i=Math.floor(n/3),a=80+r*350,o=200+i*170;t.fillStyle=`#2d2d38`,t.beginPath(),t.roundRect?t.roundRect(a,o,320,140,12):t.rect(a,o,320,140),t.fill(),t.fillStyle=e.hex,t.beginPath(),t.roundRect?t.roundRect(a+15,o+15,110,110,8):t.rect(a+15,o+15,110,110),t.fill(),t.fillStyle=`#ffffff`,t.font=`bold 22px sans-serif`,t.fillText(e.name,a+140,o+55,170),t.fillStyle=`#a0a5b5`,t.font=`19px monospace`,t.fillText(e.hex.toUpperCase(),a+140,o+90)});let n=e.toDataURL(`image/png`),r=document.createElement(`a`);r.href=n,r.download=`mixr-studio-palette.png`,r.click()});function q(){x.clearRect(0,0,b.width,b.height),d.forEach(e=>e.draw(x)),l===`knife`&&g&&(x.save(),x.beginPath(),x.moveTo(_.x,_.y),x.lineTo(v.x,v.y),x.strokeStyle=`#ff0033`,x.lineWidth=3.5,x.shadowColor=`#ff0033`,x.shadowBlur=10,x.setLineDash([4,2]),x.stroke(),x.restore(),x.beginPath(),x.arc(_.x,_.y,5,0,Math.PI*2),x.fillStyle=`#ff0033`,x.fill()),L.forEach((e,t)=>{e.update(),e.draw(x),e.alpha<=0&&L.splice(t,1)}),requestAnimationFrame(q)}F(),K(),requestAnimationFrame(q);