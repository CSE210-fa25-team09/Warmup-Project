# Frontend / UI Design & Architecture

## Overview

The frontend for the **Emoji Translator** is a lightweight single-page web app built with **HTML**, **CSS**, and **JavaScript**.  
Its main responsibilities are:

- Accepting user input (text or phrases with Emoji)
- Invoking a translation for emoji
- Displaying translated results with capabilities to read/ copy the results
- Allowing users to select Emoji via emoji picker

The UI emphasizes **simplicity** and **clarity**

---

## Architecture & Design Decisions

### 1. Separation of Concerns

- **HTML** (`index.html`): defines structure and layout.
- **CSS** (`style.css`): manages styles, colors, and responsive layout.
- **JavaScript** (`script.js`): handles logic, events, and DOM updates.
- This ensures clean modularity and easy maintenance.

### 2. Vanilla JavaScript

- No external JS frameworks (e.g., React, Vue).
- Keeps dependencies minimal and reinforces understanding of core web APIs while maintaining es6 best practice
- Simplifies deployment since it runs entirely client-side.

### 3. Modular Structure

- JavaScript logic is broken into clear functional units:
  - Input handling
  - Translation fetching
  - DOM updates

### 4. Responsive & Accessible Design

- Layout adapts for desktop and mobile devices.
- Uses semantic HTML and ARIA labels for accessibility.

---

## Current Implementation

| File         | Role                  | Key Functions                                      |
| ------------ | --------------------- | -------------------------------------------------- |
| `index.html` | Defines DOM structure | Input box, translate button, output panel          |
| `style.css`  | Styles the layout     | Background, font, flexbox alignment, color scheme  |
| `script.js`  | Handles logic         | Reads user input, fetches translation, updates DOM |

---

## UI Flow

1. User enters text in the input box.
2. User clicks **Translate** (or presses Enter).
3. JavaScript validates input and shows a loading state.
4. Sends a `fetch()` request to `emoji-api.com`.
5. If request failed fallback to predefined emoji to text dictionary in `fallback.json`
6. Displays translated emoji text in the output panel.
