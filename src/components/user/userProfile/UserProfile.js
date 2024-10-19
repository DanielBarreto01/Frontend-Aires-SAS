import React, { useEffect, useState } from 'react';
import styles from './UserProfile.css';
import CustomToast from '../../toastMessage/CustomToast';
import { jwtDecode } from 'jwt-decode';
import { useDropzone } from 'react-dropzone';
import appFirebase from '../../FirebaseConfig.js';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import UserProfileForm from './UserProfileForm';
import ListUsers from '../listUsers/ListUsers';
import userImage from './user.png';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";

import axios from 'axios';


//import { toast } from 'sonner'
function UserProfile({ user }) {
    const [isNewComponentVisible, setIsNewComponentVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);  // Estado para mostrar el modal
    const [modalType, setModalType] = useState('');     // Estado para controlar el tipo de acción (cancelar o registrar)
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const [isTokenChecked, setIsTokenChecked] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [image, setImage] = useState(null);
    const [fileUser, setFileUser] = useState(null); // Para mostrar el progreso de la carga
    const [imageUrl, setImageUrl] = useState('');
    const dbApp = getFirestore(appFirebase);
    const storageApp = getStorage(appFirebase);
    let usersData = null;

    const [formData, setFormData] = useState({
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
    });

    useEffect(() => {
        console.log('entra al useeffect', user);
        setTimeout(() => {
            setFormData(null);
            setFormData({
                name: user.name || '',
                lastName: user.lastName || '',
                typeIdentification: user.typeIdentification || '',
                numberIdentification: user.numberIdentification || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber.toString() || '',
                address: user.address || '',
                pathImage: user.pathImage || '',
                userStatus: user.userStatus,
                roles: user.roles.map(role => role.name) || ['']
            });
            const token = localStorage.getItem('authToken');
            if (token === null && jwtDecode(token).exp * 1000 < Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                localStorage.removeItem('authToken');
                setIsTokenChecked(false);
                console.log('entra al token ', token);
                window.location.href = '/login';
            }
        }, 200);
        return () => clearTimeout();
    }, []);

    // carga de archivos
    // const handleImageDrop = (acceptedFiles) => {
    //     const file = acceptedFiles[0];
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setImage(reader.result); // Cargar la imagen seleccionada por el usuario
    //     };
    //     if (file) {
    //         reader.readAsDataURL(file);
    //     }
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
        try {
            if (fileUser !== null) {
                const storageRef = ref(storageApp, `images/${fileUser.name}`);
                await uploadBytes(storageRef, fileUser).then((res) => {
                    console.log('respuesta', res)
                });
                console.log('Image uploaded successfully');
                // setImageUrl(await getDownloadURL(storageRef))
                const url = await getDownloadURL(storageRef);
                usersData = {
                    name: formData.name,
                    lastName: formData.lastName,
                    typeIdentification: formData.typeIdentification,
                    numberIdentification: formData.numberIdentification,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber.toString(),
                    address: formData.address,
                    pathImage: url,
                    userStatus: formData.userStatus,
                    roles: formData.roles
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
        setLoading(true);
        if (modalType === 'cancel') {
            // Acción de cancelar
            setTimeout(() => {
                setFormData(null);
                setLoading(false);  // Detenemos el spinner
                setIsNewComponentVisible(true);  // Mostramos el componente ListUsers
            }, 200); // Simulamos una espera de 2 segundos
        } else if (modalType === 'register') {

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            };
            // Acción de registrar - enviar datos al backend
            console.log('Form Data:', formData);
            console.log('Image:', image);



            console.log('Imagen nueva:', image);

            await uploadImage(fileUser);
            console.log('Form Data con imagen:', formData);



            axios.patch(`${process.env.REACT_APP_BCKEND}/users/userUpdate/${user.id}`, usersData, config,)
                .then(response => {
                    setLoading(true)
                    setToastMessage(response.data || 'Usuario registrado con éxito');
                    setToastType('success'); // Tipo de mensaje (éxito)
                    console.log('desactivar botones', loading);
                    setShowToast(true);  // Mostramos el Toast
                    setFormData({
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
                    });
                    console.log(formData);


                    setTimeout(() => {
                        setIsNewComponentVisible(true);  // Mostramos el componente ListUsers
                        setLoading(false);
                    }, 3000);  // Cambiar desp// Retardo adicional para que el Toast sea visible (3.5 segundos en este caso)


                })
                .catch(error => {
                    console.error('Error registering user:', error);
                    // Verificar si error.response existe
                    if (!error.response) {
                        // Esto significa que no hubo respuesta del servidor (posiblemente desconectado o problemas de red)
                        setToastMessage('No se puede conectar al servidor. Verifica tu conexión o intenta más tarde.');
                        setToastType('danger');
                    } else {
                        // Si el error tiene respuesta, manejar los errores del backend
                        const errorMessage =
                            error.response.data && error.response.data
                                ? error.response.data
                                : 'Error al registrar el usuario. Inténtalo e nuevo.';
                        setToastMessage(errorMessage);  // Mostrar el mensaje de error del backend
                        setToastType('danger');  // Tipo de mensaje (error)
                    }
                    // Mostrar el toast y detener el spinner
                    setShowToast(true);
                    setLoading(false); // Detenemos el spinner si hay un error
                });
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
            <ListUsers />) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div className={`principal ${styles}`}>
                    <div className="userProfileCon col-md-12 row justify-content-center d-flex">

                        <UserProfileForm
                            formData={formData}
                            setFormData={setFormData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            selectedImage={selectedImage}
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

                        />
                    </div>
                </div>
                <CustomToast
                    showToast={showToast}
                    setShowToast={setShowToast}
                    toastMessage={toastMessage}
                    toastType={toastType}
                />
            </div>

        )

    );
}

export default UserProfile;