import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { useTheme } from '@/lib/store/theme';
import React, { Component, ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.handleReset);
      }

      return <DefaultErrorFallback error={this.state.error!} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
  const { isDark, colors } = useTheme();

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Card variant="outlined" className="w-full max-w-sm">
        <View className="items-center">
          <View 
            className="w-16 h-16 rounded-full mb-4 items-center justify-center"
            style={{ backgroundColor: colors.error[100] }}
          >
            <Icon name="alert-triangle" size={32} color={colors.error[500]} />
          </View>
          
          <Text 
            className="text-xl font-bold mb-2 text-center"
            style={{ color: colors.text.primary }}
          >
            Something went wrong
          </Text>
          
          <Text 
            className="text-base mb-6 text-center"
            style={{ color: colors.text.secondary }}
          >
            We encountered an unexpected error. Please try again.
          </Text>

          <TouchableOpacity
            onPress={onReset}
            className="bg-primary py-3 px-6 rounded-lg mb-4 w-full"
          >
            <Text className="text-white font-semibold text-center">
              Try Again
            </Text>
          </TouchableOpacity>

          {__DEV__ && (
            <ScrollView className="max-h-40 w-full">
              <Text 
                className="text-xs font-mono"
                style={{ color: colors.text.tertiary }}
              >
                {error.message}
              </Text>
              {error.stack && (
                <Text 
                  className="text-xs font-mono mt-2"
                  style={{ color: colors.text.tertiary }}
                >
                  {error.stack}
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      </Card>
    </View>
  );
}

// Hook for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}