#!/bin/bash

# Start frontend (Next.js) dev server
(cd resume-builder-frontend && npm run dev) &

# Start backend Laravel server
(cd resume-builder-backend && php artisan serve) &

# Start backend Laravel queue worker
(cd resume-builder-backend && php artisan queue:work) &

# Watch for changes and update graphify knowledge graph
graphify watch . &

# Wait for all background jobs
wait
