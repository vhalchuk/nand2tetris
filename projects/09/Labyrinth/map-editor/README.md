# Map Editor for Labyrinth Game

## Overview

The Map Editor is a utility for creating custom maps for the Labyrinth game. It generates a set of Jack commands that can be directly integrated into the `Map.fill()` method in the game's source code.

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [Requirements](#requirements)

## Usage

1. Open the `input.txt` file. The map is represented as a 32x16 character grid.
    - "#" represents a solid block.
    - "." represents an open space.

2. Edit the map as per your requirements.

3. Run the following command to generate Jack instructions:

    ```bash
    node index.js
    ```

4. An `output.txt` file will be generated with the set of Jack commands.
5. Copy and paste these commands into the `Map.fill()` method within the game source code.

## Requirements

- Node v16 or higher
