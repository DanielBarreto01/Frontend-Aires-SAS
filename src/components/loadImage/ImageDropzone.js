import React from 'react';
import './ImageDropzone.css';

const ImageDropzone = ({ getRootProps, getInputProps, isDragActive, image, defaultImage, disabled }) => {
    // Si no hay imagen cargada, usa la imagen por defecto
    const displayImage = image || defaultImage;

    // Añadimos una lógica para prevenir la acción si está deshabilitado
    const rootProps = getRootProps({
        onClick: (event) => disabled && event.preventDefault(),  // Evita el clic cuando está deshabilitado
        onDrop: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },    // Evita el drop cuando está deshabilitado
        onDragOver: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, // Evita el arrastre cuando está deshabilitado
        onDragEnter: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, // Evita que se active el drag cuando está deshabilitado
        onDragLeave: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, // Evita que se active el drag cuando está deshabilitado
    });

    return (
        <div {...rootProps} className={`image-dropzone ${disabled ? 'disabled' : ''}`}>
            <input {...getInputProps()} disabled={disabled} />

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