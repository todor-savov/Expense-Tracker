import { ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <div role="alert">
            <p>Something went wrong: <pre>{error.message}</pre></p>            
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
};

export default function AppErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}} onError={(error, info) => console.log(error, info)}>      
            {children}
        </ErrorBoundary>
    );
}

