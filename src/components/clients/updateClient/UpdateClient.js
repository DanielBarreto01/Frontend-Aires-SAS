import React, { useEffect, useState } from 'react';
import CustomToast from '../../toastMessage/CustomToast';
import { jwtDecode } from 'jwt-decode';
import { useDropzone } from 'react-dropzone';
import appFirebase from '../../FirebaseConfig.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import UpdateClientForm from './UpdateClienForm.js';
import ListClients from '../listClients/ListClients.js';
import EquipmentClientSelectionList from './equipmentClientSelectionList/EquipmentClientSelectionList.js';
import './UpdateClient.css';
import "../../general.css";


function UpdateClient({ client }) {
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
    let equipmentData = null;

    const loadformData = () => {
        const dataUser = {
            name: client.name || '',
            typeIdentification: client.typeIdentification || '',
            numberIdentification: client.numberIdentification || '',
            address: client.address || '',
            phoneNumber: client.phoneNumber.toString() || '',
            email: client.email || '',
            clientState: client.clientState,
            pathImage: client.pathImage || '',
            clientType: client.clientType ||'',
            lastName:client.lastName || '',
            nameCompany: client.nameCompany ||"",
            numberIdentificationCompany:client.numberIdentificationCompany ||'',
            socialReason:client.socialReason ||'',
            nameLegalRepresentative: client.nameLegalRepresentative ||'',
            phoneNumberLegalRepresentative: client.phoneNumberLegalRepresentative ||'',
            emailLegalRepresentative:client.emailLegalRepresentative ||''

        }
        return dataUser;
    }

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

    const handleShowListlistAssignedEquipment = () => {
        setIsNewComponentVisibleEquipClient(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        setModalType('register');
        setShowModal(true);
    };

    const handleSelectEquipmentaAviable = () => {
        setIsNewComponentVisibleEquipClient(true);
    }
    const handleCleanSelectedEquipments = () => {
        setSelectionAvailableEquipment([]);
    };

    const uploadImage = async () => {
        try {
            if (fileUser !== null) {
                const storageRef = ref(storageApp, `equipments/${fileUser.name}`);
                await uploadBytes(storageRef, fileUser).then((res) => {
                    console.log('respuesta', res)
                });
                console.log('Image uploaded successfully');
                // setImageUrl(await getDownloadURL(storageRef))
                const url = await getDownloadURL(storageRef);
                equipmentData = {
                    name: formData.name,
                    equipmentType: formData.equipmentType,
                    serialNumber: formData.serialNumber,
                    brand: formData.brand,
                    modelNumber: formData.modelNumber,
                    iventoryNumber: formData.iventoryNumber,
                    pathImage: url                 
                };
                console.log('Image URL subida:', await getDownloadURL(storageRef));
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
            isNewComponentVisibleEquipClient?(
            <EquipmentClientSelectionList
                selectionAvailableEquipment={selectionAvailableEquipment}
                setSelectionAvailableEquipment={setSelectionAvailableEquipment}
                setIsNewComponentVisibleEquipClient={setIsNewComponentVisibleEquipClient}
                clientId={client.id}
            />)
            :(
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
                        isEditingButtons = {isEditingButtons}
                        modalType={modalType}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        image={image}
                        setImage={setImage}
                        isEditing={isEditingFormulary}
                        handleEditClick={handleEditClick}
                        handleShowListlistAssignedEquipment = {handleShowListlistAssignedEquipment}
                        columns={columns}
                        records={selectionAvailableEquipment}
                        clientType={client.clientType}
                        handleSelectEquipmentaAviable={handleSelectEquipmentaAviable}
                        handleCleanSelectedEquipments = {handleCleanSelectedEquipments}
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

export default UpdateClient;