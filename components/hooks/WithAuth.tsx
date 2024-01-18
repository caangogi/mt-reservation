import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth';
import Header from '../headers/AdmindHeader';

const withAuth = (WrappedComponent: React.FC) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { currentUser, loading } = useAuth();

    useEffect(() => {
      const redirect = async () => {
        if (loading) {
          return;
        }

        if (!currentUser) {
          router.push('/login'); 
        }
      };

      redirect();
    }, [currentUser, loading, router]);

    return(
      <div>
        <Header />
        {currentUser ? <WrappedComponent {...props} /> : null}
      </div>
    );
  };

  return Wrapper;
};

export default withAuth;
