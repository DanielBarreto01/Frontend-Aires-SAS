import React from 'react';
import { useEffect, useState } from 'react';
import CustomToast from '../../toastMessage/CustomToast.js';
import RegisterClientForm from './RegisterClientForm.js';
import { jwtDecode } from 'jwt-decode';
import { useDropzone } from 'react-dropzone';
import appFirebase from '../../FirebaseConfig.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import EquipmentUserList from '../equipmentClientList/EquipmentClientList.js';
import {createClientNatural, createClientJuridical} from "../../../api/ClientService.js";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

function RegisterClient() {  //{ clientType }

    const location = useLocation();
    const navigate = useNavigate();
    const clientType = location.state?.clientType;
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
    const [personaType, setPersonaType] = useState('');
    const [isNewComponentVisibleEquipClient, setIsNewComponentVisibleEquipClient] = useState(false);
    const [selectionAvailableEquipment, setSelectionAvailableEquipment] = useState([]);
    const initialFormData = {
        phoneNumber: '',
        address: '',
        pathImage: '',
        name: '',
        lastName: '',
        typeIdentification: '',
        numberIdentification: '',
        nameCompany: '',
        numberIdentificationCompany: '',
        socialReason: '',
        nameLegalRepresentative: '',
        phoneNumberLegalRepresentative: '',
        emailLegalRepresentative: '',
        idsEquipments: []
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        console.log('entra al useeffect');
        setTimeout(() => {
            try {

                !clientType ? navigate('/admin/clients', { state: { key: Date.now() } }) :   setIsTokenChecked(true); ;

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

    const handlePersonaTypeChange = (e) => {
        const type = e.target.value;
        setPersonaType(type);
        setFormData(initialFormData); // Restablece los datos del formulario
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*', 
        onDropAccepted: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file && file.type.startsWith('image/')) {
                console.log('Archivo aceptado:', file);
                const previewUrl = URL.createObjectURL(file);
                setFileUser(file);
                setImage(previewUrl); // Actualizar el estado con la imagen seleccionada
            } else {
                setToastMessage('Por favor, selecciona solo archivos de imagen.');
                setToastType('danger');
                setShowToast(true);
            }
        },
        maxFiles: 1,
        multiple: false,

    });


    const handleCancel = () => {
        
        setShowModal(true);
       setModalType('cancel'); 
    };
    const handleCleanSelectedEquipments = () => {
        setSelectionAvailableEquipment([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalType('register');
        setShowModal(true);
    };
    const handleSelectEquipmentaAviable = () => {
        setIsNewComponentVisibleEquipClient(true);
    }

   

    const uploadImage = async () => {
        let dataUser = formData;
        try {
            if (fileUser !== null) {
                const storageRef = ref(storageApp, `clients/${fileUser.name}`);
                await uploadBytes(storageRef, fileUser).then((res) => {
                    console.log('respuesta', res)
                });
                console.log('Image uploaded successfully');
                const url = await getDownloadURL(storageRef);
                dataUser = {
                    ...dataUser,  // Copia el resto de las propiedades
                    pathImage: url,
                    idsEquipments: selectionAvailableEquipment.map(equipment => equipment.id)
                }
                console.log('Image URL subida:', await getDownloadURL(storageRef));

            } else {
                console.log('No image selected');
                dataUser = {
                    ...dataUser,
                    pathImage: 'https://firebasestorage.googleapis.com/v0/b/aires-acondiconados.appspot.com/o/clients%2Fedificios-modernos.jpg?alt=media&token=8f8e8f17-b86e-47ea-884f-42ce940af314',
                    idsEquipments: selectionAvailableEquipment.map(equipment => equipment.id)
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
            setLoading(false); 
            setTimeout(() => {
                setFormData(initialFormData); 
                navigate('/admin/clients', { state: { key: Date.now() } }); // Mostramos el componente ListUsers
            }, 200);
        } else if (modalType === 'register') {
            const dataUser = await uploadImage();      
            try {
                let response;
                if(clientType === 'natural'){
                    response = await createClientNatural(dataUser, localStorage.getItem('authToken'));
                }else{
                    response = await createClientJuridical(dataUser, localStorage.getItem('authToken'));
                }
                console.log('response status', response.status);
                if (response.status === 200) {
                    setLoading(false)
                    setToastMessage("Cliente registrado exitosamente");
                    setToastType('success'); // Tipo de mensaje (éxito)
                    setShowToast(true);
                    setFormData(initialFormData);
                    setIsEditingButtons(true);
                    setTimeout(() => {
                        navigate('/admin/clients', { state: { key: Date.now() } });
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

    const columns = [
        {
            name: 'Equipo',
            selector: row => row.pathImage, // Suponiendo que 'image' es el campo que contiene la URL de la imagen
            cell: row => (
                <img
                    src={row.pathImage} // Suponiendo que 'image' es el campo que contiene la URL de la imagen
                    alt="imagen"
                    style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '80px' }} // Ajusta el tamaño según sea necesario
                />
            ),
            center: true.toString()
        },
        {
            name: "Marca",
            selector: row => row.brand,
            sortable: true,
            center: true.toString()
        },

        {
            name: "Modelo",
            selector: row => row.modelNumber,
            sortable: true,
            center: true.toString()
        },
        {
            name: "No. de serie",
            selector: row => row.serialNumber,
            sortable: true,
            center: true.toString()
        },
    ];

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal sin realizar acción
    };


    if (!isTokenChecked) {
        return null;
    }

    return (
         isNewComponentVisibleEquipClient ? (
                <EquipmentUserList
                    selectionAvailableEquipment={selectionAvailableEquipment}
                    setSelectionAvailableEquipment={setSelectionAvailableEquipment}
                    setIsNewComponentVisibleEquipClient={setIsNewComponentVisibleEquipClient}
                    clientId = {null}
                />) : (
            <>
                <div className='client-update-conatiner'>
                    <RegisterClientForm
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        handleCancel={handleCancel}
                        personaType={personaType}
                        handlePersonaTypeChange={handlePersonaTypeChange}
                        isEditingButtons={isEditingButtons}
                        showModal={showModal}
                        handleConfirmAction={handleConfirmAction}
                        handleCloseModal={handleCloseModal}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        image={image}
                        clientType={clientType}
                        columns={columns}
                        records={selectionAvailableEquipment}
                        handleSelectEquipmentaAviable={handleSelectEquipmentaAviable}
                        handleCleanSelectedEquipments={handleCleanSelectedEquipments}
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

export default RegisterClient;