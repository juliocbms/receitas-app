import React from 'react';

interface LoaderProps {
    show: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ show }) => {
    if (!show) {
        return null; 
    }

    return (
        <div
            id="loader"
            style={{
                background: 'rgba(255, 255, 255, 0.5)',
                width: '100%',
                height: '100%',
                zIndex: 99999,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                top: 0,
                left: 0,
            }}
        >
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};
