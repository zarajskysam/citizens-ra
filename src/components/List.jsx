import React from 'react';
import { useEffect, useState } from 'react';

export default function List() {

    
    let [ citizens, setCitisens ] = useState([]);
    let [ cities, setCities ] = useState([]);
    

    useEffect(() => {
        async function getCities() {
            try {
              const response = await fetch('http://localhost:7777/cities');
              if (!response.ok) {
                throw new Error(response.message);
              }
      
              const responseCities = await response.json();
              setCities(responseCities);
            } catch (e) {
              console.error(e);
            }
          }
        async function getCitizens() {
            try {
              const response = await fetch('http://localhost:7777/citizens');
              if (!response.ok) {
                throw new Error(response.message);
              }
      
              const responseCitizens = await response.json();
              setCitisens(responseCitizens);
            } catch (e) {
              console.error(e);
            }
          }
        getCities();  
        getCitizens();
    }, [])

    function addCity(cities_arr, citizen_id) {
        let result = cities_arr.find(item => item.id === citizen_id);
        if (result) {
          return result;
        }
    }

    function citizensWithCities(citizens, cities) {
        let newCitizensArray = citizens.map(item => (
            {
              ...item,
              city: addCity(cities, item.city_id)
            }
          ))
        
        return newCitizensArray;
    }

    function sortCitizensArray(citizens, cities) {
      return citizensWithCities(citizens, cities).sort((x1, x2) => {
        for(let i = 0; i < x1.groups.length; i++) {
          if (x1.groups[i].name < x2.groups[i].name) return -1;
          if (x1.groups[i].name > x2.groups[i].name) return 1;
        }
        if (x1.name < x2.name) return -1;
        if (x1.name > x2.name) return 1;
        return 0;
      })
  }

    
      


    return (
        <div className='citizens'>
            <div className='citizen'>
                    <div className='citizen-id'>ID</div>
                    <div className='citizen-name'>Имя</div>
                    <div className='citizen-city'>Город</div>
                    <div className='citizen-data'>Район</div>
            </div>
            {sortCitizensArray(citizens, cities).map(item => (
                <div className='citizen'>
                    <div className='citizen-id'>{item.id}</div>
                    <div className='citizen-name'>{item.name}</div>
                    <div className='citizen-city'>{item.groups[0].name}</div>
                    <div className='citizen-street'>{item.groups[1].name}</div>
                </div>
            ))}
        </div>
    )
}
