import React, { useEffect, useState } from 'react';
import CustomToast from '../../toastMessage/CustomToast';
import RegisterEquipmentForm from './RegisterEquipmentForm';
import { jwtDecode } from 'jwt-decode';
import { useDropzone } from 'react-dropzone';
import appFirebase from '../../FirebaseConfig.js';
import ListEquipments from '../listEquipments/ListEquipments.js';
import { createEquipments } from "../../../api/EquipmentService"
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './RegisterEquipment.css';

//import { toast } from 'sonner'
function RegisterEquipment() {
    const [isNewComponentVisible, setIsNewComponentVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);  // Estado para mostrar el modal
    const [modalType, setModalType] = useState('');     // Estado para controlar el tipo de acción (cancelar o registrar)
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const [fileUser, setFileUser] = useState(null);
    const [image, setImage] = useState(null);
    const [isTokenChecked, setIsTokenChecked] = useState(true);
    const [isEditingButtons, setIsEditingButtons] = useState(false);
    const storageApp = getStorage(appFirebase);
    const [formData, setFormData] = useState({
        name: '',
        equipmentType: '',
        serialNumber: '',
        brand: '',
        modelNumber: '',
        iventoryNumber: '',
        pathImage: ''
    });

    useEffect(() => {
        console.log('entra al useeffect');
        setTimeout(() => {
            try {
                const token = localStorage.getItem('authToken');
                if (token === null && jwtDecode(token).exp * 1000 < Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                    localStorage.removeItem('authToken');
                    setIsTokenChecked(false);
                    console.log('entra al token ', token);
                    window.location.href = '/login';
                }
            } catch (error) {
                console.log('error', error);
                setIsTokenChecked(false);
                window.location.href = '/login';
            }
        }, 200);
        return () => clearTimeout();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'email' ? value.replace(/\s/g, '') : value,
        });
    };

    // const handleButtonClick = () => {
    //     setIsNewComponentVisible(prevState => !prevState);
    // };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            console.log('nombre de la imgen subida', file);
            const previewUrl = URL.createObjectURL(file);
            setFileUser(file);
            setImage(previewUrl); // Actualizar el estado con la imagen seleccionada
        }
    })


    const handleCancel = () => {
        setModalType('cancel');  // Definimos el tipo de acción como cancelar
        setShowModal(true);      // Mostramos el modal
    };
    const handleRegister = () => {
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        setModalType('register');
        setShowModal(true);
    };


    const uploadImage = async () => {
        let dataUser = formData;
        try {
            if (fileUser !== null) {
                const storageRef = ref(storageApp, `equipments/${fileUser.name}`);
                await uploadBytes(storageRef, fileUser).then((res) => {
                    console.log('respuesta', res)
                });
                console.log('Image uploaded successfully');
                const url = await getDownloadURL(storageRef);
                dataUser = {
                    ...dataUser,  // Copia el resto de las propiedades
                    pathImage: url
                }
                console.log('Image URL subida:', await getDownloadURL(storageRef));

            } else {
                console.log('No image selected');
                dataUser = {
                    ...dataUser,
                    pathImage: 'https://firebasestorage.googleapis.com/v0/b/aires-acondiconados.appspot.com/o/equipments%2Fequipment.png?alt=media&token=0c2f85e4-324b-4197-9b5c-1f7debaee4eb'
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
        return dataUser;
    };

    const handleConfirmAction = async () => {
        setShowModal(false);  // Cerramos el modal primero
        setLoading(true);
        if (modalType === 'cancel') {
            // Acción de cancelar
            setTimeout(() => {
                setFormData({
                    name: '',
                    equipmentType: '',
                    serialNumber: '',
                    brand: '',
                    modelNumber: '',
                    iventoryNumber: '',
                    pathImage: ''
                });
                setLoading(false);  // Detenemos el spinner
                setIsNewComponentVisible(true);  // Mostramos el componente ListUsers
            }, 200); // Simulamos una espera de 2 segundos
        } else if (modalType === 'register') {
            const dataUser = await uploadImage();
            try {
                const response = await createEquipments(jwtDecode(localStorage.getItem('authToken')).id, dataUser, localStorage.getItem('authToken'));
                console.log('response status', response.status);
                if(response.status === 200){
                    setLoading(false)
                    setToastMessage(response.data);
                    setToastType('success'); // Tipo de mensaje (éxito)
                    setShowToast(true);
                    setFormData({
                        name: '',
                        equipmentType: '',
                        serialNumber: '',
                        brand: '',
                        modelNumber: '',
                        iventoryNumber: '',
                        pathImage: ''
                    });
                    setIsEditingButtons(true);
                    setTimeout(() => {
                       setIsNewComponentVisible(true);
                    }, 3000);
                }
            } catch (error) {
                if (!error.response) {
                    setToastMessage('No se puede conectar al servidor. Verifica tu conexión o intenta más tarde.');
                    setToastType('danger');
                } else {
                    const errorMessage =
                    error.response.data && error.response.data
                            ? error.response.data
                            : 'Error al registrar el equipo. Inténtalo de nuevo.';
                    setToastMessage(errorMessage);  // Mostrar el mensaje de error del backend
                    setToastType('danger');  // Tipo de mensaje (error)
                }
                setShowToast(true);
                setLoading(false); 
            }
        }
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
                <div className='container-equipment-register'>
                    <RegisterEquipmentForm
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        handleCancel={handleCancel}
                        handleRegister={handleRegister}
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        isEditingButtons = {isEditingButtons}
                        handleConfirmAction={handleConfirmAction}
                        modalType={modalType}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        image={image}
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

export default RegisterEquipment;