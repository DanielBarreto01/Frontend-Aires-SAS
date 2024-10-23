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
    const [isEditingFormulary, setIsEditingFormulary] = useState(false);
    const storageApp = getStorage(appFirebase);
    let usersData = null;

    

    const loadformData =() => {
        const dataUser ={
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
        }
        return dataUser;
    }
    
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
            //let forUser = formData;
            console.log('image format', image);
            if (JSON.stringify(loadformData()) !== JSON.stringify(formData) || (image !== null && image !== loadformData().pathImage)) {
                // if (JSON.stringify(loadformData()) !== JSON.stringify(formData) || image !== null) {
                setShowModal(true);
                setModalType('cancel');

                //forUser = loadformData();   
                // setFormData(loadformData());
                // console.log('forUser', forUser);
                //  setModalType('cancel');
                //  setShowModal(true);
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
        setIsNewComponentVisible(true);
     // Definimos el tipo de acción como registrar
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
            } else{
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
            //     setLoading(false);
            //     setImage(formData.pathImage); 
            //    // const u = loadformData();
            //     setFormData(loadformData());
            //     setIsEditingFormulary(false);
                
                
            //     setLoading(false);  // Detenemos el spinner
                //  setIsNewComponentVisible(true);  // Mostramos el componente ListUsers
            // Simulamos una espera de 2 segundos
        } else if (modalType === 'register') {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            };
            // Acción de registrar - enviar datos al backend

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
            <div className="principal">
                <div className="userProfileCon">
                    <UserProfileForm
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        selectedImage={selectedImage}
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

export default UserProfile;