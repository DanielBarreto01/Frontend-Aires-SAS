import React, { useEffect, useState } from 'react';
import './RegisterUser.css';
import CustomToast from '../../toastMessage/CustomToast';
import RegisterUserForm from './RegisterUserForm';
import { jwtDecode } from 'jwt-decode';
import { useDropzone } from 'react-dropzone';
import appFirebase from '../../FirebaseConfig.js';
import ListUsers from '../listUsers/ListUsers';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

//import { toast } from 'sonner'
function RegisterUser() {
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
    const defaultUserData = {
        name: '',
        lastName: '',
        typeIdentification: '',
        numberIdentification: '',
        email: '',
        phoneNumber: '',
        address: '',
        pathImage: '',
        roles: ['']
    }
    const [formData, setFormData] = useState(defaultUserData)

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
                const storageRef = ref(storageApp, `images/${fileUser.name}`);
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
                    pathImage: 'https://firebasestorage.googleapis.com/v0/b/aires-acondiconados.appspot.com/o/images%2Fuser.png?alt=media&token=6428ebe4-d22c-4954-99fa-8e51de3172d0'
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
            setFormData(defaultUserData);
            setLoading(false);  // Detenemos el spinner
            setIsNewComponentVisible(true);  // Mostramos el componente ListUsers
        } else if (modalType === 'register') {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            };
            const dataUser = await uploadImage();
            axios.post('/users/create', dataUser, config) // Usa la ruta relativa
                .then(response => {
                    setLoading(false);
                    setToastMessage(response.data || 'Usuario registrado con éxito');
                    setToastType('success');
                    setShowToast(true);
                    setIsEditingButtons(true);
                    setTimeout(() => {
                        setFormData(defaultUserData);
                        setIsNewComponentVisible(true);
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error registering user:', error);
                    if (!error.response) {
                        setToastMessage('No se puede conectar al servidor. Verifica tu conexión o intenta más tarde.');
                        setToastType('danger');
                    } else {
                        const errorMessage =
                            error.response.data && error.response.data
                                ? error.response.data
                                : 'Error al registrar el usuario. Inténtalo de nuevo.';
                        setToastMessage(errorMessage);  // Mostrar el mensaje de error del backend
                        setToastType('danger');  // Tipo de mensaje (error)
                    }
                    setLoading(false);
                    setShowToast(true);
                });
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
            <ListUsers />) : (
            <>
                <div className='container'>
                    <RegisterUserForm
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        handleCancel={handleCancel}
                        handleRegister={handleRegister}
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        handleConfirmAction={handleConfirmAction}
                        modalType={modalType}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        image={image}
                        isEditingButtons={isEditingButtons}
                    />
                </div>
                <CustomToast
                    showToast={showToast}
                    setShowToast={setShowToast}
                    toastMessage={toastMessage}
                    toastType={toastType}
                />
            </>
        )
    );
}

export default RegisterUser;