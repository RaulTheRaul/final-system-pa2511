# ChildCare Platform Local Development Guide

This project is built with React + Vite + Tailwind CSS and has been containerised with docker for consistent development.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac)
- [Docker Engine](https://docs.docker.com/engine/install/) (Linux)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/wsu-comp3018/final-system-pa2511.git
cd final-system-pa2511
```

2. Start the development container
```bash
docker-compose up --build
```

3. Access the application
- Open [http://localhost:5173](http://localhost:5173) in your browser
- You should see the React application running with Tailwind styles

## Useful Docker Commands

```bash
#Stop the container
docker-compose down

#View logs
docker-compose logs

#Rebuild container (after dependency changes)
docker-compose up --build

#Install new packages
docker-compose exec web npm install <package-name>
```

## Project Structure

```
final-system-pa2511/
├── src/               # Source files
├── public/           # Static files
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── ...
```

## Technology Stack

- React 19
- Vite 6
- Tailwind CSS 4
- Docker
- ESLint

## Contributing

1. Make sure Docker is running
2. Follow the Getting Started steps
3. Make your changes
4. Changes will automatically reflect in the browser

## Troubleshooting

If you encounter issues:

1. Make sure Docker is running
2. Try rebuilding the container:
   ```bash
   docker-compose down
   docker-compose up --build
   ```
3. Check the logs:
   ```bash
   docker-compose logs
   ```

## License

[MIT License]
