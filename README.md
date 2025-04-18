# Jack in the Box Hierarchy Service

This project implements a service to manage a hierarchy of franchises, regions, and stores for Jack in the Box franchises. It provides functionality to:

- Create a new hierarchy
- Add nodes to the hierarchy (e.g., franchise, region, store)
- List all stores under a specific node in the hierarchy
- Handle errors for invalid operations

## Features

- Create and manage a hierarchical structure of `Franchise > Region > Store`.
- In-memory storage for the hierarchy structure.
- REST-like API for interacting with the hierarchy (though the current implementation is just a service).
- Test-driven development (TDD) with Jest.
