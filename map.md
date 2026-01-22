# PANaHON.js Map Implementation Documentation

## Table of Contents

1. [Precipitation Overlay Implementation](#precipitation-overlay-implementation)
2. [Map Initialization Process](#map-initialization-process)
3. [Settings & Configuration](#settings--configuration)
4. [Helper Functions & Utilities](#helper-functions--utilities)

---

## Precipitation Overlay Implementation

### 1.1 Layer Type Detection & Initialization

The precipitation overlay is implemented through a parameter-based layer type system. The system detects the layer type from URL parameters:

```javascript
listen: function (t) {
  var e = window.location.search;
  var r = new URLSearchParams(e);
  var o = r.get('parameter') || t;  // Gets 'prate' parameter from URL
  var s = r.get('id') || '1';
  var l = $('#modelSelect').val();
  // ...
}
```

**Key precipitation layer types:**

- `prate` - Real-time precipitation rate (hourly rainfall in mm)
- `prate_accum` - Accumulated precipitation over time
- Configured for 90-120 hour forecast windows

### 1.2 Colormap Generation for Precipitation

Precipitation-specific colormaps are created with gradient colors that represent rainfall intensity:

**For `prate` (Rain):**

```javascript
else if ('prate' == o) {
  S = 'Rain',
  b = a().generateGradientColormap(
    ['#007bbb', '#00008b', '#008b8b', '#006400', '#556b2f',
     '#8b8000', '#cc8400', '#b22222', '#8b0000', '#8b008b', '#8b006b'],
    14,
    [0.5, 30]  // Range: 0.5 to 30 mm (1h)
  ),
  T = 'mm (1h)';
  a().createGradientLegend(b, 'legend', T, 30, 300)
}
```

**For `prate_accum` (Rain Accumulation):**

- Range: [0, 300] mm
- Color scheme emphasizes higher accumulation values
- Unit: 'mm'

**Color Gradient Scheme:**
The gradient uses 11 color stops interpolated to create smooth transitions:

- Light blue (#007bbb) → Dark blue (#00008b) → Teal (#008b8b)
- Dark green (#006400) → Olive (#556b2f) → Dark khaki (#8b8000)
- Orange (#cc8400) → Red (#b22222) → Dark red (#8b0000)
- Dark magenta (#8b008b) → Dark magenta-red (#8b006b)

### 1.3 GeoJSON Styling for Precipitation

Overlay styling adapts based on layer type for better visibility:

```javascript
updateGeoJsonFillColor: function (t) {
  if (window.jsonmap) {
    var e = new s.ZP({
      stroke: new l.Z({
        color: t,  // White (#fff) for prate, dark (#181818) for others
        width: 0.8
      })
    });
    window.jsonmap.setStyle(e)
  }
},
```

**Background styling logic:**

```javascript
"prate" == t
  ? u.updateGeoJsonFillColor("#fff")
  : u.updateGeoJsonFillColor("#181818");
```

- **For precipitation (`prate`):** White (#fff) stroke for better contrast
- **For other layers:** Dark (#181818) stroke for contrast with visualization

### 1.4 Colormap Gradient Generation Function

The `generateGradientColormap()` function creates interpolated color-mapped ranges:

```javascript
generateGradientColormap: function (t) {
  var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3,
      i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [0, 1],
      o = t.map(n.hexToRgb),  // Convert hex colors to RGB
      a = [],
      s = (o.length - 1) * r,
      l = e(i, 2),
      u = l[0],  // Min value
      c = l[1];  // Max value

  // Interpolates between color stops across the value range
  for (var h = 0, p = 0; p < o.length - 1; p++) {
    for (var f = o[p], d = o[p + 1], g = 0; g < r; g++) {
      var m = g / r,
          y = n.interpolateColor(f, d, m),
          v = u + h / s * (c - u),
          _ = u + (h + 1) / s * (c - u);
      a.push([[v, _], y]);
      h++
    }
  }
  return a
}
```

**Parameters:**

- `t` - Array of hex color codes
- `r` - Interpolation steps between color stops (default: 3)
- `i` - Value range [min, max] (default: [0, 1])

**Returns:** Array of [[valueMin, valueMax], rgbColor] tuples

### 1.5 URL Encoding & COG Configuration

Precipitation data is transmitted via Cloud Optimized GeoTIFF (COG) URLs with encoded parameters:

```javascript
this.cogUrls = e.cogUrls,
this.colormap = encodeURIComponent(JSON.stringify(e.colormap)),
this.expression = encodeURIComponent(e.expression),
this.rescale = encodeURIComponent(e.rescale),
this.unit = e.unit,
```

**COG URL Construction Example:**

```
/api/v1/nwp-image?url=prate&token={csrf}&t={timestamp}&model={model}&init={initialization}
```

---

## Map Initialization Process

### 2.1 Main Map Class Constructor

The core WMS map initialization occurs in a class constructor that sets up the entire visualization:

```javascript
const x = function () {
  function t(e) {
    // Constructor called with configuration object
    this.cleanup();
    this.cogUrls = e.cogUrls;
    this.colormap = encodeURIComponent(JSON.stringify(e.colormap));
    this.expression = encodeURIComponent(e.expression);
    this.rescale = encodeURIComponent(e.rescale);
    this.unit = e.unit;
    this.channel = new BroadcastChannel("map_sync_channel");
    this.id = e.id;
    this.animationInterval = null;
    this.windType = e.windType;
    this.layerType = e.layerType;
    window.map = e.map; // Global map reference
    // ... rest of initialization
  }
};
```

### 2.2 Base Layer Configuration

The base map layer is created using OpenTopoMap/OpenStreetMap tiles:

```javascript
this.baseLayer = new i.Z({
  visible: !0,
  source: new o.Z({
    url: e.baseMapUrl, // 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    wrapX: !1,
    attributions: "Map data: © OpenTopoMap (CC-BY-SA)",
  }),
});
```

**Base Layer Properties:**

- Uses OpenStreetMap tile source format with {z}/{x}/{y} tile coordinates
- WrapX disabled to prevent cross-dateline wrapping
- Attribution properly credited to OpenTopoMap/OpenStreetMap

### 2.3 NWP Layer Plotting

Precipitation data is plotted using the `plot()` function with geographic bounds:

```javascript
var c = "/api/v1/nwp-image?url="
  .concat(this.layerType, "&token=")
  .concat(a, "&t=")
  .concat(n, "&model=")
  .concat(s, "&init=")
  .concat(l);

var h = {};
"atmo" == s
  ? ((h.leftBottom = [116.36436282608695, 4.18057258477824]),
    (h.rightTop = [127.47868072717367, 21.43894411105318]))
  : ((h.leftBottom = [99.95, -5.050000000000004]),
    (h.rightTop = [160.05, 40.05]));

u.push(c);
y.plot(u, "nwp", h, 1000); // Plot at 1000ms refresh rate
```

**Geographic Bounds by Model:**

| Model Type | Left/Bottom      | Right/Top         | Coverage                      |
| ---------- | ---------------- | ----------------- | ----------------------------- |
| ATMO       | 116.37°E, 4.18°N | 127.48°E, 21.44°N | Cebu/Visayas region           |
| Standard   | 99.95°E, -5.05°S | 160.05°E, 40.05°N | Philippines + extended region |

### 2.4 Layer Zoom-Based Visibility

Base layer visibility is controlled by zoom level to reduce visual clutter:

```javascript
window.map.getView().on("change:resolution", function () {
  window.map.getView().getZoom() <= 7
    ? r.baseLayer.setVisible(!1)
    : (window.map.getLayers().getArray().includes(r.baseLayer) ||
        window.map.getLayers().insertAt(0, r.baseLayer),
      r.baseLayer.setVisible(!0));
});
```

**Behavior:**

- **Zoom ≤ 7:** Base layer hidden (shows only precipitation data)
- **Zoom > 7:** Base layer visible (inserts at position 0 if not present)

### 2.5 Initialization Sequence

During map initialization, the following setup methods are called:

```javascript
(this.setupPopup(), // Initialize popup overlay
  this.createTimeSlider(this.cogUrls), // Setup time animation slider
  this.cogUrls[w].time
    ? ((window.windyEnabled = !0), this.setupWindy()) // Setup wind overlay if time data available
    : (window.windyEnabled = !1));
```

### 2.6 Popup Setup

The popup overlay is configured to display values on click:

```javascript
setupPopup: function () {
  var t = this,
  e = [39, 5];  // Offset adjustments

  'prate' == this.layerType &&
  (e = [52, 5]);  // Adjusted offset for precipitation

  var r = document.getElementById('flag-popup'),
  n = new s.Z({
    element: r,
    positioning: 'bottom-center',
    stopEvent: !1,
    offset: e,
    zIndex: 1000
  });

  n.id = 'flag-overlay';
  window.map.addOverlay(n);
  // ... click handler setup
}
```

### 2.7 Time Slider Creation

An ion-range-slider is created for temporal navigation:

```javascript
createTimeSlider: function (t) {
  var s = t.map(function (t) {
    return new Date(t.time).getTime()
  }),
  u = $('.slider .js-range-slider').ionRangeSlider({
    type: 'single',
    min: 0,
    max: s.length - 1,
    step: 1,
    hide_min_max: !0,
    grid: !0,
    grid_num: s.length - 1,
    force_edges: !0,
    from: w,
    onStart: function (e) {
      $('.slider .irs-grid-text').each(function (e, r) {
        t[e] &&
        $(r).text(n(t[e].time))
      })
    },
    prettify: function (e) {
      return t[e] ?
        new Date(t[e].time).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: !0
        }) : '';
    },
    onChange: function (e) {
      var r = e.from;
      window.visualization_time = t[r].time;
      w = r;
      // ... update layer
    }
  }).data('ionRangeSlider');
}
```

---

## Settings & Configuration

### 3.1 WMS Map Initialization Parameters

The WMS map is instantiated with comprehensive configuration:

```javascript
window.wms_map = new n.default({
  cogUrls: c, // Array of COG URLs with timestamps
  baseMapUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  map: window.map,
  colormap: b, // Generated gradient colormap
  expression: E, // MapBox expression for data visualization
  rescale: null, // Rescaling parameters
  centerLon: 125,
  centerLat: 13.5,
  zoom: 5,
  unit: T, // Unit string (e.g., 'mm (1h)')
  id: s, // Session ID
  windType: p, // Wind type: 'surface' or null
  layerType: o, // 'prate', 'wind', 'pres', etc.
  frameIndex: this.getNearestHourIndex(c), // Starting time frame
});
```

### 3.2 Model-Specific Geographic Bounds

Geographic bounds vary by model type:

```javascript
"atmo" == s
  ? ((h.leftBottom = [116.36436282608695, 4.18057258477824]),
    (h.rightTop = [127.47868072717367, 21.43894411105318]))
  : ((h.leftBottom = [99.95, -5.050000000000004]),
    (h.rightTop = [160.05, 40.05]));
```

### 3.3 COG URL Array Structure

Each COG URL object contains ISO 8601 formatted timestamps:

```javascript
c.push({
  time: ""
    .concat(x.getFullYear(), "-")
    .concat(w(x.getMonth() + 1), "-")
    .concat(w(x.getDate()), "T")
    .concat(w(x.getHours()), ":")
    .concat(w(x.getMinutes()), ":")
    .concat(w(x.getSeconds())),
});
```

**Format:** `YYYY-MM-DDTHH:MM:SS`

### 3.4 Time Window Configuration

Forecast window and stepping logic varies by layer type:

```javascript
var _ = "prate" === t ? 90 : 120; // 90 hours for prate, 120 for others

for (var g = 0; g <= _; g++) {
  // Generate hourly/adaptive step forecast times
  g += d >= 144 ? 6 : d >= 90 ? 3 : 1;
}
```

**Stepping Logic:**

- **0-90 hours:** 1-hour intervals
- **90-144 hours:** 3-hour intervals
- **144+ hours:** 6-hour intervals

### 3.5 Broadcast Channel Communication

Inter-window synchronization is enabled via BroadcastChannel API:

```javascript
this.channel = new BroadcastChannel("map_sync_channel");
```

**Synced Events:**

- `center` - Sends/receives map center changes
- `zoom` - Sends/receives zoom level changes
- `click` - Sends/receives map click coordinates

**Message Structure:**

```javascript
{
  id: t.id,           // Session ID
  type: 'center'|'zoom'|'click',
  center: [lon, lat],  // For center events
  zoom: 5,             // For zoom events
  coordinate: [x, y]   // For click events
}
```

### 3.6 Layer Lifecycle Management

The `removeLayers()` utility manages layer cleanup:

```javascript
removeLayers: function (t) {
  if (!document.hidden && 'undefined' !== window[t + '_timer']) {
    clearTimeout(window[t + '_timer']);
    delete window[t + '_timer'];
    delete window[t + '_image_static_objects'];

    var e = [];
    window.map.getLayers().forEach(
      function (r) {
        if (r && void 0 !== r.get('name') &&
            r.get('name').includes(t)) {
          e.push(r);
          console.log('removing ' + r.get('name'))
        }
      }
    );

    for (var r = e.length, n = 0; n < r; n++)
      map.removeLayer(e[n])
  }
}
```

### 3.7 Default Layer Initialization

The default precipitation layer is set based on URL parameters:

```javascript
!window.location.href.includes("/?trg=iframe&") ||
window.location.href.includes("parameter")
  ? u.init("prate") // Default to precipitation layer
  : ($(".slider").hide(),
    $(".search-container").attr("style", "display: none !important"));
```

### 3.8 Configuration Summary Table

| Configuration                  | Value              | Purpose                                          |
| ------------------------------ | ------------------ | ------------------------------------------------ |
| **Default Layer Type**         | `prate`            | Precipitation rate overlay                       |
| **Prate Time Window**          | 90 hours           | Forecast period for precipitation                |
| **Other Time Window**          | 120 hours          | Forecast period for other layers                 |
| **Prate Color Unit**           | `mm (1h)`          | Display unit for precipitation                   |
| **Prate Color Range**          | 0.5-30 mm          | Min-max values for color mapping                 |
| **Prate Accumulation Range**   | 0-300 mm           | Range for accumulated precipitation              |
| **Base Map URL**               | OSM tiles          | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` |
| **Center Longitude**           | 125°               | Default map center                               |
| **Center Latitude**            | 13.5°              | Default map center                               |
| **Default Zoom**               | 5                  | Initial zoom level                               |
| **Zoom Threshold (Hide Base)** | ≤ 7                | Zoom level to hide base map                      |
| **BroadcastChannel Name**      | `map_sync_channel` | Channel for inter-window communication           |
| **NWP Plot Refresh**           | 1000ms             | Refresh interval for NWP layer                   |
| **Popup Offset (prate)**       | [52, 5]            | Pixel offset for precipitation popup             |
| **Popup Offset (others)**      | [39, 5]            | Pixel offset for other layer popups              |
| **Popup Z-index**              | 1000               | Stack order for popup overlay                    |

---

## Helper Functions & Utilities

### Color Utility Functions

#### `hexToRgb(hexColor)`

Converts hexadecimal color codes to RGB format:

```javascript
hexToRgb: function (t) {
  // Converts '#007bbb' to [0, 123, 187]
}
```

#### `interpolateColor(colorA, colorB, factor)`

Linearly interpolates between two RGB colors:

```javascript
interpolateColor: function (f, d, m) {
  // m ranges from 0 to 1
  // Returns interpolated RGB color
}
```

### `createGradientLegend(colormap, elementId, unit, width, height)`

Creates a visual legend for the colormap in the DOM:

- `colormap` - Array of [[min, max], color] tuples
- `elementId` - Target DOM element ID
- `unit` - Unit label (e.g., 'mm (1h)')
- `width` - Legend width in pixels
- `height` - Legend height in pixels

### Array Utilities

#### `arrayMax(array)`

Returns the maximum value from an array.

### Map Plot Utilities

#### `plot(urlArray, layerId, bounds, refreshInterval)`

Plots NWP layer on the map:

- `urlArray` - Array of image URLs
- `layerId` - Layer identifier string (e.g., 'nwp')
- `bounds` - Object with `leftBottom` and `rightTop` coordinates
- `refreshInterval` - Refresh rate in milliseconds

#### `removeLayers(layerId)`

Removes all layers with a specific ID from the map and clears timers.

---

## API Endpoints

### NWP Image Endpoint

```
GET /api/v1/nwp-image?url={layerType}&token={csrf}&t={timestamp}&model={model}&init={initialization}
```

**Parameters:**

- `url` - Layer type (prate, wind, pres, etc.)
- `token` - CSRF token
- `t` - Timestamp (ISO 8601)
- `model` - Model name (atmo, standard, etc.)
- `init` - Model initialization time

### Tiles Endpoint

```
GET /api/v1/tiles?url={layerType}&token={csrf}&z={z}&x={x}&y={y}&t={timestamp}&model={model}&init={initialization}
```

Provides tiled map data for the specified layer and coordinates.

### Point Query Endpoint

```
GET /api/v1/tiles/point?url={layerType}&t={timestamp}&lon={longitude}&lat={latitude}&token={csrf}&model={model}&init={initialization}
```

Retrieves value at a specific geographic point.

### Wind Data Endpoint

```
GET /api/v1/wind/{timestamp}?token={csrf}&windType={windType}
```

Provides wind data for visualization with Windy.

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│     PANaHON.js Map System               │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  WMS Map Class (Constructor)            │
│  - Initializes base layer               │
│  - Sets up NWP overlay                  │
│  - Configures popups & slider           │
│  - Enables broadcast communication      │
└─────────────────────────────────────────┘
        ↓
┌──────────────────────┬──────────────────────┬──────────────┐
│  Base Layer          │  Precipitation       │  Wind Overlay│
│  (OpenStreetMap)     │  Overlay (COG)       │  (if enabled)│
│  - Zoom-controlled   │  - Colormap-styled   │  - Live data │
│  - Visible > Z7      │  - Time-animated     │  - Windy lib │
└──────────────────────┴──────────────────────┴──────────────┘
        ↓
┌─────────────────────────────────────────┐
│  User Interactions                      │
│  - Time Slider Navigation               │
│  - Click for Point Values               │
│  - Zoom Controls                        │
│  - Cross-window Sync                    │
└─────────────────────────────────────────┘
```
