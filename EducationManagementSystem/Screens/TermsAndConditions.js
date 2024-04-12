import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

export default class TermsAndConditions extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Terms and Conditions</Text>
        <Text style={styles.content}>
          By using this application, you agree to abide by the following terms and conditions:
        </Text>
        <Text style={styles.sectionHeading}>1. Acceptance of Terms</Text>
        <Text style={styles.content}>
          Your access to and use of this application is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the application.
        </Text>
        <Text style={styles.sectionHeading}>2. Use License</Text>
        <Text style={styles.content}>
          Permission is granted to temporarily download one copy of the materials (information or software) on this application for personal, non-commercial transitory viewing only.
        </Text>
        <Text style={styles.sectionHeading}>3. User Accounts</Text>
        <Text style={styles.content}>
          In order to access certain features of the application, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account and password.
        </Text>
        <Text style={styles.sectionHeading}>4. Privacy</Text>
        <Text style={styles.content}>
          Your use of the application is also governed by our Privacy Policy. Please review our Privacy Policy, which explains how we collect, use, and disclose information that pertains to your privacy.
        </Text>
        <Text style={styles.sectionHeading}>5. Termination</Text>
        <Text style={styles.content}>
          We reserve the right to terminate or suspend access to your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </Text>
        <Text style={styles.sectionHeading}>6. Changes to Terms</Text>
        <Text style={styles.content}>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our application after those revisions become effective, you agree to be bound by the revised Terms.
        </Text>
        <Text style={styles.sectionHeading}>7. Contact Us</Text>
        <Text style={styles.content}>
          If you have any questions about these Terms, please contact us.
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
});
