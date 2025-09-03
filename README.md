# Antonio Wang's Portfolio

A website made to showcase all the projects and experiences of Antonio Wang through a modern UI.

## Getting Started

### Installation

Install the dependencies:

```bash
npm ci
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Update the Manifest

The image manifest is required to display correctly all projects in the portfolio. Update it with the command:

```bash
node generateManifest.mjs
```

## Building for Production

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

## Styling

This project is made with [Tailwind CSS](https://tailwindcss.com).

---

Built using React Router.

> _Coding by passion, capturing the streets by instinct._
