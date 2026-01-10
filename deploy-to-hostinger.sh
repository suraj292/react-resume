#!/bin/bash

# Hostinger Deployment Helper Script
# This script helps prepare your application for deployment

set -e  # Exit on error

echo "🚀 Resume Builder - Hostinger Deployment Helper"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if we're in the correct directory
if [ ! -d "resume-builder-backend" ] || [ ! -d "resume-builder-frontend" ]; then
    print_error "Please run this script from the templates directory"
    exit 1
fi

echo "Step 1: Preparing Backend"
echo "-------------------------"

cd resume-builder-backend

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_info "Please update .env with your production settings"
    read -p "Press enter to continue after updating .env..."
fi

# Install dependencies
print_info "Installing backend dependencies..."
composer install --optimize-autoloader --no-dev --quiet

# Generate key if not set
if ! grep -q "APP_KEY=base64:" .env; then
    print_info "Generating application key..."
    php artisan key:generate
fi

# Cache configuration
print_info "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

print_success "Backend prepared successfully"

cd ..

echo ""
echo "Step 2: Preparing Frontend"
echo "--------------------------"

cd resume-builder-frontend

# Check if .env.production.local exists
if [ ! -f ".env.production.local" ]; then
    print_warning ".env.production.local not found. Creating..."
    cat > .env.production.local << 'EOF'
# Production Environment Variables
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
EOF
    print_info "Please update .env.production.local with your domain"
    read -p "Press enter to continue after updating..."
fi

# Install dependencies
print_info "Installing frontend dependencies..."
npm install --quiet

# Build static export
print_info "Building static export (this may take a few minutes)..."
npm run build

if [ -d "out" ]; then
    print_success "Frontend built successfully"
    print_info "Static files are in: resume-builder-frontend/out/"
else
    print_error "Build failed - out/ directory not created"
    exit 1
fi

cd ..

echo ""
echo "Step 3: Creating Deployment Package"
echo "------------------------------------"

# Create deployment directory
DEPLOY_DIR="hostinger-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

print_info "Creating deployment package in: $DEPLOY_DIR/"

# Copy backend (excluding unnecessary files)
print_info "Packaging backend..."
rsync -a --exclude='node_modules' \
         --exclude='.git' \
         --exclude='tests' \
         --exclude='*.md' \
         --exclude='.env.example' \
         resume-builder-backend/ "$DEPLOY_DIR/api/"

# Copy frontend build
print_info "Packaging frontend..."
cp -r resume-builder-frontend/out/* "$DEPLOY_DIR/"

# Create .htaccess files
print_info "Creating .htaccess files..."

# Root .htaccess
cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # API Routes
    RewriteRule ^api/(.*)$ api/public/$1 [L,QSA]

    # Static files
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Next.js pages
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME}.html -f
    RewriteRule ^(.*)$ $1.html [L]

    # Fallback
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ /index.html [L]
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
EOF

# API .htaccess
cat > "$DEPLOY_DIR/api/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
EOF

# Laravel public .htaccess (should already exist, but ensure it's correct)
cat > "$DEPLOY_DIR/api/public/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
EOF

print_success "Deployment package created"

echo ""
echo "Step 4: Creating Archive"
echo "------------------------"

print_info "Creating tar.gz archive..."
tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"

FILE_SIZE=$(du -h "${DEPLOY_DIR}.tar.gz" | cut -f1)
print_success "Archive created: ${DEPLOY_DIR}.tar.gz (${FILE_SIZE})"

echo ""
echo "✅ Deployment Preparation Complete!"
echo "===================================="
echo ""
print_success "Your deployment package is ready:"
echo "   📦 Archive: ${DEPLOY_DIR}.tar.gz"
echo "   📁 Directory: ${DEPLOY_DIR}/"
echo ""
echo "Next Steps:"
echo "1. Upload ${DEPLOY_DIR}.tar.gz to your Hostinger account"
echo "2. Extract to public_html/ directory"
echo "3. Update .env in api/ directory with production settings"
echo "4. Run migrations via SSH or temporary script"
echo "5. Set up cron jobs in cPanel"
echo ""
print_info "For detailed instructions, see: HOSTINGER_DEPLOYMENT_GUIDE.md"
echo ""

# Offer to clean up
read -p "Do you want to remove the deployment directory? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$DEPLOY_DIR"
    print_success "Deployment directory removed"
fi

echo ""
print_success "Done! 🎉"
