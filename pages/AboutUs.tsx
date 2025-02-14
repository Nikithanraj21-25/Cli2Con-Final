import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        About Click2Contact
        <TouchableOpacity onPress={() => Linking.openURL("https://github.com/Nikithanraj21-25/Cli2Con-Final?tab=readme-ov-file")}>
        <FontAwesome name="external-link" size={24} color="black" style={styles.iconSpacing} />
      </TouchableOpacity>
      </Text>
      <Text style={styles.subtitle}>
      Click2Contact is a smart solution designed to simplify the way you manage and store contact information. Our app allows you to extract key details from visiting and business cards effortlessly, turning them into well-organized mobile contacts. Whether you're at a networking event or just need to organize your connections, Click2Contact helps you capture and store important details with just a click. No more manual data entry—just snap, save, and connect instantly.
      </Text>
      <Text style={styles.header}>About our team</Text>
      <Text style={styles.subtitle}>
      We are a passionate team of developers, designers, and tech enthusiasts driven by the vision to revolutionize contact management. With a shared commitment to innovation, we bring diverse expertise in mobile development, AI, and user experience design to ensure that Click2Contact offers seamless functionality and a smooth user experience. Our team believes in creating tools that empower users to focus on what truly matters—building meaningful connections.
      </Text>
      
      <Text style={styles.header}>Meet the Team</Text>
      <View style={styles.cardContainer}>
        {/* First Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nikithanraj A</Text>
          <Text style={styles.cardDescription}>
            App Developer
          </Text>
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/nikithanraj-ag/")}>
            <FontAwesome name="linkedin" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://github.com/Nikithanraj21-25")}>
            <FontAwesome name="github" size={24} color="black" style={styles.iconSpacing} />
          </TouchableOpacity>
          </View>
        </View>

        {/* Second Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Modugu Radha Krishna</Text>
          <Text style={styles.cardDescription}>
            App Developer
          </Text>
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/radha-krishna-5047a7281/")}>
            <FontAwesome name="linkedin" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://github.com/Radhakrishna07-M")}>
            <FontAwesome name="github" size={24} color="black" style={styles.iconSpacing} />
          </TouchableOpacity>
          </View>
        </View>

        {/* Third Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pokuru Tejesh</Text>
          <Text style={styles.cardDescription}>
            App Developer
          </Text> 
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/tejesh-pokuru-355a94227/")}>
            <FontAwesome name="linkedin" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://github.com/TEJ66")}>
            <FontAwesome name="github" size={24} color="black" style={styles.iconSpacing} />
          </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.header}>
        Our Collaboration Spirit
      </Text>

      <Text style={styles.subtitle}>
      At Click2Contact, we believe that great things happen when ideas and skills come together. Collaboration is at the heart of everything we do, from brainstorming the next big feature to resolving technical challenges as a team. Our culture fosters open communication and teamwork, both within our organization and with our users. We listen to feedback, refine our approach, and work together to deliver a product that continues to evolve with the needs of our users.
      </Text>



      <Text style={styles.header}>Join Us on Our Journey</Text>

      <Text style={styles.subtitle}>
      We’re just getting started! As we continue to expand and refine Click2Contact, we invite you to be part of our journey. Whether you’re a user looking for a smarter way to manage contacts or a developer interested in pushing the boundaries of mobile innovation, we welcome you. Together, we can transform the way people organize their professional networks. Join us and help shape the future of contact management!
      </Text>
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40, 
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 'auto', 
  },
  cardNumber: {
    fontSize: 16,
    color: '#999',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  card: {
    width: '30%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconSpacing: {
    marginHorizontal: 10,
    marginLeft: 10,
  },
});

export default AboutUs;