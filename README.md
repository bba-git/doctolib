# Doctolib Frontend

A modern web application for managing medical appointments, built with Next.js and TypeScript.

## Features

- User authentication (sign in, sign up, logout)
- Appointment booking system
- Professional profile management
- Patient dashboard
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Backend)
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/doctolib.git
cd doctolib/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── auth/             # Authentication components
├── public/               # Static files
└── styles/              # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
