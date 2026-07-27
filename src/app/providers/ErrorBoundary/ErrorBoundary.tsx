import { Component, ErrorInfo, ReactNode } from 'react';
import { areArraysShallowEqual } from 'src/shared/lib/arrays/areArraysShallowEqual';
import Fallback from '../Fallback/Fallback';

type FallbackRenderProps = {
  error: Error;
  handleRetry: () => void;
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (props: FallbackRenderProps) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  onRetry?: () => void;
  retryKeys?: readonly unknown[];
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const prevKeys = prevProps.retryKeys ?? [];
    const nextKeys = this.props.retryKeys ?? [];

    if (this.state.hasError && !areArraysShallowEqual(prevKeys, nextKeys)) {
      this.handleRetry();
    }
  }

  handleRetry = () => {
    this.props.onRetry?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const error = this.state.error ?? new Error('Неизвестная ошибка.');

    if (this.props.fallbackRender) {
      return this.props.fallbackRender({ error, handleRetry: this.handleRetry });
    }

    return (
      <div role="alert">
        <Fallback error={this.state.error} />
      </div>
    );
  }
}
