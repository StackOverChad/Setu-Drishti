import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import TrialBridge from '../components/TrialBridge';
import CameraScanner from '../components/CameraScanner';
import PulseWatch from '../components/PulseWatch';
import ToneScore from '../components/ToneScore';

export default function DoctorPortal() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Physician Portal</Text>
                        <Text style={styles.subtitle}>Clinical Intelligence Dashboard</Text>
                    </View>
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#00cc99'}]}>Eligibility Intelligence (TrialBridge)</Text></View>
                    <TrialBridge />
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#00cc99'}]}>Diagnostic Triage (Nidana)</Text></View>
                    <View style={styles.cameraContainer}>
                        <CameraScanner />
                    </View>
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#00cc99'}]}>Vital Anomalies (PulseWatch)</Text></View>
                    <PulseWatch />
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#00cc99'}]}>Composite Urgency (ToneScore)</Text></View>
                    <ToneScore />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#09090b' },
    scrollContent: { paddingBottom: 80, paddingTop: 20 },
    
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    
    titleContainer: { flex: 1 },
    title: { fontSize: 26, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 },
    subtitle: { fontSize: 13, color: '#00cc99', fontWeight: '500', marginTop: 2 },
    
    moduleWrapper: { marginBottom: 40 },
    moduleHeaderBase: { backgroundColor: '#121214', paddingVertical: 12, paddingHorizontal: 20, marginHorizontal: 15, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderLeftWidth: 3, borderLeftColor: '#00cc99', marginBottom: -10, zIndex: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.4, shadowRadius: 5 },
    moduleTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    
    cameraContainer: { height: 400, overflow: 'hidden', borderRadius: 16, marginHorizontal: 15, borderWidth: 1, borderColor: '#222' }
});
