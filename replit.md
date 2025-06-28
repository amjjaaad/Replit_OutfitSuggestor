# StyleSync - AI Fashion Assistant

## Overview

StyleSync is a modern web application that transforms users' clothing photos into personalized outfit recommendations using AI. The app provides an intuitive multi-step workflow where users upload photos of their clothing items, review AI-generated classifications, and receive curated outfit suggestions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Local React state with custom hooks
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **File Upload**: Multer for handling multipart form data
- **AI Integration**: OpenAI API for image classification and outfit generation
- **Development**: Hot module replacement with Vite middleware

### Component Structure
The application follows a state machine pattern with six distinct screens:
1. `Home` - Welcome screen with app introduction
2. `Selection` - Photo upload interface
3. `Classifying` - Loading state during AI classification
4. `Confirmation` - Review and correct AI classifications
5. `Generating` - Loading state during outfit generation
6. `Results` - Display generated outfit recommendations

## Key Components

### State Management
- **AppState Interface**: Centralized state containing current screen, uploaded images, classified items, outfit recommendations, loading states, and error handling
- **Screen Navigation**: Custom navigation system that updates app state and manages screen transitions
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures

### Image Processing Pipeline
- **Upload**: Multer processes multipart form data with 10MB file size limits
- **Validation**: Image-only file type filtering
- **Storage**: In-memory base64 encoding for temporary storage
- **Preview**: Client-side blob URLs for immediate user feedback

### AI Integration
- **Classification Service**: OpenAI GPT-4o analyzes clothing images and categorizes them into predefined types (Top, Pants, Skirt, Dress, Outerwear, Shoes, Accessory)
- **Confidence Scoring**: AI provides confidence scores (0.0-1.0) for each classification
- **Outfit Generation**: AI creates outfit combinations based on confirmed item classifications

### UI/UX Design
- **Mobile-First**: Responsive design optimized for mobile devices
- **Progressive Enhancement**: Graceful degradation for different device capabilities
- **Loading States**: Distinct loading screens for different AI processes
- **Error Handling**: Comprehensive error boundaries and user feedback

## Data Flow

1. **Image Upload**: Users select photos → Multer processes files → Base64 encoding → Client state update
2. **AI Classification**: Images sent to OpenAI → GPT-4o analyzes → Returns categories with confidence scores
3. **User Confirmation**: Display classifications → User can modify categories → Confirmed items stored
4. **Outfit Generation**: Confirmed items sent to OpenAI → AI creates outfit combinations → Results displayed

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Styling**: Tailwind CSS, Radix UI primitives, shadcn/ui components
- **Development**: Vite, TypeScript, ESBuild
- **Data Fetching**: TanStack Query for server state management

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **File Handling**: Multer for multipart form processing
- **AI Service**: OpenAI SDK for GPT-4o integration
- **Database**: Drizzle ORM with PostgreSQL support (configured but not actively used)

### Build and Development Tools
- **Build**: Vite for frontend, ESBuild for backend bundling
- **Database**: Drizzle Kit for schema management
- **Development**: TSX for TypeScript execution, hot reload support

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: Express server with TSX for TypeScript execution
- **Integration**: Vite middleware integration for unified development experience

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: ESBuild bundles server code for Node.js execution
- **Deployment**: Single Node.js process serving both API and static files

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **AI Service**: OpenAI API key configuration
- **Development Tools**: Replit-specific plugins and error overlays

## Changelog
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.