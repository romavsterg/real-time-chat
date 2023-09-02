import React from 'react';

function Popup({children}) {
    return (
        <div className='popup-container'>
            {children}
        </div>
    );
}

export default Popup;