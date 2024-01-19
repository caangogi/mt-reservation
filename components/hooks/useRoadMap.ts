import { useState } from "react";
import { RoadMapProps } from "../../backend/road-map/domain/types";


export const useRoadMap = () => {
    const [roadMap, setRoadMap] = useState<RoadMapProps | null>(null);
  
    return {
      roadMap,
      setRoadMap,
    };
  };