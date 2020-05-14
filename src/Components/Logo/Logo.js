import React from 'react';
import Tilt from 'react-tilt';
import snow from './snow.png';
import './Logo.css';
 
const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa4">
                    <img style={{paddingTop:'3px'}} alt='logo' src={snow}/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;