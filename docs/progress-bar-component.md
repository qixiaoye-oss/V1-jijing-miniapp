# Progress Bar Component Overview

This documentation describes a reusable progress bar component for WeChat Mini Programs (微信小程序).

## Version

**Current Version:** v1.0.0
**Release Date:** 2025-12-16

## Key Features

The component displays task advancement through three elements: a track, a filled portion, and percentage text. It accepts two properties:
- **current**: Present progress value (minimum 1)
- **total**: Maximum value (minimum 1)

## Implementation

The component uses CSS custom properties for theming. The default configuration applies a blue fill color (`rgba(0, 166, 237, 1)`) and gray background (`rgba(0, 0, 0, 0.3)`). The progress percentage is calculated as `(current / total) * 100`.

### File Structure

```
components/progress-bar/
├── progress-bar.js      # Component logic with observers
├── progress-bar.json    # Component configuration
├── progress-bar.wxml    # Component template
└── progress-bar.wxss    # Component styles with CSS variables
```

### Key Implementation Details

**JavaScript (progress-bar.js)**
- Uses `observers` to automatically recalculate percentage when `current` or `total` changes
- Includes boundary protection with `Math.max(1, value)` to prevent division by zero
- Smart text positioning with `calcTextMargin()` to prevent overflow at edges

**Styles (progress-bar.wxss)**
- Uses CSS variables for theme customization:
  - `--theme-color`: Progress fill color and text color
  - `--solid-border-color`: Track background color
- Style isolation set to `apply-shared` to inherit page-level CSS variables

## Integration Steps

To adopt this component in another project:

1. Copy the `components/progress-bar/` directory to your target project
2. Define CSS variables in `app.wxss` to match your theme:
   ```css
   page {
     --theme-color: rgba(0, 166, 237, 1);
     --solid-border-color: rgba(0, 0, 0, 0.3);
   }
   ```
3. Register the component in the page's `.json` file:
   ```json
   {
     "usingComponents": {
       "progress-bar": "/components/progress-bar/progress-bar"
     }
   }
   ```
4. Use the component with appropriate props in your template:
   ```xml
   <progress-bar current="{{currentIndex + 1}}" total="{{list.length}}" />
   ```

## Technical Notes

- The component employs style isolation (`apply-shared`), allowing it to inherit page-level CSS variables
- Built-in observers automatically update the display when properties change
- Boundary protection prevents calculation errors with invalid inputs
- Text margin calculation prevents overflow at 0% and 100% positions

## Usage Examples

### Basic Usage

```xml
<progress-bar current="{{3}}" total="{{10}}" />
```

### Dynamic Usage (Common Pattern)

```xml
<view class="progress_bar_base">
  <progress-bar current="{{wordCurrent + 1}}" total="{{list.length}}" />
</view>
```

## Applicable Pages

This component is used in the following pages:
- `/pages/dictation/spot_dictation/` - Fill-in-the-blank dictation
- `/pages/dictation/word_dictation/` - Word dictation
- `/pages/dictation/quick_answer/` - Quick answer mode
- `/pages/dictation/wrong_exam/` - Error review exam

## Changelog

### v1.0.0 (2025-12-16)
- Initial release
- Extracted from inline styles to reusable component
- Added CSS variable support for theming
- Added boundary protection for edge cases
- Smart text positioning to prevent overflow
