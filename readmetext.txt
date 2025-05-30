# Centre Connect Testing and Deploying Guide

This project is built with React + Vite + Tailwind CSS and has been containerised with docker for consistent development.

##NOTE
As of the 29/05/2025 The website is currently up and running with the exact code found here in this project, it can be accessed via the following link: (https://wsu-px.web.app/)

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac)
- [Docker Engine](https://docs.docker.com/engine/install/) (Windows/Mac)
- [Node.js](https://nodejs.org/en)(Windows/Mac)

## Getting Started (viewing the code locally)

1. Clone the repository
```bash
git clone https://github.com/wsu-comp3018/final-system-pa2511.git
cd final-system-pa2511
```
Since this project has been developed using a docker container, downloading docker desktop from the following link is advised: https://www.docker.com/

2. Start the development container
```bash
docker-compose up --build
```

3. Access the application
- Open [http://localhost:5173](http://localhost:5173) in your browser
- You should see the React application running with Tailwind styles

4. if restarting the container you can use just the up command
```bash
docker-compose up
```
## Useful Docker Commands

```bash
#Stop the container
docker-compose down

#Stop the container & delete all modules
#useful when someone else has installed new modules and your container does not have them yet
docker-compose down -v

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
├── functions/               # Firebase Cloud Functions
├── src/               # Source files
├── public/           # Static files
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── ...
```

## Firebase Cloud Functions: Updating & Deployment Guide

If you’ve just cloned this repository and want to **update or deploy Firebase Cloud Functions**, follow the steps below:

### 1. Install Firebase CLI

Make sure you have [Node.js](https://nodejs.org/) installed, then install the Firebase CLI globally:

```bash
npm install -g firebase-tools
```
Also before anything else ensure to install all the current dependencies:

---

### 2. Clone the Repository

```bash
git clone https://github.com/wsu-comp3018/final-system-pa2511.git
cd final-system-pa2511
```

---

### 3. Install Function Dependencies

Navigate into the `functions/` directory and install the required Node modules:

```bash
cd functions
npm install
cd ..
```

---

### 4. Log in to Firebase

Authenticate with Firebase using your Google account:

```bash
firebase login
```

---

### 5. (Optional) Set the Firebase Project

Please ensure the correct project is selected, use the wsu-px projec:

```bash
firebase use --add
```
If asked for an alias just type default and hit enter.

---

### 6. Make Your Changes

Update or add your Firebase functions in the `/functions` directory.

---

### 7. Deploy the Functions

From the root of the project:

```bash
firebase deploy --only functions
```

This command will deploy only the Cloud Functions — not the hosting or other Firebase services.

## Firebase Hosting: Build and Deploy Guide

Follow the steps below to build the front-end and deploy it to Firebase Hosting.

### 1. Install Firebase CLI

If you haven’t already, install the Firebase CLI  and node.js globally:

```bash
npm install -g firebase-tools
```

---

### 2. Set Firebase Project

If you haven’t linked the Firebase project yet:

```bash
firebase login
firebase use --add
```
If asked for an alias just type default and hit enter.

Select the appropriate Firebase project from the list (wsu-px).

Also ensure when in the root of the project (the folder "FINAL-SYSTEM-PA2511") to install all the required modules.
```npm install```

---

### 3. Build the Project

Run the following command from the root of the project to generate the production build:

```bash
npm run build
```

This will output the production files into the `dist/` folder.

---

### 4. Deploy to Firebase Hosting

Deploy only the hosting content (not functions or other services):

```bash
firebase deploy --only hosting
```

Firebase will upload the contents of the `dist/` folder.

---

### 5. Updating the Live Site

To update the live site with new changes:

1. Make your changes to the codebase.
2. Run `npm run build` again.
3. Deploy with `firebase deploy --only hosting`.


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
   docker-compose down -v
   docker-compose up --build
   ```
3. Check the logs:
   ```bash
   docker-compose logs
   ```

## License

[MIT License]
