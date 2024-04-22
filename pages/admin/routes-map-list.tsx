import withAuth from '../../components/hooks/WithAuth';
import RoadmapTable from '../../components/tables/RoadMapTable';
import { useRoadmaps } from '../../context/RoadMapsContext';

const RoutesMapList: React.FC = () => {

    const { roadmaps } = useRoadmaps();

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