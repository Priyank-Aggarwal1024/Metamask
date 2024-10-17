import React from 'react';
import back from '../images/back.svg'

function BackArrow({ setTab }) {
    return (
        <div>
            <img className="pb-4" alt="Back" src={back} onClick={() => {
                setTab(4)
            }} />
        </div>
    );
}

export default BackArrow;