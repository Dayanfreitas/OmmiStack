import React from 'react';
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import './style.css'

import logo from '../../assets/logo.svg'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>

                <main>
                    <h1>
                        Seu marketplace de coletas de resíduos.
                    </h1>
                    <p>Ajudamos pessoas a encrontrarem pontos de coletas de forma eficiente</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>
                            Cadastre seu ponto de coleta
                        </strong>
                    </Link>
                </main>
            </div>
        </div>
        
    )
}

export default Home;