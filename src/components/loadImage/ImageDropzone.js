import React from 'react';
import './ImageDropzone.css';

const ImageDropzone = ({ getRootProps, getInputProps, isDragActive, image, defaultImage }) => {
    // Si no hay imagen cargada, usa la imagen por defecto
    const displayImage = image || defaultImage;

    return (
        <div {...getRootProps()} className="image-dropzone">
            <input {...getInputProps()} />

            {/* Muestra la imagen cargada o la imagen por defecto */}
            {displayImage && (
                <img src={displayImage} alt="Vista previa" />
            )}

            {/* Mostrar el texto solo si no hay imagen cargada o si se está arrastrando una imagen */}
            {(isDragActive || !displayImage) && (
                <div className="overlay-text">
                    {isDragActive ? "Suelta la imagen aquí..." : "Arrastra y suelta una imagen aquí, o haz clic para seleccionarla"}
                </div>
            )}
        </div>
    );
};

export default ImageDropzone;