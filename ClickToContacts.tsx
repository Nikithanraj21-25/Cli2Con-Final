import React, { useEffect, useState } from 'react';
import { SafeAreaView, Pressable, Text, Image, View, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Replaced expo/vector-icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Replaced expo-image-picker

// Define the type for your saved data
type PostalAddress = {
  street: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
  pobox?: string;
  neighborhood?: string;
  region?: string; 
  postCode?: string; 
  [key: string]: any;
};

export default function ClickToContacts() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [previousImageUri, setPreviousImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTextExtracted, setIsTextExtracted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

   useEffect(() => {
    const loadPreviousImage = async () => {
      const savedImageUri = await AsyncStorage.getItem('previousImageUri');
      if (savedImageUri) {
        setPreviousImageUri(savedImageUri);
      } else {
        requestPermissions();
      }
    };

    loadPreviousImage();
  }, []);

  useEffect(() => {
    if (extractedText && isTextExtracted) {
      saveContact();
      setExtractedText("");
      setIsTextExtracted(false);
    }
  }, [extractedText, isTextExtracted]);

  const saveContact = async () => {
    if (!isTextExtracted) {
      Alert.alert('No extracted text', 'Please upload an image and extract text before saving.');
      return;
    }

    if (isSaving) {
      Alert.alert('Saving in progress', 'Please wait until the current save operation is completed.');
      return;
    }

    setIsSaving(true);

    try {
    const hasPermission = await requestPermissions(); // Request permissions
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Access to contacts is required to save.');
      setIsSaving(false);
      return;
    }

      const contactDetails = JSON.parse(extractedText);

      if (!contactDetails.name || !contactDetails.phone) {
        Alert.alert('Missing Information', 'Both Name and Phone number are required to save a contact.');
        setIsSaving(false);
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
            ...(typeof contactDetails.phone === 'string' ? [{ label: 'work', number: contactDetails.phone }] : [])
        ]
    }),

        emailAddresses: contactDetails.email ? [{ label: 'work', email: contactDetails.email }] : [],
        company: contactDetails.company_name || 'Not Specified',
        postalAddresses: contactDetails.address
        ? [{
            label: 'work',
            street: '', 
            city: '',  
            state: '',                 
            country: '',                
            postalCode: '',                   
            formattedAddress: contactDetails.address || '',       
            pobox: '',                    
            neighborhood: '',          
            region: '',                      
            postCode: ''        
          }]
        : [],
        urlAddresses: contactDetails.website ? [{ label: 'work', url: contactDetails.website }] : [],
        note: additionalInfo || '',
      };
     Contacts.openContactForm(contact)
     .then((contact) => {
       if (contact) {
         Alert.alert('Success', 'Contact saved successfully!');
       }
     })
     .catch((error) => {
       console.error('Error opening contact form:', error);
       Alert.alert('Error', 'There was an error opening the contact form.');
     });

 } catch (error) {
   console.error('Error saving contact:', error);
   Alert.alert('Error', 'There was an error processing the contact.');
 } finally {
   setIsSaving(false);
 }
  };
  

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const permission = await Contacts.checkPermission();
      console.log("Permission status:", permission);
  
      if (permission === 'undefined' || permission === 'denied') {
        const request = await Contacts.requestPermission();
        if (request === 'authorized') {
          return true;
        } else {
          Alert.alert(
            'Permission Denied',
            'Access to contacts is required to save contacts.',
          );
          return false;
        }
      } else if (permission === 'authorized') {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking or requesting permissions:', error);
      Alert.alert('Error', 'An error occurred while requesting permissions.');
      return false;
    }
  };
  

  const chooseImageFromGallery = async () => {
    await requestPermissions();
    const options: CameraOptions = {
      mediaType: 'photo', // Explicitly assign the correct type
      quality: 1,
    };
  
    const result: ImagePickerResponse = await launchImageLibrary(options);
  
    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0]?.uri; // Use optional chaining to avoid undefined
      if (uri) {
        setPreviousImageUri(imageUri || null); // Ensure no undefined value is assigned
        setImageUri(uri);
  
        try {
          await AsyncStorage.setItem('previousImageUri', uri);
        } catch (error) {
          console.error('Error saving image to AsyncStorage:', error);
        }
  
        toggleExpand();
        uploadImage(uri);
      }
    }
  };

  const takePhoto = async () => {
    await requestPermissions();
    const options: CameraOptions = {
      mediaType: 'photo', // Explicitly assign the correct type
      quality: 1,
    };
  
    const result: ImagePickerResponse = await launchCamera(options);
  
    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0]?.uri; // Use optional chaining to avoid undefined
      if (uri) {
        setPreviousImageUri(imageUri || null); // Ensure no undefined value is assigned
        setImageUri(uri);
  
        try {
          await AsyncStorage.setItem('previousImageUri', uri);
        } catch (error) {
          console.error('Error saving image to AsyncStorage:', error);
        }
  
        toggleExpand();
        await uploadImage(uri);
      }
    }
  };

  const uploadImage = async (uri: string) => {
    if (!uri) {
      Alert.alert('No image selected', 'Please choose an image first.');
      return;
    }
  
    setLoading(true); 
  
    const formData = new FormData();
    formData.append('image', {
      uri: uri,
      name: 'photo.jpg', 
      type: 'image/jpeg' 
    } as any);
  
    try {
      const response = await axios.post('https://backend-6ls0hsg0g-nikithanrajs-projects.vercel.app/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setExtractedText(response.data.extractedText); 
      setIsTextExtracted(true);
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Upload failed', 'There was an error uploading the image.');
    } finally {
      setLoading(false); 
      setPreviousImageUri(uri);
      setImageUri("");
    }
  };

  const loadPreviousImage = async () => {
    if (previousImageUri) {
      setImageUri(previousImageUri);
      await uploadImage(previousImageUri); 
    } else {
      Alert.alert('No previous image', 'There is no previously uploaded image.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredContent}>
      {!imageUri && (
        <View style={styles.logoAndTextContainer}>
          <Image source={require('./assets/fonts/Sprint1-Logo-For-lt-bg.png')} style={styles.logo} />
          <Text style={styles.infoText}>
            Effortlessly capture and save business card details to your contacts with just one click.
          </Text>

        <Text style={styles.infoText2}>
            Simply snap a photo, and the app handles the rest!
        </Text>
        </View>
      )}

        {imageUri && (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />
            {loading && <Text style={styles.loadingText}>Loading...</Text>}
          </>
        )}
      </View>
      <View style={styles.bottomBar}>
        {previousImageUri && (
          <TouchableOpacity onPress={loadPreviousImage} style={styles.previousImageContainer}>
            <Image source={{ uri: previousImageUri }} style={styles.previousImage} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
          <View style={styles.innerCircle}></View>
        </TouchableOpacity>

        <View style={styles.dotMenuContainer}>
          <TouchableOpacity onPress={toggleExpand}>
            <Icon name="more-vert" size={30} color="#00539CFF" />
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.expandedIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={chooseImageFromGallery}>
                <Icon name="photo-library" size={30} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
  loadingText: {
    fontSize: 18,
    color: 'blue',
    textAlign: 'center',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',    
  },
  logoAndTextContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250,  
    height: 70, 
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    paddingHorizontal: 40,
    marginBottom: 30,
    marginTop: 70,
  },
  infoText2: {
    fontSize: 16,
    textAlign: 'center',  
    color: 'black',
    paddingHorizontal: 40,
    fontWeight: 'bold'
  },
  bottomBar: {
    height: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  previousImageContainer: {
    position: 'absolute',
    width: 60,  
    height: 60,
    borderRadius: 10, 
    overflow: 'hidden',
    bottom: 45,
    left: 30
  },
  previousImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  captureButton: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: 'red', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 40, 
    height: 40,
    borderRadius: 50, 
    backgroundColor: '#fff'
  },
  dotMenuContainer: {
    alignItems: 'center',
    marginLeft: 10
  },
  expandedIcons: {
    position: 'absolute',
    top: -50, 
    left: 10,
    borderRadius: 5,
    padding: 0,
    height: 50,
    width: 50
  },
  iconButton: {
    padding: 10,
  },
});