import React from 'react';
import { Link } from 'react-router-dom';
import SignIn from '../../../modules/user/components/signIn';
import Layout from '../../../commons/components/layouts';

const SignInPage: React.FC = () => {
  return (
    <Layout title="Sign In">
      <div className="signin-page">
        <SignIn />
        <div className="signin-links">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignInPage; 