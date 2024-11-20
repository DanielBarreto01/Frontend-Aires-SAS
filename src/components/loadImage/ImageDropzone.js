import React, { useState } from 'react';
import './ImageDropzone.css';


const ImageDropzone = ({ getRootProps, getInputProps, isDragActive,  image, defaultImage, disabled }) => {
    const displayImage = image || defaultImage;
    const rootProps = getRootProps({
        onClick: (event) => disabled && event.preventDefault(), 
        onDrop: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            } 
        },  
        onDragOver: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        onDragEnter: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, 
        onDragLeave: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, 

    });

    return (
        <div {...rootProps} className={`image-dropzone ${disabled ? 'disabled' : ''}`}>
            <input {...getInputProps({ accept: "image/*" })} disabled={disabled} />
            {displayImage && (
                <img src={displayImage} alt="Vista previa" />
            )}
            {(isDragActive || !displayImage) && (
                <div className="overlay-text">
                    {isDragActive ? "Suelta la imagen aquí..." : "Arrastra y suelta una imagen aquí, o haz clic para seleccionarla"}
                </div>
            )}

        </div>
    );
};

export default ImageDropzone;