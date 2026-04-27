import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, ActivityIndicator, PermissionsAndroid, Platform, Alert } from 'react-native';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import axios from 'axios';

export default function ToneScore() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [analysis, setAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Microphone Ready");
    
    // Waveform Animation Array
    const waves = [1, 2, 3, 4, 5].map(() => useRef(new Animated.Value(10)).current);

    useEffect(() => {
        // Native Voice Bindings
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechStart = () => {
        setIsRecording(true);
        setStatusMessage("Listening...");
    };

    const onSpeechEnd = () => {
        setIsRecording(false);
        setStatusMessage("Speech Ended. Processing...");
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
        // Handle common Android Speech Errors
        // 7 = No match found (timed out)
        // 11 = Processor didn't understand
        if (e.error?.code === "7") {
            setStatusMessage("No speech heard. Try again.");
        } else if (e.error?.code === "11") {
            setStatusMessage("Unintelligible audio. Speak clearly.");
        } else {
            console.warn("Native Voice Error:", e.error);
            setStatusMessage("Microphone Error.");
        }
        setIsRecording(false);
    };
    
    const onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value.length > 0) {
            setTranscript(e.value[0]);
            setStatusMessage("Speech Captured.");
        }
    };

    const requestMicPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Access Required',
                        message: 'OmniMed needs your microphone to analyze patient distress levels.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const toggleRecording = async () => {
        if (isRecording) {
            try {
                await Voice.stop();
            } catch (e) {
                console.error(e);
            }
        } else {
            const hasPermission = await requestMicPermission();
            if (!hasPermission) {
                Alert.alert("Permission Denied", "Microphone access is required for this feature.");
                return;
            }

            setTranscript("");
            setAnalysis(null);
            setStatusMessage("Initializing Mic...");
            try {
                await Voice.start('en-US'); 
            } catch (e) {
                console.error("Failed to start native microphone:", e);
                setStatusMessage("Mic Init Failed.");
            }
        }
    };

    // Waveform animations mathematically linked to recording state
    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.stagger(100, waves.map(wave => 
                    Animated.sequence([
                        Animated.timing(wave, { toValue: Math.random() * 40 + 20, duration: 250, useNativeDriver: false }),
                        Animated.timing(wave, { toValue: 10, duration: 250, useNativeDriver: false })
                    ])
                ))
            ).start();
        } else {
            waves.forEach(wave => wave.setValue(10));
        }
    }, [isRecording]);

    const processAudioTriage = async () => {
        if (isRecording) await Voice.stop();
        if (transcript.length < 2) {
            Alert.alert("Empty Input", "Please record some speech before processing.");
            return;
        }
        
        setIsAnalyzing(true);
        try {
            const BACKEND_URL = "http://10.188.53.227:8000";
            const response = await axios.post(`${BACKEND_URL}/api/v1/voice/analyze_tone`, {
                audio_base64: "REAL_NATIVE_VOICE_PAYLOAD",
                transcribed_text: transcript
            });
            setAnalysis(response.data);
            setStatusMessage("Analysis Complete.");
        } catch (error) {
            console.error("ToneScore Analysis Error:", error);
            setStatusMessage("Network Error.");
            Alert.alert("Connection Failed", "Check your laptop's IP address and connectivity.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>ToneScore Voice AI</Text>
                <Text style={styles.subtitle}>{statusMessage}</Text>
            </View>

            <View style={styles.waveformContainer}>
                {waves.map((wave, index) => (
                    <Animated.View key={index} style={[styles.waveBar, { height: wave, backgroundColor: isRecording ? '#ff3366' : '#555' }]} />
                ))}
            </View>

            <TouchableOpacity 
                style={[styles.recordButton, isRecording ? styles.recordingActive : {}]} 
                onPress={toggleRecording}
            >
                <Text style={styles.recordText}>
                    {isRecording ? "🔴 Stop Recording" : "🎤 Tap & Speak into Mic"}
                </Text>
            </TouchableOpacity>

            <View style={styles.inputBox}>
                <Text style={styles.label}>Native Raw Transcription:</Text>
                <TextInput 
                    style={styles.textInput}
                    multiline
                    value={transcript}
                    onChangeText={setTranscript}
                    editable={!isRecording}
                    placeholder="Speak to see live translation..."
                    placeholderTextColor="#666"
                />
            </View>

            <TouchableOpacity 
                style={[styles.analyzeButton, isAnalyzing || transcript === "" ? styles.analyzeDisabled : {}]} 
                onPress={processAudioTriage}
                disabled={isAnalyzing || transcript === ""}
            >
                {isAnalyzing ? <ActivityIndicator color="#000" /> : <Text style={styles.analyzeText}>Process NLP Sentiment Risk</Text>}
            </TouchableOpacity>

            {analysis && (
                <View style={[styles.resultsCard, { borderColor: analysis.triage_color === 'RED' ? '#ff3366' : analysis.triage_color === 'YELLOW' ? '#ffcc00' : '#00cc99' }]}>
                    <Text style={styles.resultTitle}>Code {analysis.triage_color} Triage Level</Text>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreLabel}>Acoustic Urgency:</Text>
                        <Text style={[styles.scoreValue, { color: analysis.urgency_score > 70 ? '#ff3366' : '#00cc99' }]}>
                            {analysis.acoustic_urgency_score}%
                        </Text>
                    </View>
                    <Text style={styles.emotions}>Detected: {analysis.detected_emotions.join(", ")}</Text>
                    <Text style={styles.recommendation}>{analysis.recommendation}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#0a0a0a', padding: 20, borderRadius: 15, marginHorizontal: 15, borderWidth: 1, borderColor: '#333' },
    header: { alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    subtitle: { fontSize: 13, color: '#ff3366', fontStyle: 'italic' },
    waveformContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 80, marginBottom: 20 },
    waveBar: { width: 8, borderRadius: 4, marginHorizontal: 4 },
    recordButton: { backgroundColor: '#222', borderWidth: 2, borderColor: '#555', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginBottom: 20 },
    recordingActive: { borderColor: '#ff3366', backgroundColor: '#330011' },
    recordText: { color: '#fff', fontWeight: 'bold' },
    inputBox: { marginBottom: 15 },
    label: { color: '#aaa', marginBottom: 5, fontSize: 12 },
    textInput: { backgroundColor: '#111', color: '#ccc', borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },
    analyzeButton: { backgroundColor: '#00cc99', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
    analyzeDisabled: { backgroundColor: '#444' },
    analyzeText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    resultsCard: { marginTop: 15, padding: 15, backgroundColor: '#111', borderLeftWidth: 5, borderRadius: 8 },
    resultTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    scoreLabel: { color: '#aaa', fontSize: 14 },
    scoreValue: { fontSize: 18, fontWeight: 'bold' },
    emotions: { color: '#888', fontStyle: 'italic', marginBottom: 10 },
    recommendation: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
