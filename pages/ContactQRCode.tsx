import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, PermissionsAndroid, Platform,TouchableOpacity, Dimensions, Alert, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Contacts from 'react-native-contacts';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import QRScanner from "./QRScanner";
const clr1 = "mediumseagreen";
    
const ContactQRCode = () => {
    const [error, setError] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [showQRCODE, setShowQRCODE] = useState(false);
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
  
        // Open the modal for QRCODE
        const openQRModal = () => {
          setShowQRCODE(true);
        };
      
        // Close the modal for QRCODE
        const closeQRModal = () => {
          setShowQRCODE(false);
        };
  
    // Open the modal for QRCODE SCANNER 
    const openQRScanner = () => {
      setShowQR(true);
    };
  
    // Close the modal for QRCODE SCANNER
    const closeQRscanner = () => {
      setShowQR(false);
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
  
    useEffect(() => {
      const requestPermissions = async () => {
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
          fetchContactInfo();
        } catch (err) {
          console.error(err);
          setError('Error requesting permissions.');
        }
      };
   
      requestPermissions();
    });
  
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
    
    return (
      <View style={styles.container}>
        {/* QR Code Icon */}
        {/* <TouchableOpacity onPress={openQRModal} style={styles.iconContainer}>
           <FontAwesome name="qrcode" size={50} color="purple" />
          <Text style={styles.iconText}>Show QR</Text>
        </TouchableOpacity> */}

        {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={openQRModal} style={styles.appBarIcon}>
          <FontAwesome name="qrcode" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openQRScanner} style={styles.appBarIcon}>
          <MaterialCommunityIcons name="qrcode-scan" size={30} color="white" />
        </TouchableOpacity>
      </View>
  
        {/* Modal for Full-Screen QR Code */}
        <Modal visible={showQRCODE} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.qrWrapper}>
              {/* Display QR Code */}
              {contactInfo && (
                <QRCode
                  value={JSON.stringify(contactInfo)} // Convert the object to a string
                  size={200}
                />
              )}
              <TouchableOpacity onPress={closeQRModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
         {/* QR Code Icon */}
         {/* <TouchableOpacity onPress={openQRscanner} style={styles.iconContainer}>
          <MaterialCommunityIcons name="qrcode-scan" size={50} color="purple" />
          <Text style={styles.iconText}>Scan QR</Text>
        </TouchableOpacity> */}
  
         {/* QR Scanner Modal */}
          <Modal visible={showQR} transparent={false} animationType="slide">
            <QRScanner
              onRead={(qrText : any) => {
                setShowQR(false); // Close the modal
                onQrRead(qrText); // Handle the QR text
              }}
              onClose={closeQRscanner} // Close modal when back is pressed
            />
          </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: 10
    },
    appBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: clr1,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    appBarIcon: {
      padding: 10,
    },
    error: {
      color: 'red',
      textAlign: 'center',
    },
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777'
    },
    textBold: {
      fontWeight: '500',
      color: '#000'
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
      padding: 16
    },
    page: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    btn: {
      backgroundColor: "transparent",
      alignItems: "center",
      borderRadius: 10,
      paddingVertical: "3%",
      width: "50%",
      borderWidth: 2,
      borderColor: clr1,
    },
    btnText: {
      color: clr1,
    },
  
    // ========qrcode-icon===========
  
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    iconText: {
      fontSize: 16,
      color: clr1,
      marginTop: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    qrWrapper: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    contactText: {
      fontSize: 16,
      color: "black",
      marginTop: 10,
      textAlign: "center",
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: clr1,
      padding: 10,
      borderRadius: 5,
    },
    closeButtonText: {
      color: "white",
      fontSize: 16,
    },
  });
  
  export default ContactQRCode;