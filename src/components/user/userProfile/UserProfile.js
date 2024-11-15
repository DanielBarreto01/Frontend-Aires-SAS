import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import CustomToast from '../../toastMessage/CustomToast';
import { jwtDecode } from 'jwt-decode';
import { useDropzone } from 'react-dropzone';
import appFirebase from '../../FirebaseConfig.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import UserProfileForm from './UserProfileForm';
import ListUsers from '../listUsers/ListUsers';
import axios from 'axios';

function UserProfile({ user }) {
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
    let usersData = null;
    const defaultUserData = {
        name: '',
        lastName: '',
        typeIdentification: '',
        numberIdentification: '',
        email: '',
        phoneNumber: '',
        address: '',
        pathImage: '',
        userStatus: true,
        roles: ['']
    }

    const loadformData = () => {
        const dataUser = Object.assign({}, defaultUserData, {
            ...user,
            phoneNumber: user.phoneNumber.toString() || '', // Convierte a string si está definido
            roles: user.roles.map(role => role.name) || [''], // Convierte a string si está definido
        });
        return dataUser;
    }

    const [formData, setFormData] = useState(defaultUserData);

    useEffect(() => {
        setTimeout(() => {
            try {
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
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            console.log('nombre de la imgen subida', file);
            const previewUrl = URL.createObjectURL(file);
            setFileUser(file);
            setImage(previewUrl); // Actualizar el estado con la imagen seleccionada
        }
    })

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
    const handleShowListUsers = () => {
        setFormData(defaultUserData);
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
                const storageRef = ref(storageApp, `images/${fileUser.name}`);
                await uploadBytes(storageRef, fileUser).then((res) => {
                    console.log('respuesta', res)
                });
                const url = await getDownloadURL(storageRef);
                usersData = {
                    ...formData,
                    pathImage: url,  
                };
                console.log('Image URL subida:', await getDownloadURL(storageRef));
            } else {
                usersData = formData;
            }


            // setFormData({  pathImage: imageUrl });
            // Maneja el éxito de la carga de la imagen

        } catch (error) {
            console.error('Error uploading image:', error);
            // Maneja el error de la carga de la imagen
        }
    };

    const handleConfirmAction = async () => {

        setShowModal(false);  // Cerramos el modal primero

        if (modalType === 'cancel') {

            // Acción de cancelar
            setFormData((prevState) => {
                setImage((prevStat) => {
                    setIsEditingFormulary(false);
                    return formData.pathImage
                });
                return loadformData();
            });
        } else if (modalType === 'register') {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            };
            await uploadImage(fileUser);
            console.log('usersData', usersData);
            axios.patch(`/users/userUpdate/${user.id}`, usersData, config) // Usa la ruta relativa
                .then(response => {
                    setLoading(false);
                    setIsEditingFormulary(false);
                    setIsEditingButtons(true);
                    setToastMessage(response.data || 'Usuario registrado con éxito');
                    setToastType('success'); // Tipo de mensaje (éxito)
                    setShowToast(true);  // Mostramos el Toast
                    setTimeout(() => {
                        setFormData(defaultUserData);
                        setIsNewComponentVisible(true);  // Mostramos el componente ListUsers               
                    }, 3000);  // Cambiar desp// Retardo adicional para que el Toast sea visible (3.5 segundos en este caso)

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
                                : 'Error al registrar el usuario. Inténtalo e nuevo.';
                        setToastMessage(errorMessage);  // Mostrar el mensaje de error del backend
                        setToastType('danger');  // Tipo de mensaje (error)
                    }
                    setShowToast(true);
                    setLoading(false); // Detenemos el spinner si hay un error
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
                <div className="userProfileCon">
                    <UserProfileForm
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        handleCancel={handleCancel}
                        handleShowListUsers={handleShowListUsers}
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        handleConfirmAction={handleConfirmAction}
                        modalType={modalType}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        image={image}
                        setImage={setImage}
                        isEditing={isEditingFormulary}
                        handleEditClick={handleEditClick}
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

export default UserProfile;