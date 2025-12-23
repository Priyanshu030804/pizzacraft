import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { authAPI } from '../services/api';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      await authAPI.verifyEmail(verificationToken);
      setStatus('success');
      setMessage('Your email has been verified successfully!');
    } catch (error: unknown) {
      setStatus('error');
      const errorMessage = error instanceof Error && 'response' in error && error.response && 
                          typeof error.response === 'object' && 'data' in error.response &&
                          error.response.data && typeof error.response.data === 'object' &&
                          'error' in error.response.data 
                          ? String(error.response.data.error) 
                          : 'Email verification failed';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          
          <h2 className="font-display text-3xl font-bold text-gray-900">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          
          <p className="mt-2 text-gray-600">
            {status === 'loading' && 'Please wait while we verify your email address.'}
            {message}
          </p>
        </div>

        {status !== 'loading' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            {status === 'success' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Your email address has been successfully verified. You can now enjoy all the features of PizzaCraft!
                  </p>
                  
                  <Link
                    to="/login"
                    className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-block text-center"
                  >
                    Sign In to Your Account
                  </Link>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    The verification link may be invalid or expired. You can request a new verification email.
                  </p>
                  
                  <div className="space-y-3">
                    <Link
                      to="/register"
                      className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-block text-center"
                    >
                      Create New Account
                    </Link>
                    
                    <Link
                      to="/login"
                      className="w-full border border-primary-500 text-primary-500 py-3 px-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-block text-center"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <Link to="/" className="text-primary-600 hover:text-primary-500 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;