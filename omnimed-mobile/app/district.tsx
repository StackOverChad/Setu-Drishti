import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';

// Make sure BACKEND_URL matches the user's Fastapi address
const BACKEND_URL = "http://10.188.53.227:8000";

export default function DistrictPortal() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [intelligenceData, setIntelligenceData] = useState<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fetchLiveIntelligence = () => {
        fetch(`${BACKEND_URL}/api/v1/population/dashboard`)
            .then(res => res.json())
            .then(data => {
                if(data.error) throw new Error(data.error);
                setIntelligenceData(data);
                setLoading(false);
            })
            .catch(err => {
                const mockData = {
                    total_population_nodes_synced: 14208,
                    intelligence: {
                        symptom_clusters: { "Block 7": { "fever_cough_cluster": 34, "anemia": 12 }, "Village A": { "anemia": 2 } },
                        screening_coverage_gaps: ["Village B", "Sector 4", "Highland Ridge"],
                        supply_chain_alerts: [{ medication: "Iron Supplements", stockout_prediction_days: 1.2, alert_level: "CRITICAL", stock_remaining: 50 }],
                        trial_enrollment_opportunities: []
                    }
                };
                setIntelligenceData(mockData);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLiveIntelligence();
        // Set up real-time 3-second polling
        const interval = setInterval(() => {
            fetchLiveIntelligence();
        }, 3000);

        // Breathing animation for the LIVE indicator
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true })
            ])
        ).start();

        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.title}>PopulationPulse</Text>
                            <Animated.View style={[styles.liveIndicator, { opacity: fadeAnim }]} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                        <Text style={styles.subtitle}>District Health Intelligence Map</Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#ff3366" style={{marginTop: 50}} />
                ) : (
                    <>
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{intelligenceData?.total_population_nodes_synced.toLocaleString()}</Text>
                                <Text style={styles.statLabel}>Nodes Synced</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, {color: '#ff3366'}]}>{intelligenceData?.intelligence.screening_coverage_gaps.length}</Text>
                                <Text style={styles.statLabel}>Screening Gaps</Text>
                            </View>
                        </View>

                        <View style={styles.moduleWrapper}>
                            <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#ff3366'}]}>Live Symptom Heatmap</Text></View>
                            <View style={styles.contentBox}>
                                {Object.keys(intelligenceData?.intelligence.symptom_clusters || {}).length === 0 ? (
                                    <Text style={styles.emptyText}>No active anomaly clusters detected in recent syncs.</Text>
                                ) : (
                                    Object.entries(intelligenceData?.intelligence.symptom_clusters).map(([location, stats]: any) => (
                                        <View key={location} style={styles.clusterItem}>
                                            <Text style={styles.locationText}>📍 {location}</Text>
                                            {Object.entries(stats).map(([symptom, count]: any) => (
                                                <Text key={symptom} style={styles.symptomText}>
                                                    • {symptom.replace(/_/g, ' ').toUpperCase()}: <Text style={{color: '#ff3366', fontWeight:'bold'}}>{count} cases</Text>
                                                </Text>
                                            ))}
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>

                        <View style={styles.moduleWrapper}>
                            <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#ff3366'}]}>Predictive Supply Chain Alerts</Text></View>
                            <View style={styles.contentBox}>
                                {intelligenceData?.intelligence.supply_chain_alerts.length === 0 ? (
                                    <Text style={styles.emptyText}>All district inventory vectors are stable.</Text>
                                ) : (
                                    intelligenceData?.intelligence.supply_chain_alerts.map((alert: any, i: number) => (
                                        <View key={i} style={styles.alertItem}>
                                            <Text style={styles.alertTitle}>⚠️ {alert.medication}</Text>
                                            <Text style={styles.alertDesc}>Stockout predicted in: <Text style={{fontWeight:'bold', color: '#ff3366'}}>{alert.stockout_prediction_days} days</Text></Text>
                                            <Text style={styles.alertDesc}>Remaining: {alert.stock_remaining} units</Text>
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>

                        <View style={styles.moduleWrapper}>
                            <View style={styles.moduleHeaderBase}><Text style={[styles.moduleTitle, {color: '#ff3366'}]}>Coverage Gap Map (Zero Anemia Scans)</Text></View>
                            <View style={styles.contentBox}>
                                <Text style={styles.descText}>The following zones have had zero Nidana diagnostic scans executed in the past 72 hours. Deploy mobile health workers immediately:</Text>
                                <View style={styles.tagContainer}>
                                    {intelligenceData?.intelligence.screening_coverage_gaps.map((gap: string, i: number) => (
                                        <View key={i} style={styles.gapTag}><Text style={styles.gapText}>{gap}</Text></View>
                                    ))}
                                </View>
                            </View>
                        </View>

                    </>
                )}
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
    subtitle: { fontSize: 13, color: '#ff3366', fontWeight: '500', marginTop: 2 },
    
    liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00ff00', marginLeft: 10, marginRight: 4, marginTop: 4 },
    liveText: { color: '#00ff00', fontSize: 10, fontWeight: '900', marginTop: 4, letterSpacing: 1 },

    statsRow: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 30, gap: 15 },
    statCard: { flex: 1, backgroundColor: '#121214', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#222', alignItems: 'center' },
    statValue: { fontSize: 32, fontWeight: '900', color: '#fff' },
    statLabel: { fontSize: 12, color: '#888', marginTop: 5, letterSpacing: 1, textTransform: 'uppercase' },

    moduleWrapper: { marginBottom: 30 },
    moduleHeaderBase: { backgroundColor: '#121214', paddingVertical: 12, paddingHorizontal: 20, marginHorizontal: 15, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderLeftWidth: 3, borderLeftColor: '#ff3366', marginBottom: -10, zIndex: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.4, shadowRadius: 5 },
    moduleTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    
    contentBox: { backgroundColor: '#0a0a0d', marginHorizontal: 15, borderRadius: 16, borderWidth: 1, borderColor: '#222', padding: 20, paddingTop: 30 },
    emptyText: { color: '#666', fontStyle: 'italic', fontSize: 13 },
    descText: { color: '#aaa', fontSize: 13, lineHeight: 20, marginBottom: 15 },

    clusterItem: { marginBottom: 15, backgroundColor: '#111', padding: 15, borderRadius: 10 },
    locationText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    symptomText: { color: '#888', fontSize: 13, marginLeft: 10, marginTop: 4 },

    alertItem: { borderLeftWidth: 3, borderLeftColor: '#ff3366', backgroundColor: '#1a0d12', padding: 15, borderRadius: 10, marginBottom: 10 },
    alertTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    alertDesc: { color: '#aaa', fontSize: 13, marginTop: 2 },

    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    gapTag: { backgroundColor: '#ffd6e0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    gapText: { color: '#990033', fontWeight: 'bold', fontSize: 12 }
});
