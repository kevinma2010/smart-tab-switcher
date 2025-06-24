# Keyboard Shortcuts Implementation

## Overview

This document outlines the implementation of keyboard shortcut customization for Smart Tab Switcher using the browser's built-in extension shortcuts settings.

## Problem Statement

- Mac browsers restrict access to Command key combinations in extension popups
- Custom key capture implementations are complex and have security limitations
- Users need a reliable way to customize shortcuts that works across all platforms

## Solution Approach

We implement a simplified solution that directs all users to use the browser's built-in keyboard shortcuts settings:

1. **Universal Approach**: All users (Mac, Windows, Linux) are guided to use browser settings
2. **Cross-Browser Support**: Works with Chrome, Firefox, and Edge
3. **Maximum Compatibility**: Supports all key combinations including Command keys on Mac
4. **Zero Maintenance**: No custom key capture logic or platform-specific code needed

## Implementation Details

### 1. Settings UI

The settings page provides:
- Clear explanation of how to customize shortcuts
- Browser-specific step-by-step instructions
- Direct button to open appropriate shortcuts page:
  - Chrome: `chrome://extensions/shortcuts`
  - Firefox: `about:addons` (then Manage Extension Shortcuts)
  - Edge: `edge://extensions/shortcuts`
- Display of current default shortcut based on platform

### 2. User Experience Flow

1. User navigates to Settings → Keyboard Shortcut
2. Reads the explanation and browser-specific instructions
3. Clicks "Open [Browser] Shortcuts Settings" button
4. Browser opens the appropriate shortcuts management page
5. User follows browser-specific steps to find and modify shortcuts
6. User sets their preferred shortcut using the browser's interface
7. Shortcut is immediately active

### 3. Browser and Platform Detection

- **Browser Detection**: Automatically detects Chrome, Firefox, or Edge
- **Platform Detection**: Detects Mac vs Windows/Linux for showing appropriate default shortcut
- **Adaptive Instructions**: Shows browser-specific steps (Firefox has different navigation)
- **Default Shortcuts**:
  - Mac: Shows "Cmd+Shift+K" as current default
  - Others: Shows "Alt+T" as current default

### 4. Benefits

1. **Universal Compatibility**: Works with all key combinations on all platforms
2. **No Browser Restrictions**: Command keys work perfectly on Mac
3. **Zero Bugs**: Uses browser's native, tested implementation
4. **Future-Proof**: No maintenance needed for browser updates
5. **Better UX**: Users get familiar browser UI for setting shortcuts

## Technical Implementation

### Settings Component
- Simple UI with adaptive instructions and button
- Browser detection for appropriate URLs and steps
- Platform detection for showing correct default
- Direct link to browser-specific shortcuts page

### No Custom Storage
- No need to store custom shortcut preferences
- Browser handles all shortcut management
- Manifest defaults remain as fallbacks

### No Background Script Changes
- No listening for shortcut changes needed
- No dynamic shortcut updates required
- Simpler, more reliable implementation

## User Interface Design

The settings section includes:
- Icon and clear heading
- Explanatory text about using browser settings
- Numbered step-by-step instructions
- Prominent button to open shortcuts page
- Display of current default shortcut

This approach provides the best user experience while avoiding all the complexity and limitations of custom key capture implementations.