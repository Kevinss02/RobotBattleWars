# Robot Battle Wars API

## Overview

Welcome to the Robot Battles API! This API provides a platform to manage and organize epic robot battles. It is built with Node.js and Express, and it uses PostgreSQL as the database for storing information about robots, battles, and their outcomes.

## Features

- **Robot Management:** Register, update, and delete robot profiles.
- **Battle Organizer:** Schedule and manage thrilling robot battles.
- **Results Tracking:** Keep track of battle outcomes and robot statistics.
- **Secure Authentication:** User authentication and authorization ensure data integrity.

## Table of Contents

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
2. [Usage](#usage)
   - [Authentication](#authentication)
   - [Endpoints](#endpoints)
3. [Contributing](#contributing)
4. [License](#license)

## Getting Started

### Prerequisites

Ensure you have the following software installed on your machine:

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/robot-battle-wars-api.git
   ```

2. Install dependencies:

   ```bash
   cd robot-battle-wars-api
   pnpm install
   ```

3. Set up .env

4. Start the server

   ```bash
   pnpm start
   ```

## Usage

### Authentication

To access certain endpoints, you need to authenticate using an API key. Obtain an API key by registering on our platform.

Include the API key in the `Authorization` header of your requests:

```http
Authorization: Bearer your-api-key
```

## Contributing

We welcome contributions! Please follow our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code for your own projects.

---

Thank you for choosing the Robot Battles API! Let the battles begin! 🤖💥

[![Commitizen-friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
