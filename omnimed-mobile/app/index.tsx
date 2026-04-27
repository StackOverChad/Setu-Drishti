import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.heroSection}>
                    <View style={styles.brandBadge}>
                        <Text style={styles.brandText}>INTELLIGENCE OS</Text>
                    </View>
                    <Text style={styles.title}>OmniMed Edge</Text>
                    <Text style={styles.subtitle}>Select your operational environment</Text>
                </View>

                <View style={styles.rolesContainer}>
                    {/* DOCTOR PORTAL */}
                    <TouchableOpacity activeOpacity={0.8} style={[styles.roleCard, styles.doctorGlow]} onPress={() => router.push('/doctor')}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(0, 204, 153, 0.1)' }]}>
                                <Text style={styles.roleIcon}>👨‍⚕️</Text>
                            </View>
                            <Text style={[styles.roleTitle, { color: '#00cc99' }]}>Physician{"\n"}Portal</Text>
                        </View>
                        <View style={styles.bulletList}>
                            <Text style={styles.bulletItem}><Text style={styles.bulletDot}>•</Text> AI Trial Matches</Text>
                            <Text style={styles.bulletItem}><Text style={styles.bulletDot}>•</Text> Neural Vision Analysis</Text>
                            <Text style={styles.bulletItem}><Text style={styles.bulletDot}>•</Text> Vital Anomalies</Text>
                            <Text style={styles.bulletItem}><Text style={styles.bulletDot}>•</Text> Risk Stratification</Text>
                        </View>
                    </TouchableOpacity>

                    {/* NURSE PORTAL */}
                    <TouchableOpacity activeOpacity={0.8} style={[styles.roleCard, styles.nurseGlow]} onPress={() => router.push('/nurse')}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 204, 0, 0.1)' }]}>
                                <Text style={styles.roleIcon}>👩‍⚕️</Text>
                            </View>
                            <Text style={[styles.roleTitle, { color: '#ffcc00' }]}>Frontline{"\n"}Triage</Text>
                        </View>
                        <View style={styles.bulletList}>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#ffcc00'}]}>•</Text> Neural Audio Intake</Text>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#ffcc00'}]}>•</Text> Contactless Vitals Scan</Text>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#ffcc00'}]}>•</Text> Post-Op Patient Recovery</Text>
                        </View>
                    </TouchableOpacity>

                    {/* PATIENT PORTAL */}
                    <TouchableOpacity activeOpacity={0.8} style={[styles.roleCard, styles.patientGlow]} onPress={() => router.push('/patient')}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(51, 153, 255, 0.1)' }]}>
                                <Text style={styles.roleIcon}>👤</Text>
                            </View>
                            <Text style={[styles.roleTitle, { color: '#3399ff' }]}>Patient{"\n"}Terminal</Text>
                        </View>
                        <View style={styles.bulletList}>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#3399ff'}]}>•</Text> BLE Sensor Sync</Text>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#3399ff'}]}>•</Text> Verified Medical Passport</Text>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#3399ff'}]}>•</Text> Patient Consent Ledger</Text>
                        </View>
                    </TouchableOpacity>

                    {/* DISTRICT PUSLE PORTAL */}
                    <TouchableOpacity activeOpacity={0.8} style={[styles.roleCard, styles.districtGlow]} onPress={() => router.push('/district')}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 51, 102, 0.1)' }]}>
                                <Text style={styles.roleIcon}>🗺️</Text>
                            </View>
                            <Text style={[styles.roleTitle, { color: '#ff3366' }]}>District{"\n"}Health Pulse</Text>
                        </View>
                        <View style={styles.bulletList}>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#ff3366'}]}>•</Text> District-wide Symptom Clusters</Text>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#ff3366'}]}>•</Text> Supply Chain Predictors</Text>
                            <Text style={styles.bulletItem}><Text style={[styles.bulletDot, {color: '#ff3366'}]}>•</Text> Geo-tagged Outbreak Data</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#09090b' },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 60, paddingTop: 60 },
    
    heroSection: { alignItems: 'center', marginBottom: 50 },
    brandBadge: { backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: '#333' },
    brandText: { color: '#aaa', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
    title: { fontSize: 38, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5, marginBottom: 8 },
    subtitle: { fontSize: 15, color: '#71717a', fontWeight: '500' },
    
    rolesContainer: { gap: 20 },
    
    roleCard: {
        flexDirection: 'column',
        padding: 24,
        backgroundColor: '#121214',
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
    },
    doctorGlow: { borderColor: 'rgba(0, 204, 153, 0.3)', shadowColor: '#00cc99' },
    nurseGlow: { borderColor: 'rgba(255, 204, 0, 0.3)', shadowColor: '#ffcc00' },
    patientGlow: { borderColor: 'rgba(51, 153, 255, 0.3)', shadowColor: '#3399ff' },
    districtGlow: { borderColor: 'rgba(255, 51, 102, 0.3)', shadowColor: '#ff3366' },

    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    iconWrapper: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginRight: 20 },
    roleIcon: { fontSize: 32 },
    
    roleTitle: { fontSize: 24, fontWeight: '800', letterSpacing: 0.5 },
    
    bulletList: { marginLeft: 10 },
    bulletItem: { fontSize: 13, color: '#e4e4e7', marginBottom: 8, fontWeight: '500', letterSpacing: 0.2 },
    bulletDot: { color: '#00cc99', fontWeight: '900', marginRight: 5, fontSize: 16 }
});
