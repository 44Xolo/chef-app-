# Changelog

All notable changes to **Atero Eats** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) (Keep a Changelog, n.d.),
and this project adheres to [Semantic Versioning](https://semver.org/spec/SemVer) (Semantic Versioning, n.d.).

## [Unreleased]

### Added
- Initial release of Atero Eats digital ordering system
- Customer ordering flow with welcome screen and setup
- Menu browsing with category filtering (Mains, Starters, Desserts, Drinks)
- Real-time shopping cart with quantity management
- Special discount system: "Buy 2 Mains, get R50 OFF"
- Payment processing for Card and Cash methods
- Chef admin panel with secure login
- Stock control and menu item management
- Responsive design optimized for mobile and desktop
- Dark theme UI with modern styling
- Real-time visual feedback for cart additions
- Order confirmation with unique order numbers
- Feedback system for user suggestions

### Technical Implementation
- Angular 17+ with standalone components
- TypeScript for type safety
- Angular Signals for reactive state management
- Tailwind CSS for utility-first styling
- Client-side form validation
- Error handling with user-friendly alerts
- Mobile-first responsive design
- High-quality food images from Unsplash (Unsplash, n.d.)

### Features
- **Customer Experience**:
  - Personalized ordering with name and table tracking
  - Intuitive menu navigation and filtering
  - Visual cart management with quantity controls
  - Automatic discount calculations
  - Multiple payment method support
  - Clear order confirmation process

- **Admin Features**:
  - Secure admin login system
  - Real-time stock management
  - Dynamic menu item addition
  - Order monitoring capabilities

- **Technical Features**:
  - Progressive Web App capabilities
  - Offline-ready architecture
  - Performance optimized with lazy loading
  - Accessibility compliant
  - Cross-browser compatibility

### Fixed
- Resolved JSX configuration error by renaming `app.tsx` to `app.ts`
- Removed redundant CurrencyPipe import (DecimalPipe handles formatting)
- Updated image mappings to use professional food photography
- Fixed responsive layout issues on mobile devices
- Corrected payment validation logic
- Improved error handling for edge cases

### Security
- Implemented secure admin authentication
- Client-side input validation and sanitization
- Protected admin routes and functionality
- Secure payment form handling (simulation)

### Performance
- Optimized bundle size with tree shaking
- Lazy loading of components
- Efficient state management with signals
- Image optimization for faster loading
- Minimal re-renders with OnPush change detection

---

## Version History

### v1.0.0 - Initial Release
- Complete digital ordering system implementation
- Full customer and admin functionality
- Production-ready codebase with documentation

---

**Legend:**
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

## References

Keep a Changelog. (n.d.). *Keep a Changelog*. Available at: https://keepachangelog.com/en/1.0.0/ (Accessed: 13 November 2025).

Semantic Versioning. (n.d.). *Semantic Versioning*. Available at: https://semver.org/spec/SemVer (Accessed: 13 November 2025).

Unsplash. (n.d.). *Unsplash*. Available at: https://unsplash.com/ (Accessed: 13 November 2025).
