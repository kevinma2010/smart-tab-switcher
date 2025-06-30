# Tab Key Interaction Review and Proposed Design

This document outlines the analysis of the current Tab key behavior, proposes a new functional design for intuitive navigation, and provides a technical implementation plan.

## 1. Review Conclusion

### Summary of the Issue
The `Tab` key does not currently function as a navigation control within the search results list. Instead, it follows the default browser behavior, which cycles focus between the main UI elements (Search Box, About button, Settings button). This behavior is unintuitive for users who expect `Tab` and `Shift+Tab` to navigate up and down the list, similar to arrow keys.

### Root Cause
The lack of specific event handlers for the `Tab` key is the root cause of this issue:
- **`src/popup/hooks/use-keyboard.tsx`**: The core keyboard handling hook does not include logic to manage `Tab` key presses for list navigation.
- **`src/popup/components/search-box.tsx`**: The search input component, which captures keyboard events, does not prevent the `Tab` key's default behavior of changing focus.

This constitutes a usability flaw that should be addressed to improve keyboard accessibility and provide a more conventional user experience.

## 2. Functional Design

To create a more intuitive and accessible navigation experience, the `Tab` key's functionality should be aligned with standard list navigation patterns.

### Proposed Behavior
- **`Tab` Key**: Pressing the `Tab` key will move the selection down one item in the search results list. If the last item is selected, it will loop back to the first item.
- **`Shift + Tab`**: Pressing the `Shift + Tab` key combination will move the selection up one item in the search results list. If the first item is selected, it will loop back to the last item.

This design makes the `Tab` key's behavior identical to the `ArrowDown` key and `Shift+Tab` identical to the `ArrowUp` key, providing users with a consistent and familiar navigation method.

## 3. Technical Design

The implementation will require modifications to three key files to introduce the new behavior and override the browser's default action.

### Implementation Steps

1.  **Update `src/popup/hooks/use-keyboard.tsx`**:
    -   Introduce a new callback function, `handleTab(isShifted: boolean)`.
    -   This function will call `handleArrowDown()` if `isShifted` is `false`, and `handleArrowUp()` if `isShifted` is `true`.
    -   Export `handleTab` from the hook's return object.

2.  **Update `src/popup/components/search-box.tsx`**:
    -   Add a new prop `onTab: (isShifted: boolean) => void;` to the `SearchBoxProps` interface.
    -   In the `handleKeyDown` event handler, add a `case` for the `Tab` key.
    -   Inside this `case`, call `e.preventDefault()` to stop the default focus-switching behavior.
    -   Invoke the new `onTab` prop, passing `e.shiftKey` as its argument.

3.  **Update `src/popup/components/search-view.tsx`**:
    -   Retrieve the `handleTab` function from the `useKeyboard` hook.
    -   Pass this function down to the `SearchBox` component via the new `onTab` prop.
