import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import ToneScore from '../components/ToneScore';
import CameraScanner from '../components/CameraScanner';
import PulseWatch from '../components/PulseWatch';

export default function NursePortal() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Frontline Triage</Text>
                        <Text style={styles.subtitle}>Audio & Scan Intake Dashboard</Text>
                    </View>
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#ffcc00'}]}>Audio Intake & Queue Reordering (ToneScore)</Text></View>
                    <ToneScore />
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#ffcc00'}]}>Malnutrition & Vitals Scan (Nidana)</Text></View>
                    <View style={styles.cameraContainer}>
                        <CameraScanner />
                    </View>
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#ffcc00'}]}>Post-Op Drift Monitoring (PulseWatch)</Text></View>
                    <PulseWatch />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#09090b' },
    scrollContent: { paddingBottom: 80, paddingTop: 20 },
    
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 30 },
    
    titleContainer: { flex: 1 },
    title: { fontSize: 26, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 },
    subtitle: { fontSize: 13, color: '#ffcc00', fontWeight: '500', marginTop: 2 },
    
    moduleWrapper: { marginBottom: 40 },
    moduleHeaderBase: { backgroundColor: '#121214', paddingVertical: 12, paddingHorizontal: 20, marginHorizontal: 15, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderLeftWidth: 3, borderLeftColor: '#ffcc00', marginBottom: -10, zIndex: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.4, shadowRadius: 5 },
    moduleTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    
    cameraContainer: { height: 400, overflow: 'hidden', borderRadius: 16, marginHorizontal: 15, borderWidth: 1, borderColor: '#222' }
});
