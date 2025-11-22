# 3D Nano-World Museum

An immersive 3D museum experience built with React, Three.js, and Django. Photos float as interactive nodes in a stylized nano-universe with auto-rotating camera at speed 3.0.

## Features

✅ **Auto-rotating camera** at speed 3.0
✅ **Floating photo nodes** with tech-style connections
✅ **Smooth camera transitions** on node clicks
✅ **Django Admin panel** for photo management
✅ **Responsive design** for mobile and desktop
✅ **Particle effects** for nano-universe atmosphere
✅ **Preloader** with nano-themed animation
✅ **Performance optimizations** across devices

## Architecture

- **Frontend**: React 19 + Next.js 16 + TypeScript + Three.js
- **Backend**: Django 5.2 + Django REST Framework
- **3D Rendering**: React Three Fiber + React Three Drei

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers pillow python-decouple
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd /path/to/Surprise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Photos

1. Access Django Admin at [http://localhost:8000/admin/](http://localhost:8000/admin/)
2. Login with your superuser credentials
3. Navigate to "Photos" section
4. Click "Add photo" and upload images with titles and descriptions
5. Photos will automatically appear in the 3D museum

### 3D Museum Controls

**Desktop:**
- Camera auto-rotates at speed 3.0
- Click on photo nodes to fly to them
- Drag to manually rotate when auto-rotation is paused
- Scroll to zoom
- Click empty space to resume auto-rotation

**Mobile:**
- Tap photo nodes to explore
- Touch and drag to rotate view
- Pinch to zoom
- Touch empty space to resume auto-rotation

## Project Structure

```
Surprise/
├── backend/                    # Django backend
│   ├── museum/                # Django project settings
│   ├── photos/                # Photos app
│   │   ├── models.py          # Photo model
│   │   ├── admin.py           # Django admin
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py           # API views
│   │   └── urls.py            # API URLs
│   └── media/                 # Uploaded photos
├── src/                       # React frontend
│   ├── components/            # React components
│   │   ├── NanoMuseum.tsx     # Main 3D scene
│   │   ├── PhotoNode.tsx      # Photo node component
│   │   ├── ConnectionLines.tsx # Tech visualization
│   │   ├── NanoParticles.tsx  # Background effects
│   │   ├── PhotoDetailView.tsx # Detail modal
│   │   └── Preloader.tsx      # Loading animation
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAutoRotateCamera.ts
│   │   ├── usePhotoData.ts
│   │   ├── useCameraTransitions.ts
│   │   └── useHoverEffects.ts
│   ├── utils/                 # Utility functions
│   │   ├── nodePositioning.ts
│   │   └── performance.ts
│   └── app/                   # Next.js pages
└── .env.local                 # Environment variables
```

## API Endpoints

- `GET /api/photos/` - List all photos
- `GET /api/photos/<id>/` - Get single photo detail
- `POST /admin/` - Django Admin for photo management

## Configuration

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### Django Settings

Key settings in `backend/museum/settings.py`:
- CORS configured for frontend development
- Media files served in development
- REST Framework with JSON renderers

## Performance Features

- **Adaptive Quality**: Automatically adjusts based on FPS
- **LOD System**: Level of detail for distant objects
- **Device Detection**: Optimizes settings for mobile/low-end devices
- **Frustum Culling**: Only renders visible objects
- **Texture Compression**: Optimized photo loading

## Development Notes

### 3D Scene

- **Camera Speed**: 3.0 (as specified)
- **Node Distribution**: Spherical with clustering for organization
- **Connection Lines**: Dynamic lines between nearby nodes
- **Particle System**: 1000+ particles for atmosphere
- **Lighting**: Multi-point lighting with dramatic effects

### Photo Management

- Images uploaded via Django Admin
- Automatic API integration
- Fallback placeholders for broken images
- Responsive image handling in detail view

## Technologies Used

### Frontend
- React 19
- Next.js 16
- TypeScript
- Three.js
- React Three Fiber
- React Three Drei
- Tailwind CSS

### Backend
- Django 5.2
- Django REST Framework
- Django CORS Headers
- Pillow (image processing)
- SQLite (development)

## Production Deployment

### Backend
1. Configure production database
2. Set `DEBUG = False`
3. Configure static/media file serving
4. Set up proper CORS origins
5. Configure environment variables

### Frontend
1. Run `npm run build`
2. Deploy to preferred hosting platform
3. Set `NEXT_PUBLIC_API_URL` to production backend

## Troubleshooting

### Common Issues

1. **API Connection Error**: Ensure Django server is running on port 8000
2. **CORS Issues**: Check Django CORS settings
3. **3D Performance**: Try reducing particle count in settings
4. **Photo Not Loading**: Check image file size and format in Django Admin

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Good support (may need WebGL enabled)
- Mobile: Optimized for modern mobile browsers

## License

This project is a gift museum experience. Please use responsibly.

---

**Built with ❤️ for creating memorable 3D experiences**
