
import React from 'react';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
