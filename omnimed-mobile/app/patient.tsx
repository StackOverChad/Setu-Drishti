import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import PulseWatch from '../components/PulseWatch';
import TrialBridge from '../components/TrialBridge';
import PrivacyLedger from '../components/PrivacyLedger';

export default function PatientPortal() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Patient Terminal</Text>
                        <Text style={styles.subtitle}>Verified Health Passport & Privacy Manager</Text>
                    </View>
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#3399ff'}]}>Aggregator Device Sync (PulseWatch)</Text></View>
                    <PulseWatch />
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#3399ff'}]}>Clinical Trial Matches (TrialBridge)</Text></View>
                    <TrialBridge />
                </View>

                <View style={styles.moduleWrapper}>
                    <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#3399ff'}]}>Privacy & Consent Ledger</Text></View>
                    <PrivacyLedger />
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
    subtitle: { fontSize: 13, color: '#3399ff', fontWeight: '500', marginTop: 2 },
    
    moduleWrapper: { marginBottom: 40 },
    moduleHeaderBase: { backgroundColor: '#121214', paddingVertical: 12, paddingHorizontal: 20, marginHorizontal: 15, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderLeftWidth: 3, borderLeftColor: '#3399ff', marginBottom: -10, zIndex: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.4, shadowRadius: 5 },
    moduleTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
});
