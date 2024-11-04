# HealthShare

HealthShare is a secure, decentralized health record management platform that enables patients to safely store and share their medical records with healthcare providers. Built with React, TypeScript, and IPFS/Pinata for decentralized storage.

![HealthShare Dashboard](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070)

## Features

- 🔒 Secure, decentralized file storage using IPFS
- 👥 Granular access control for healthcare providers
- ⏱️ Time-based access expiration
- 📱 Responsive, modern interface
- 🔄 Real-time updates
- 📄 Support for multiple file formats (PDF, Images)

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Storage**: IPFS via Pinata
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Pinata credentials:
   ```env
   VITE_PINATA_API_KEY=your_api_key_here
   VITE_PINATA_SECRET_KEY=your_secret_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── AccessControl.tsx
│   ├── FileList.tsx
│   ├── FileUpload.tsx
│   └── Layout.tsx
├── hooks/              # Custom React hooks
│   └── usePinata.ts
├── services/           # API services
│   └── pinata.ts
├── store/             # State management
│   └── useStore.ts
└── App.tsx            # Root component
```

## Features in Detail

### File Upload
- Drag-and-drop interface
- Progress tracking
- File type validation
- Automatic metadata generation

### Access Control
- Grant/revoke access to specific providers
- Set access expiration dates
- Define read/write permissions
- Real-time access list updates

### File Management
- List all accessible files
- Download functionality
- Share capabilities
- File deletion
- Access management interface

## Security

- Decentralized storage using IPFS
- Encrypted file transfer
- Time-based access control
- Granular permission system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Pinata](https://pinata.cloud/) for IPFS storage
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- [Zustand](https://github.com/pmndrs/zustand) for state management