const express = require('express');
const axios = require('axios').default;

const app = express();
app.use(express.json());

app.get('/characters', async  (request,response)=>{
    try{
        const { page, size } = request.query;

        const {data} = await axios.get('https://rickandmortyapi.com/api/character');

        const rightData = data.results.reduce((acc,cur)=>{
            const {id, name, type, status, image, location } = cur;
            acc.push({id, name, type, status, image, location });
            return acc;
        }, []);
 
        const paginated = rightData.slice( (page-1) * size , page*size);

        return response.status(200).json(paginated);

    }catch(error){
        return response.status(500).json(error);

    }

});

app.get('/episodes/:characterId', async(request, response) => {

    try{
        const {characterId} = request.params;
    
        const dataApi = await axios.get(`https://rickandmortyapi.com/api/character/${characterId}`);
    
        const character = dataApi.data;
    
        const episodes = character.episode;
    
        const episodesId = episodes.map(item=>{
            return item.substr(item.lastIndexOf('/')+1);
        });

        const joinedEpisodes = episodesId.join();
        
        const dataApiEpisodes = await axios.get(`https://rickandmortyapi.com/api/episode/${joinedEpisodes}`);

        return response.status(200).json(dataApiEpisodes.data);
        
    }catch(error){
        return response.status(500).json(error);
    }
});

app.listen(3333, ()=> console.log('Serve on'));
