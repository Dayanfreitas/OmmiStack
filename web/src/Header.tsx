import React, {useState} from 'react'

interface HeaderProps {
    title: string;

}

const Header: React.FC<HeaderProps> = (props) => {
    const [counter, setCount] = useState(0);//[Valor do estado, func para atualizar ]

    function handleClick () {
        setCount(counter+1)
    }

    return (
        <header>
            {props.title} = {counter}
            <button type="button" onClick={handleClick}>Aumentar</button>
        </header>
    )
}

export default Header;

