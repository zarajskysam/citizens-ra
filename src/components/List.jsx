import { nanoid } from 'nanoid';
import React from 'react';
import { useEffect, useState } from 'react';
import ElementTree from './ElementTree';

export default function List() {

    
    let [ citizens, setCitisens ] = useState([]);
    let [ cities, setCities ] = useState([]);
    
// Обращаемя к серверу за получением данных
    useEffect(() => {
      async function getFetch(url, func) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(response.message);
          }
  
          const responseArray = await response.json();
          func(responseArray);
        } catch (e) {
          console.error(e);
        }
      } 

      getFetch('http://localhost:7777/cities', setCities); 
      getFetch('http://localhost:7777/citizens', setCitisens); 
    }, [])


    
//Функция, которая будет находить нужный обьект города в зависимости от city_id жителя
    function addCity(cities_arr, citizen_id) {
        let result = cities_arr.find(item => item.id === citizen_id);
        if (result) {
          return result;
        }
    }
//Создаем новый массив уже с городами в каждом жителе
    function citizensWithCities(citizens, cities) {
        let newCitizensArray = citizens.map(item => (
            {
              ...item,
              city: addCity(cities, item.city_id)
            }
          ))
        
        return newCitizensArray;
    }
//Сортируем полученный массив
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
//Вспомогательная функция, применяемая в функции getTreeCitizens(). Ищет всех пользователей с одинаковыми караметрами groups
  function findCitizens (array ,i) {
    let result = sortCitizensArray(citizens, cities).filter(item => JSON.stringify(array[i]) === JSON.stringify(item.groups));
    return result;
  }
//Функция, которая создает дерево иерархии. Начивая от города и заканчивая жителями. Строим данную механику используя reduceRight, отправляя в потомки каждый следующий следующий элемент массива. После этого добавляем всех жителей подходящих по параметрам. Таким образом встраивание в цепочку любого нового параметра не будет вызывать ошибку.   
  function getTreeCitizens(citizens, cities) {
    let allGroups = sortCitizensArray(citizens, cities).map(item => item.groups);
    let unique = Array.from(new Set(allGroups.map(JSON.stringify))).map(JSON.parse);
    let newArr = unique.map((item, index) => ([...item, {type: 'data',name: findCitizens(unique, index)}])).map(item => item.reduceRight((p, c) => ({ ...c, child: p })));
    return newArr;
  }       

  
    return (
        <div className='citizen'>
        {getTreeCitizens(citizens, cities).map(item => (
          <ElementTree key={nanoid()} data={item}/>
        ))}
        </div>
    )
}
