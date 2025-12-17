import React, { Component, ReactNode, ErrorInfo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import ReviewPage from './pages/ReviewPage';
import AdminDashboard from './pages/AdminDashboard';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch runtime errors and prevent the entire app from crashing.
 * Explicitly extends Component with generic types for props and state.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log application errors for debugging purposes
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    // Check if an error was caught in the application lifecycle
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-600 mb-4">The application encountered an unexpected error.</p>
            <div className="bg-slate-100 p-3 rounded text-xs font-mono text-slate-800 overflow-auto max-h-32">
              {this.state.error?.message}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    // Access 'this.props' which is available on components extending React.Component
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/review/:code" element={<ReviewPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;