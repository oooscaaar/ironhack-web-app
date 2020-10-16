const getAsteroids = async () => {
    let url = 'https://api.nasa.gov/neo/rest/v1/feed/today?detailed=true&api_key=5wdsPsNPv69oNSxQkwdpy0AsZonzKi9oZuqSKn48';
    let today = new Date();
    today.setHours(today.getHours()-2); // Adjust to GMT Timezone
    let formattedDate = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
    const response = await fetch(url);
    const asteroids = await response.json();
    const asteroidsNum = await asteroids.element_count; // Number of asteroids
    const hazardousAst = await getHazardous(); // Array containing hazardous asteroids info 
    const hazardousDetails = await formatHazard(hazardousAst); // Hazardous asteroids formatted information to fill the string
    
    async function getHazardous(){
        const hazardousArr = [];
        for(let i = 1; i < await asteroidsNum; i++){ // Start in the second element (The first one is always repeated)
            if(await asteroids.near_earth_objects[formattedDate][i].is_potentially_hazardous_asteroid){
                hazardousArr.push(asteroids.near_earth_objects[formattedDate][i]);
            }
        }
        return hazardousArr;
    }

    // Format detailed information string
    async function formatHazard(hazardousAst) {
        let str = '';
        for(let i=0; i < hazardousAst.length; i++){
            str += `\n[ ${[i+1]} ]
            Name: ${hazardousAst[i].name}
            Diameter (meters): ${Math.floor((hazardousAst[i].estimated_diameter.meters.estimated_diameter_min+hazardousAst[i].estimated_diameter.meters.estimated_diameter_max)/2)} m
            Velocity (km/h): ${Math.floor(hazardousAst[i].close_approach_data[0].relative_velocity.kilometers_per_hour)} km/h
            Distance to the earth (km): ${Math.floor(hazardousAst[i].close_approach_data[0].miss_distance.kilometers)} km
            `;
        }
        return str;
    }

    // Set the formatted response
    unlimitedAdventure.rooms[5].items[0].response = await `
        You compute everything using the Hubble. After a few hours of really hard work, you get this terrible information:\n
        Number of asteroids near the planet earth [ ${asteroidsNum} ]
        Number of HAZARDOUS asteroids [ ${hazardousAst.length} ]\n
        -- Hazardous Asteroids details --
        ${hazardousDetails}
        You save all the information to a USB drive.
        Now it's time to think about what to do next. Or maybe not. You have had more than enough for today!
        TO BE CONTINUE...
    `;
}