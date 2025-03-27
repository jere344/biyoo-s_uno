import React from 'react';
import { Html } from '@react-three/drei';

interface ColorPickerProps {
    onColorSelected: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelected }) => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    
    return (
        <Html center position={[0, 0, 2]}>
            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '20px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
            }}>
                <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>Select a color:</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                }}>
                    {colors.map(color => (
                        <button
                            key={color}
                            onClick={() => onColorSelected(color)}
                            style={{
                                width: '80px',
                                height: '80px',
                                cursor: 'pointer',
                                backgroundColor: color,
                                border: 'none',
                                borderRadius: '5px',
                                textTransform: 'capitalize',
                                fontWeight: 'bold',
                                color: color === 'yellow' ? 'black' : 'white',
                            }}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>
        </Html>
    );
};

export default ColorPicker;
