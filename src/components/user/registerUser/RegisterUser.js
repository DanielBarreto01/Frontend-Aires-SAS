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
    const [selectedImage, setSelectedImage] = useState(null);
    const storageApp = getStorage(appFirebase);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        typeIdentification: '',
        numberIdentification: '',
        email: '',
        phoneNumber: '',
        address: '',
        pathImage: '',
        roles: ['']
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
                const storageRef = ref(storageApp, `images/${fileUser.name}`);
                await uploadBytes(storageRef, fileUser).then((res) => {
                    console.log('respuesta', res)
                });
                console.log('Image uploaded successfully');
                // setImageUrl(await getDownloadURL(storageRef))
                const url = await getDownloadURL(storageRef);
                dataUser = {
                    ...dataUser,  // Copia el resto de las propiedades
                    pathImage: url
                }
                // usersData = {
                //     name: formData.name,
                //     lastName: formData.lastName,
                //     typeIdentification: formData.typeIdentification,
                //     numberIdentification: formData.numberIdentification,
                //     email: formData.email,
                //     phoneNumber: formData.phoneNumber.toString(),
                //     address: formData.address,
                //     pathImage: url,
                //     userStatus: formData.userStatus,
                //     roles: formData.roles
                // };
                console.log('Image URL subida:', await getDownloadURL(storageRef));

            } else {
                console.log('No image selected');
                dataUser = {
                    ...dataUser,
                    pathImage: 'https://firebasestorage.googleapis.com/v0/b/aires-acondiconados.appspot.com/o/images%2Fuser.png?alt=media&token=6428ebe4-d22c-4954-99fa-8e51de3172d0'
                }
                // usersData = formData;
            }


            // setFormData({  pathImage: imageUrl });
            // Maneja el éxito de la carga de la imagen

        } catch (error) {
            console.error('Error uploading image:', error);
            // Maneja el error de la carga de la imagen
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
                    lastName: '',
                    typeIdentification: '',
                    numberIdentification: '',
                    email: '',
                    phoneNumber: '',
                    address: '',
                    pathImage: '',
                    roles: ['']
                });
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
            const dataUser = await uploadImage();
            console.log('Form Data con imagen:', dataUser);
            // Acción de registrar - enviar datos al backend
            console.log('Registrando usuario:', formData);
            axios.post('/users/create', dataUser, config) // Usa la ruta relativa
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
                        roles: [''],
                    });
                    setLoading(false);
                    setTimeout(() => {
                        setIsNewComponentVisible(true);  // Mostramos el componente ListUsers

                    }, 3000);  // Cambiar desp// Retardo adicional para que el Toast sea visible (3.5 segundos en este caso)
                    setLoading(true);

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
                                : 'Error al registrar el usuario. Inténtalo de nuevo.';
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
            <div className="principal">
                <div className='container'>
                    <RegisterUserForm
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

export default RegisterUser;