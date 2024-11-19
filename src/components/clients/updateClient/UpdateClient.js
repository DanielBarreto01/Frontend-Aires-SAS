import React, { useEffect, useState } from 'react';
import CustomToast from '../../toastMessage/CustomToast';
import { jwtDecode } from 'jwt-decode';
import { useDropzone } from 'react-dropzone';
import appFirebase from '../../FirebaseConfig.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import UpdateClientForm from './UpdateClienForm.js';
import ListClients from '../listClients/ListClients.js';
import EquipmentClientSelectionList from '../equipmentClientList/EquipmentClientList.js';
import EquipmentClientSelection from './equipmentClientSelectionList/EquipmentClientSelectionList.js';
import { updateClient } from "../../../api/ClientService";
import { getEquipmentsIdClient } from "../../../api/EquipmentService";
import { useNavigate, Outlet,useLocation  } from 'react-router-dom';
import "../../general.css";
import './UpdateClient.css';

function UpdateClient() {
    const location = useLocation();
    const navigate = useNavigate();
    const client = location.state?.client;
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
    const [isNewComponentVisibleEquipClient, setIsNewComponentVisibleEquipClient] = useState(false);
    const [selectionAvailableEquipment, setSelectionAvailableEquipment] = useState([]);
    const [selectionEqipmentsClient, setSelectionEqipmentsClient] = useState(false);
    const [selectNewEquipments, setSelectNewEquipments] = useState([]);
    const defaultClientData = {
        name: '',
        typeIdentification: '',
        numberIdentification: '',
        address: '',
        phoneNumber: '',
        email: '',
        clientState: false, // Ajusta según el valor predeterminado deseado
        pathImage: '',
        clientType: '',
        lastName: '',
        nameCompany: '',
        numberIdentificationCompany: '',
        socialReason: '',
        nameLegalRepresentative: '',
        phoneNumberLegalRepresentative: '',
        emailLegalRepresentative: '',
        clientType: '',
        idsEquipments: []
    };

    const loadformData = () => {
        const clientData = Object.assign({}, defaultClientData, {
            ...client,
            phoneNumber: client.phoneNumber?.toString() || '', // Convierte a string si está definido
        });
        return clientData;
    }

    const [formData, setFormData] = useState(defaultClientData);

    useEffect(() => {
        try {
            !client ? navigate('/admin/clients', { state: { key: Date.now() } }) : setFormData(loadformData());
            fetchEquipments();
            if (localStorage.getItem('authToken') === null && jwtDecode(localStorage.getItem('authToken')).exp * 1000 < Date.now()) { // && jwtDecode(token).exp*1000 >  Date.now()
                localStorage.removeItem('authToken');
                setIsTokenChecked(false);
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error checking token:', error);
        }
    }, []);

    const fetchEquipments = async () => {
        let equipments = [];
        try {
            equipments = await getEquipmentsIdClient(client.id, localStorage.getItem('authToken'));
            setSelectionAvailableEquipment(equipments);
        } catch (error) {
            console.error("Error fetching equipments:", error);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
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

    const handleShowListClients = () => {
        try {
            if (JSON.stringify(loadformData()) !== JSON.stringify(formData) || (image !== null && image !== loadformData().pathImage)) {
                setShowModal(true);
                setModalType('cancel');
            } else {
                navigate('/admin/clients', { state: { key: Date.now() } });
            }
        } catch (error) {
            console.error('Error canceling:', error);
            navigate('/admin/clients', { state: { key: Date.now() } });
        }

    };

    const handleCancel = () => {
        setIsEditingFormulary(false);
    }

    const handleEditClick = (event) => {
        event.preventDefault();
        setIsEditingFormulary(true);
    }
    const handleShowListEquipment = () => {
        navigate('/admin/clients');
    };

    const handleShowListlistAssignedEquipment = () => {
        //navigate('/admin/clients/update/equipmentClientSelectionList');
        setSelectionEqipmentsClient(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalType('register');
        setShowModal(true);
    };

    const handleSelectEquipmentaAviable = () => {
        setIsNewComponentVisibleEquipClient(true);
    }
    const handleCleanSelectedEquipments = () => {
        setSelectionAvailableEquipment([]);
    };

    const mergedList = [...selectionAvailableEquipment, ...selectNewEquipments].reduce((acc, current) => {
        if (!acc.find(item => item.id === current.id)) {
            acc.push(current);
        }
        return acc;
    }, []);

    const uploadImage = async () => {
        let dataClient = formData;
        try {
            if (fileUser !== null) {

                const storageRef = ref(storageApp, `equipments/${fileUser.name}`);
                await uploadBytes(storageRef, fileUser).then((res) => {
                    console.log('respuesta', res)
                });
                // setImageUrl(await getDownloadURL(storageRef))
                const url = await getDownloadURL(storageRef);
                dataClient = {
                    ...dataClient,  // Copia el resto de las propiedades
                    pathImage: url,
                    idsEquipments: selectionAvailableEquipment.map(equipment => equipment.id)
                }
            } else {
                dataClient = {
                    ...dataClient,  // Copia el resto de las propiedades
                    idsEquipments: selectionAvailableEquipment.map(equipment => equipment.id)
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
        return dataClient;
    };

    const handleConfirmAction = async () => {
        setShowModal(false);  // Cerramos el modal primero
        if (modalType === 'cancel') {
            setFormData((prevState) => {
                setImage((prevStat) => {
                    setSelectionAvailableEquipment([]);
                    setSelectNewEquipments([]);
                    setFormData(defaultClientData)
                    //navigate('/admin/clients', { state: { key: Date.now() } });
                    return formData.pathImage
                });
                return loadformData();
            });
        } else if (modalType === 'register') {
            setLoading(true);
            const dataClient = await uploadImage(fileUser);
           
            try {   
                const response = await updateClient(client.id, dataClient, localStorage.getItem('authToken'));
                if (response.status === 200) {
                    setToastType('success');
                    setToastMessage('Cliente actualizado correctamente');
                    setShowToast(true);
                    setLoading(false);
                    setIsEditingButtons(true);
                    setIsEditingFormulary(false);
                    setTimeout(() => {
                        setSelectionAvailableEquipment([]);
                        setSelectNewEquipments([]);
                        setFormData(defaultClientData)
                        navigate('/admin/clients', { state: { key: Date.now() } });
                    }, 3000);
                }

            } catch (error) {
                console.error('Error updating client:', error);
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
        // Retardo de 500 ms para mostrar el spinner después de cerrar el modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal sin realizar acción
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

    if (!isTokenChecked) {
        return null;
    }

    return (
        isNewComponentVisible ? (
            <ListClients />) :
            isNewComponentVisibleEquipClient ? (
                <EquipmentClientSelectionList
                    selectionAvailableEquipment={selectionAvailableEquipment}
                    setSelectionAvailableEquipment={setSelectionAvailableEquipment}
                    setIsNewComponentVisibleEquipClient={setIsNewComponentVisibleEquipClient}
                    clientId = {client.id}
                 />): selectionEqipmentsClient ? (<EquipmentClientSelection
                    // selectNewEquipments={selectNewEquipments}
                    // setSelectNewEquipments={setSelectNewEquipments}
                    setSelectionEqipmentsClient={setSelectionEqipmentsClient}
                    client={client}
                />) 
                : (
                <>
                    <div className="client-update-conatiner">
                        <UpdateClientForm
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
                            handleShowListlistAssignedEquipment={handleShowListlistAssignedEquipment}
                            columns={columns}
                            records={selectionAvailableEquipment}
                            clientType={client ? client.clientType : ''}
                            handleSelectEquipmentaAviable={handleSelectEquipmentaAviable}
                            handleCleanSelectedEquipments={handleCleanSelectedEquipments}
                            handleShowListClients={handleShowListClients}
                        />
                    </div>
                    <CustomToast
                        showToast={showToast}
                        setShowToast={setShowToast}
                        toastMessage={toastMessage}
                        toastType={toastType}
                    />
                   <Outlet/>
                </>
                
            )
           
    );
}


export default UpdateClient;