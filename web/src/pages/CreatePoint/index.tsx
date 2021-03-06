import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import api from '../../services/api'

import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent, latLng } from 'leaflet'


import './style.css'

import logo from '../../assets/logo.svg'
import Axios from 'axios';

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}



const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    
    const [formData, setformData] = useState({
        name: '',
        email: '',
        whatsapp : ''
    });

    const [selectUf, setSelectUf] = useState('0');
    const [selectCity, setSelectCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectPosition, setSelectPosition] = useState<[number, number]>([0,0]);
    
    const history = useHistory();
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude} = position.coords;
            setInitialPosition([latitude, longitude]);
        })
    }, [])

    /*Execultado uma unica vez */
    useEffect(() => {
        api.get('items').then((response) => {
            console.log(response)
            setItems(response.data);
        })
    }, []);
    
    useEffect(() => {
        Axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    }, []);
    
    useEffect(() => {
        // Carregar as cidade sem pre que mudar a uf
        if (selectUf === '0')
            return

        Axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`).then(response => {
        const cityNames = response.data.map(city => city.nome)
            
            setCities(cityNames)
        })

    }, [selectUf]);
    
    function handleSelectedUf (event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectUf(uf)
    }
    
    function handleSelectedCity (event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setSelectCity(city)
    }

    function handleInputChange (event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        
        setformData({...formData, [name]: value})
    }

    
    function handleMapClick (event: LeafletMouseEvent) {
        const {lat, lng} = event.latlng
        setSelectPosition([lat, lng])
    }

    function handleSelectedItem (id: number) {
        console.log('id', id )
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filterItems  = selectedItems.filter(item => item !== id);
            setSelectedItems(filterItems)
        }else {
            setSelectedItems([...selectedItems, id])
        }
    }
    
    async function handleSubmit (event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp} = formData;
        const uf = selectUf;
        const city = selectCity;
        const [latitude, longitude] = selectPosition;
        const items =  selectedItems;

        console.log('latitude',latitude)
        console.log('longitude',longitude)
        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        await api.post('points', data);

        alert("Ponto de coleta criado!");
        history.push('/');
    }
    
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft/> Voltar para home
                </Link>
            </header>

            <form action="" onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}/>
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select name="uf" 
                                    id="uf" 
                                    value={selectUf} 
                                    onChange={handleSelectedUf}>
                                    <option value="0">Selecione uma UF</option>
                                    {ufs.map(uf => (<option value={uf}>{uf}</option>))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">City</label>
                            <select name="city" 
                                    id="city"
                                    onChange={handleSelectedCity}
                                    value={selectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (<option value={city}>{city}</option>))}
                            </select>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um o mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} 
                                onClick={()=>{handleSelectedItem(item.id)}}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>

            </form>
        </div>
    )
}

export default CreatePoint;