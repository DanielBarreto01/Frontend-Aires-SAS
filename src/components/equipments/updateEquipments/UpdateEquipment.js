import React, { useEffect, useState } from 'react';
import CustomToast from '../../toastMessage/CustomToast';
import { jwtDecode } from 'jwt-decode';
import { useDropzone } from 'react-dropzone';
import appFirebase from '../../FirebaseConfig.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import UpdateEquipmentForm from './UpdateEquipmentForm';
import ListEquipments from '../listEquipments/ListEquipments.js';
import { updateEquipments } from "../../../api/EquipmentService"


function UpdateEquipment({ equipment }) {
    const [isNewComponentVisible, setIsNewComponentVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);  // Estado para mostrar el modal
    const [modalType, setModalType] = useState('');     // Estado para controlar el tipo de acción (cancelar o registrar)
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const [isTokenChecked, setIsTokenChecked] = useState(true);
    const [isEditingButtons, setIsEditingButtons] = useState(false);
    const [image, setImage] = useState(null);
    const [fileUser, setFileUser] = useState(null); // Para mostrar el progreso de la carga
    const [isEditingFormulary, setIsEditingFormulary] = useState(false);
    const storageApp = getStorage(appFirebase);
    const defaultEquipmentData = {
        name: '',
        equipmentType: '',
        serialNumber: '',
        brand: '',
        modelNumber: '',
        iventoryNumber: '',
        equipmentState: true,
        pathImage: ''
    }
    const [formData, setFormData] = useState(defaultEquipmentData);
    let equipmentData = null;

    const loadformData = () => {
        const dataEquipment = Object.assign({}, defaultEquipmentData, {
            ...equipment,
        });
        return dataEquipment;
    }
    useEffect(() => {
        setTimeout(() => {
            try {
                //setFormData(null);
                setFormData(loadformData());
                if (localStorage.getItem('authToken') === null && jwtDecode(localStorage.getItem('authToken')).exp * 1000 < Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                    localStorage.removeItem('authToken');
                    setIsTokenChecked(false);
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }

        }, 200);
        return () => clearTimeout();
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*', 
        onDropAccepted: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file && file.type.startsWith('image/')) {
                console.log('Archivo aceptado:', file);
                const previewUrl = URL.createObjectURL(file);
                setFileUser(file);
                setImage(previewUrl);
            } else {
                setToastMessage('Por favor, selecciona solo archivos de imagen.');
                setToastType('danger');
                setShowToast(true);
            }
        },
        maxFiles: 1,
        multiple: false,

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'email' ? value.replace(/\s/g, '') : value,
        });
    };

    const handleCancel = () => {
        try {
            console.log('image format', image);
            if (JSON.stringify(loadformData()) !== JSON.stringify(formData) || (image !== null && image !== loadformData().pathImage)) {
                setShowModal(true);
                setModalType('cancel');
            } else {
                setIsEditingFormulary(false);
            }
        } catch (error) {
            console.error('Error canceling:', error);
            setIsEditingFormulary(false);
        }

    };

    const handleEditClick = (event) => {
        event.preventDefault();
        setIsEditingFormulary(true);
    }
    const handleShowListEquipment = () => {
        setIsNewComponentVisible(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        setModalType('register');
        setShowModal(true);
    };

    const uploadImage = async () => {
        try {
            if (fileUser !== null) {
                const storageRef = ref(storageApp, `equipments/${fileUser.name}`);
                await uploadBytes(storageRef, fileUser).then((res) => {
                    console.log('respuesta', res)
                });
                console.log('Image uploaded successfully');
                const url = await getDownloadURL(storageRef);
                equipmentData = {
                    ...formData,
                    pathImage: url
                };
            } else {
                equipmentData = formData;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleConfirmAction = async () => {
        setShowModal(false);  // Cerramos el modal primero
        if (modalType === 'cancel') {
            setFormData((prevState) => {
                setImage((prevStat) => {
                    setIsEditingFormulary(false);
                    return formData.pathImage
                });
                return loadformData();
            });
        } else if (modalType === 'register') {
            setLoading(true);
            await uploadImage(fileUser);
            try {
                const response = await updateEquipments(equipment.id, equipmentData, localStorage.getItem('authToken'));
                if (response.status === 200) {
                    setToastMessage(response.data || 'Equipo actualizado con éxito');
                    setToastType('success'); // Tipo de mensaje (éxito)
                    setShowToast(true);  // Mostramos el Toast
                    setIsEditingFormulary(false);                  
                    setIsEditingButtons(true);
                    setLoading(false);
                    setTimeout(() => {
                        setFormData(defaultEquipmentData);
                        setIsNewComponentVisible(true);
                    }, 3000);  // Cambiar desp// Retardo adicional para que el Toast sea visible (3.5 segundos en este caso)
                }
            } catch (error) {
                if (!error.response) {
                    setToastMessage('No se puede conectar al servidor. Verifica tu conexión o intenta más tarde.');
                    setToastType('danger');
                } else {
                    const errorMessage =
                        error.response.data && error.response.data
                            ? error.response.data
                            : 'Error al actualizar el equipo. Inténtalo de nuevo.';
                    setToastMessage(errorMessage);  // Mostrar el mensaje de error del backend
                    setToastType('danger');  // Tipo de mensaje (error)
                }
                setShowToast(true);
                setLoading(false); // Detenemos el spinner si hay un error
            }


        }
        // Retardo de 500 ms para mostrar el spinner después de cerrar el modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal sin realizar acción
    };


    if (!isTokenChecked) {
        return null;
    }

    return (
        isNewComponentVisible ? (
            <ListEquipments />) : (
            <>
                <div className='container-equipment-update'>
                    <UpdateEquipmentForm
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        handleCancel={handleCancel}
                        handleShowListEquipment={handleShowListEquipment}
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        handleConfirmAction={handleConfirmAction}
                        isEditingButtons={isEditingButtons}
                        modalType={modalType}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        image={image}
                        setImage={setImage}
                        isEditing={isEditingFormulary}
                        handleEditClick={handleEditClick}
                    />
                    <CustomToast
                        showToast={showToast}
                        setShowToast={setShowToast}
                        toastMessage={toastMessage}
                        toastType={toastType}
                    />
                </div>

            </>
        )

    );
}

export default UpdateEquipment;