import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import QRCode from 'react-native-qrcode-svg';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QRScanner from './QRScanner';
import ClickToContacts from './ClickToContacts';

const clr1 = 'mediumseagreen';

// Define types for navigation params
type RootStackParamList = {
  HomeStack: {
    openQRModal?: boolean;
    openQRScanner?: boolean;
  };
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeStack'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeStack'>;

interface HomeScreenProps {
    route: HomeScreenRouteProp;
    navigation: HomeScreenNavigationProp;
  }

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
    const [error, setError] = useState('');
    const [showQRCODE, setShowQRCODE] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [contactInfo, setContactInfo] = useState<{
          familyName: string;
          givenName: string;
          displayName: string;
          phoneNumber: string;
          email: string;
          address: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
          };
        } | null>(null); 
  
    const openQRModal = () => setShowQRCODE(true);
    const closeQRModal = () => setShowQRCODE(false);
  
    const openQRScanner = () => setShowQR(true);
    const closeQRScanner = () => setShowQR(false);
  
    useEffect(() => {
          const requestContactPermissions = async () => {
            try {
              if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                  {
                    title: 'Contacts Permission',
                    message: 'This app requires access to your contacts.',
                    buttonPositive: 'OK',
                  }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                  setError('Permission to access contacts was denied.');
                  return;
                }
              }
            } catch (err) {
              console.error(err);
              setError('Error requesting permissions.');
            }
          };
       
          const requestCameraPermissions = async () => {
            try {
              if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.CAMERA,
                  {
                    title: 'CAMERA Permission',
                    message: 'This app requires access to your camera.',
                    buttonPositive: 'OK',
                  }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                  setError('Permission to access camera was denied.');
                  return;
                }
              }
              fetchContactInfo();
            } catch (err) {
              console.error(err);
              setError('Error requesting permissions.');
            }
          };

          const requestPermissions = async () => {
            await requestContactPermissions();
            await requestCameraPermissions();
            fetchContactInfo(); // Only fetch if both permissions are granted
          };
       
          requestPermissions();
        });
  
    useEffect(() => {
      if (route.params?.openQRModal) {
        setShowQRCODE(true);
        navigation.setParams({ openQRModal: false }); // Reset the param
      }
      if (route.params?.openQRScanner) {
        setShowQR(true);
        navigation.setParams({ openQRScanner: false }); // Reset the param
      }
    }, [route.params]);
  
     const fetchContactInfo = async () => {
            try {
              const contacts = await Contacts.getAll();
              const contact = contacts[0];
              if (contact) {
                const contactInfo = {
                  familyName: contact.familyName || '',
                  givenName: contact.givenName || '',
                  displayName: contact.displayName || '',
                  phoneNumber: contact.phoneNumbers?.[0]?.number || '',
                  email: contact.emailAddresses?.[0]?.email || '',
                  address: {
                    street: contact.postalAddresses?.[0]?.street || '',
                    city: contact.postalAddresses?.[0]?.city || '',
                    state: contact.postalAddresses?.[0]?.state || '',
                    postalCode: contact.postalAddresses?.[0]?.postCode || '',
                    country: contact.postalAddresses?.[0]?.country || '',
                  },
                };
                setContactInfo(contactInfo); // Store the object directly
              } else {
                setError('No contacts found.');
              }
            } catch (err) {
              console.error(err);
              setError('Error fetching contacts.');
            }
          };
  
          const onQrRead = async(qrtext : any) => {
            console.log("initial",qrtext);
        
             // Validate the scanned QR text
          if (qrtext === null) {
            console.warn("No valid QR data found. Skipping request.");
            return;
          }
        
            setQrCode(qrtext);
            setShowQR(false);
        
            try {
              // Convert any data to plain text
            const plainText = typeof qrtext === 'object' ? JSON.stringify(qrtext) : String(qrtext);
        
            console.log('Sending to Backend:', { body: plainText, contentType: 'text/plain' });
          
              const response = await fetch('https://backend-format-65dvi3sjw-nikithanrajs-projects.vercel.app/format-qr', {
                method: 'POST',
                headers: {
                  'Content-Type': 'text/plain',
                },
                body: plainText,
              });
          
              if (response.ok) {
                const { formattedData } = await response.json();
                console.log('Formatted Data:', formattedData);
         
                // Process the received data
                handleContactForm(JSON.parse(formattedData)); // Pass formatted data to the contact form
              } else {
                const errorMessage = await response.text();
                console.error('Error formatting QR text:', errorMessage);
              }
            } catch (error) {
              console.error('Error sending QR text:', error);
            }
          };
  
          const handleContactForm = (contactDetails : any) => {
                try {
                  // Validate required fields
                  if (!contactDetails.name || !contactDetails.phone) {
                    Alert.alert('Missing Information', 'Both Name and Phone number are required to save a contact.');
                    return;
                  }
              
                  const nameParts = contactDetails.name.split(' ');
                  const firstName = nameParts[0];
                  const lastName = nameParts.slice(1).join(' ');
              
                  const additionalInfo = Object.entries(contactDetails)
                    .filter(([key]) => !['name', 'phone', 'email', 'company_name', 'address', 'website'].includes(key))
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
              
                  // Prepare the contact data
                  const contact = {
                    displayName: contactDetails.name,
                    firstName,
                    lastName,
                    phoneNumbers: [], // Initialize as an empty array
              
                    // Check for existing phone numbers
                    ...(contactDetails.phone && Object.keys(contactDetails.phone).length > 0 && {
                      phoneNumbers: [
                        ...(contactDetails.phone.mobile ? [{ label: 'mobile', number: contactDetails.phone.mobile }] : []),
                        ...(contactDetails.phone.office ? [{ label: 'office', number: contactDetails.phone.office }] : []),
                        ...(contactDetails.phone.work ? [{ label: 'work', number: contactDetails.phone.work }] : []),
                        ...(contactDetails.phone.fax ? [{ label: 'work fax', number: contactDetails.phone.fax }] : []),
                        // Add raw number with 'work' label if it's not already included
                        ...(typeof contactDetails.phone === 'string' ? [{ label: 'work', number: contactDetails.phone }] : []),
                      ],
                    }),
              
                    emailAddresses: contactDetails.email ? [{ label: 'work', email: contactDetails.email }] : [],
                    company: contactDetails.company_name || 'Not Specified',
                    postalAddresses: contactDetails.address
                      ? [
                          {
                            label: 'work',
                            formattedAddress: contactDetails.address || '', // Full address
                          },
                        ]
                      : [],
                    urlAddresses: contactDetails.website ? [{ label: 'work', url: contactDetails.website }] : [],
                    note: additionalInfo || '',
                  };
              
                  // Open the contact form with prefilled data
                  Contacts.openContactForm(contact)
                    .then((savedContact) => {
                      if (savedContact) {
                        Alert.alert('Success', 'Contact saved successfully!');
                      }
                    })
                    .catch((error) => {
                      console.error('Error opening contact form:', error);
                      Alert.alert('Error', 'There was an error opening the contact form.');
                    });
                } catch (error) {
                  console.error('Error handling contact form:', error);
                  Alert.alert('Error', 'There was an error processing the contact.');
                }
              };
  
    return (
      <View style={styles.container}>
        {/* <Text>Welcome to the Contact QR App</Text> */}
        <ClickToContacts/>
  
        {/* Modal for QR Code */}
        <Modal visible={showQRCODE} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.qrWrapper}>
              {contactInfo && <QRCode value={JSON.stringify(contactInfo)} size={200} />}
              <TouchableOpacity onPress={closeQRModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
        {/* Modal for QR Scanner */}
        <Modal visible={showQR} transparent={false} animationType="slide">
          <QRScanner
            onRead={(qrText: any) => {
              setShowQR(false); // Close modal
              console.log('Scanned QR Text:', qrText); // Process QR text
              onQrRead(qrText);
            }}
            onClose={closeQRScanner}
          />
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    qrWrapper: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: clr1,
      padding: 10,
      borderRadius: 5,
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });

  export default HomeScreen;