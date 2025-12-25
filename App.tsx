import React, { Component, ReactNode, ErrorInfo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import ReviewPage from './pages/ReviewPage';
import AdminDashboard from './pages/AdminDashboard';
import HowItWorks from './pages/HowItWorks';
import { ToastProvider } from './components/ui/ToastProvider';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Crash Details:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-red-100 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">System Error</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We've encountered an unexpected issue. Don't worry, your data is likely safe in local storage.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs font-mono text-slate-500 overflow-auto max-h-32 mb-6 border border-slate-100">
              {error?.message || "Unknown execution error"}
            </div>
            <button
              onClick={() => window.location.href = window.location.pathname}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/review/:code" element={<ReviewPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;