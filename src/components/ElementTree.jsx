import React from 'react';
import { nanoid } from 'nanoid';
import Tooltip from './Tooltip'

export const ElementTree = ({data}) => {
    //Компонент, создающий элементы исходя из типа элемента(в случае если строка возврачает один параметр, в случае если массив мапит его, а массив у нас только пользователи). Пользователи также обернуты в компонент Tooltip для отображения информации при наведении. 
    return (
            <ul className={`citizen-${data.type}`}>
                {typeof(data.name) === 'string' ? <li>{data.name}</li> : data.name.map(item => (<Tooltip key={nanoid()} content={`Город: ${item.city.name}, Население: ${item.city.data} человек`} children={<li className={`citizen-data-item`} >{item.name}</li>} />))}
                <li>{data.child && <ElementTree data={data.child} />}</li>
            </ul>
    )
}

export default ElementTree

