import { useRouter } from 'next/router';
import withAuth from '../../components/hooks/WithAuth';
import RoadmapTable from '../../components/tables/RoadMapTable';
import { useRoadmaps } from '../../context/RoadMapsContext';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';

const RoutesMapList: React.FC = () => {

    const { roadmaps } = useRoadmaps();
    const { userProfile } = useAuth();
    const Router = useRouter();
    if (userProfile && userProfile.type !== 'admin') {
      toast.error('Acceso denegado');
      Router.push('/login');
      return <></>;
}

    return (
      <>
        <div className="container mx-auto px-4 py-24">
          <h1 className="text-2xl font-bold mb-4">Lista de Rutas</h1>
          <RoadmapTable roadmaps={roadmaps} />
        </div>
      </>
    );
};

export default withAuth(RoutesMapList);