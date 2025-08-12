import React from 'react';
import { Link } from 'react-router-dom';
import SignUp from '../../../modules/user/components/signUp';
import Layout from '../../../commons/components/layouts';

const SignUpPage: React.FC = () => {
  return (
    <Layout title="Sign Up">
      <div className="signup-page">
        <SignUp />
        <div className="signup-links">
          <p>
            Already have an account? <Link to="/signin">Sign in here</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage; 