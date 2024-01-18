import React from 'react'
import withAuth from '../components/hooks/WithAuth';
import RoadMapForm from '../components/forms/RoadMapForm';

function CreateRoadMapPage() {
  return (
    <div className='py-20'>
        <RoadMapForm />
    </div>
  )
}

export default withAuth(CreateRoadMapPage)
