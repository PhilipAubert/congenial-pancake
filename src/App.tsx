import { useState } from 'react';
import { useFetch } from './Hooks/useFetch';
import { httpbinResponse } from './Models/httpbinResponse';

import './App.css';

const apiUrl = 'https://httpbin.org/anything?';

const App = () => {

  const { get } = useFetch();


  const [resultList, setResultList] = useState<httpbinResponse[]>([]);

  const fetching = async (key: string) => {
    try {
      const response = await get(`${apiUrl}${key}`);
      const result = await JSON.parse(response)
      setResultList(prevState => {
        let newState = [...prevState, result];
        return newState;
      });
    } catch (err) {
      console.error(err);
    }
  }

  const fetchMultiple = async (keys: string[]) => {
    keys.forEach((key) => {
      fetching(key);
    })
  }

  return (
    <div className="content">
      <div className="buttons">
      <button onClick={() => fetching('JurassicPark')} style={{backgroundColor: 'black'}}>Jurassic Park</button>
      <button onClick={() => fetching('StarWars')} style={{backgroundColor: 'blue'}}>Star Wars </button>
      <button onClick={() => fetching('Pokemon')} style={{backgroundColor: 'green'}}>Pokemon </button>
      <button onClick={() => fetching('IndianaJones')} style={{backgroundColor: 'purple'}}>Indiana Jones</button>
      <button onClick={() => fetching('StarTrek')} style={{backgroundColor: 'darkorange'}}>Star Trek </button>
      <button onClick={() => { fetchMultiple(['JurassicPark', 'StarWars', 'Pokemon', 'IndianaJones', 'StarTrek']);}} style={{backgroundColor: 'red'}}>All</button>
      </div>
      <div className="responseList">
        <div className="responseContent">
        {resultList.map((result, index) => {
          return (
            <li key={`listItem_${index}`}>{`Request to ${result.url}`}</li>
          )
        })}
        </div>
      </div>
      <button onClick={() => setResultList([])} style={{backgroundColor: "grey"}}>Clear</button>
    </div>
  );
};

export default App;