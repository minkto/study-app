import { useEffect, useState } from 'react';

const ResourcesPage = () => {
    const [resources, setResource] = useState([]);

    useEffect(() => {
        fetch('api/resources/getResource')
            .then((res) => res.json())
            .then((data) => setResource(data))
        console.log(resources);
    }, [])

    return (
        <div>
            <h1>Resources Page</h1>
            <ul>
                {resources.map((resources: any) => (
                    <li key={resources.version}>{resources.version}</li>
                ))}
            </ul>
        </div>)
}

export default ResourcesPage