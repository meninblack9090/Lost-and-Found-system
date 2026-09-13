import fs from 'fs';

const filePath = 'lost-and-found-mobile/src/screens/ReportFoundScreen.js';

const content = `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { locations, categories } from '../data/mockData';
import SpeechInputModal, { MicButton } from '../components/SpeechInputModal';
import { useAccessibility } from '../context/AccessibilityContext';
import VoiceAssistant from '../components/VoiceAssistant';

export default function ReportFoundScreen({ navigation }) {
  const { speak, accessibilityStyles, scaledFontSize } = useAccessibility();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);
  const [condition, setCondition] = useState('');
  const [showCategory, setShowCategory] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showCondition, setShowCondition] = useState(false);

  const [speechModal, setSpeechModal] = useState({ visible: false, field: '', fieldName: '' });
  const [activeMic, setActiveMic] = useState('');

  const HC = accessibilityStyles;

  const openSpeech = (field, fieldName) => {
    setActiveMic(field);
    setSpeechModal({ visible: true, field, fieldName });
  };
  const handleSpeechResult = (text) => {
    const setters = { description: setDescription, name: setName, contact: setContact };
    if (setters[speechModal.field]) setters[speechModal.field](text);
    setActiveMic('');
  };
  const closeSpeech = () => { setSpeechModal({ visible: false, field: '', fieldName: '' }); setActiveMic(''); };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };
  const handleSubmit = () => {
    if (!description || !category || !location || !name) { speak('Please fill in all required fields.'); Alert.alert('Required', 'Please fill in all required fields'); return; }
    speak('Found item reported! ' + description + ' at ' + location + '. Thank you for helping!');
    Alert.alert('Report Submitted', 'Found item reported!\\n\\nItem: ' + description + '\\nLocation: ' + location + '\\nCategory: ' + category + '\\nCondition: ' + (condition || 'Not specified') + '\\n\\nThank you for helping!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={[styles.container, HC.container]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}><Text style={{ fontSize: scaledFontSize(28) }}>📦</Text></View>
          <Text style={[styles.title, HC.text, { fontSize: scaledFontSize(24) }]}>Report Found Item</Text>
          <Text style={[styles.subtitle, HC.textMuted, { fontSize: scaledFontSize(14) }]}>Help return a lost item to its owner</Text>
          <VoiceAssistant text="Report a found item. Fill in the description, category, and location." />
          <View style={[styles.speechHint, HC.card]}>
            <Text style={styles.speechHintIcon}>🎤</Text>
            <Text style={[styles.speechHintText, HC.textMuted, { fontSize: scaledFontSize(12) }]}>Tap the mic button next to any field to fill it by voice</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.imagePicker, HC.card, HC.touch]} onPress={pickImage} activeOpacity={0.7}>
          {image ? <Image source={{ uri: image }} style={styles.image} /> : (
            <View style={styles.imagePlaceholder}><Text style={styles.imageIcon}>📷</Text><Text style={[styles.imageText, HC.textMuted, { fontSize: scaledFontSize(14) }]}>Tap to add a photo</Text><Text style={[styles.imageSubtext, HC.textMuted, { fontSize: scaledFontSize(12) }]}>Optional</Text></View>
          )}
        </TouchableOpacity>
        {image && <TouchableOpacity onPress={() => setImage(null)}><Text style={[styles.removeImage, { fontSize: scaledFontSize(13) }]}>✕ Remove photo</Text></TouchableOpacity>}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Description *</Text>
          <View style={styles.inputRow}><TextInput style={[styles.input, styles.inputFlex, { fontSize: scaledFontSize(15) }]} placeholder="Describe the item (color, brand, features...)" placeholderTextColor="#64748b" value={description} onChangeText={setDescription} multiline numberOfLines={3} textAlignVertical="top" /><MicButton onPress={() => openSpeech('description', 'Description')} active={activeMic === 'description'} /></View>
          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Category *</Text>
          <TouchableOpacity style={[styles.select, HC.touch]} onPress={() => { setShowCategory(!showCategory); setShowLocation(false); setShowCondition(false); if (!showCategory) speak('Select category'); }} activeOpacity={0.7}><Text style={[category ? styles.selectText : styles.placeholderText, { fontSize: scaledFontSize(15) }, category && HC.text]}>{category || 'Select category'}</Text><Text style={[styles.arrow, showCategory && styles.arrowOpen]}>▼</Text></TouchableOpacity>
          {showCategory && (<View style={styles.dropdown}>{categories.map(c => (<TouchableOpacity key={c} style={[styles.option, HC.touch]} onPress={() => { setCategory(c); setShowCategory(false); }}><Text style={[styles.optionText, HC.text, { fontSize: scaledFontSize(15) }]}>{c}</Text></TouchableOpacity>))}</View>)}
          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Location Found *</Text>
          <TouchableOpacity style={[styles.select, HC.touch]} onPress={() => { setShowLocation(!showLocation); setShowCategory(false); setShowCondition(false); if (!showLocation) speak('Select location'); }} activeOpacity={0.7}><Text style={[location ? styles.selectText : styles.placeholderText, { fontSize: scaledFontSize(15) }, location && HC.text]}>{location || 'Select location'}</Text><Text style={[styles.arrow, showLocation && styles.arrowOpen]}>▼</Text></TouchableOpacity>
          {showLocation && (<View style={styles.dropdown}>{locations.map(l => (<TouchableOpacity key={l} style={[styles.option, HC.touch]} onPress={() => { setLocation(l); setShowLocation(false); }}><Text style={[styles.optionText, HC.text, { fontSize: scaledFontSize(15) }]}>{l}</Text></TouchableOpacity>))}</View>)}
          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Condition</Text>
          <TouchableOpacity style={[styles.select, HC.touch]} onPress={() => { setShowCondition(!showCondition); setShowCategory(false); setShowLocation(false); if (!showCondition) speak('Select condition'); }} activeOpacity={0.7}><Text style={[condition ? styles.selectText : styles.placeholderText, { fontSize: scaledFontSize(15) }, condition && HC.text]}>{condition || 'Select condition'}</Text><Text style={[styles.arrow, showCondition && styles.arrowOpen]}>▼</Text></TouchableOpacity>
          {showCondition && (<View style={styles.dropdown}>{['Good', 'Damaged', 'Poor'].map(c => (<TouchableOpacity key={c} style={[styles.option, HC.touch]} onPress={() => { setCondition(c); setShowCondition(false); }}><Text style={[styles.optionText, HC.text, { fontSize: scaledFontSize(15) }]}>{c}</Text></TouchableOpacity>))}</View>)}
          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Your Name *</Text>
          <View style={styles.inputRow}><TextInput style={[styles.input, styles.inputFlex, { fontSize: scaledFontSize(15) }]} placeholder="Full name" placeholderTextColor="#64748b" value={name} onChangeText={setName} /><MicButton onPress={() => openSpeech('name', 'Your Name')} active={activeMic === 'name'} /></View>
          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Contact Info</Text>
          <View style={styles.inputRow}><TextInput style={[styles.input, styles.inputFlex, { fontSize: scaledFontSize(15) }]} placeholder="Email or phone number" placeholderTextColor="#64748b" value={contact} onChangeText={setContact} keyboardType="email-address" /><MicButton onPress={() => openSpeech('contact', 'Contact Info')} active={activeMic === 'contact'} /></View>
        </View>
        <TouchableOpacity style={[styles.submitBtn, HC.touch]} onPress={handleSubmit} activeOpacity={0.8}><Text style={[styles.submitText, { fontSize: scaledFontSize(16) }]}>Submit Report</Text></TouchableOpacity>
      </ScrollView>
      <SpeechInputModal visible={speechModal.visible} fieldName={speechModal.fieldName} onClose={closeSpeech} onResult={handleSpeechResult} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' }, scroll: { padding: 20, paddingBottom: 40 }, headerSection: { alignItems: 'center', marginBottom: 24, marginTop: 8 }, headerIcon: { width: 60, height: 60, borderRadius: 18, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }, title: { fontSize: 24, fontWeight: '800', color: '#f1f5f9', letterSpacing: -0.3 }, subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 }, speechHint: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 14, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)', gap: 8 }, speechHintIcon: { fontSize: 16 }, speechHintText: { fontSize: 12, color: '#94a3b8', flex: 1, lineHeight: 18 }, imagePicker: { backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(148, 163, 184, 0.15)', borderStyle: 'dashed', overflow: 'hidden', marginBottom: 8 }, image: { width: '100%', height: 180, borderRadius: 16 }, imagePlaceholder: { height: 140, justifyContent: 'center', alignItems: 'center', padding: 20 }, imageIcon: { fontSize: 36 }, imageText: { fontSize: 14, color: '#94a3b8', fontWeight: '600', marginTop: 8 }, imageSubtext: { fontSize: 12, color: '#475569', marginTop: 2 }, removeImage: { color: '#ef4444', fontSize: 13, textAlign: 'center', marginBottom: 16, fontWeight: '600' }, inputGroup: { marginTop: 8 }, label: { fontSize: 13, fontWeight: '700', color: '#cbd5e1', marginBottom: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.3 }, inputRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 }, inputFlex: { flex: 1 }, input: { backgroundColor: 'rgba(15, 23, 42, 0.6)', borderWidth: 1, borderColor: 'rgba(148, 163, 184, 0.12)', borderRadius: 14, padding: 16, fontSize: 15, color: '#f1f5f9', minHeight: 50 }, select: { backgroundColor: 'rgba(15, 23, 42, 0.6)', borderWidth: 1, borderColor: 'rgba(148, 163, 184, 0.12)', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, selectText: { fontSize: 15, color: '#f1f5f9' }, placeholderText: { fontSize: 15, color: '#64748b' }, arrow: { fontSize: 10, color: '#64748b' }, arrowOpen: { transform: [{ rotate: '180deg' }] }, dropdown: { backgroundColor: 'rgba(30, 41, 59, 0.9)', borderRadius: 14, marginTop: 4, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(148, 163, 184, 0.08)' }, option: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(148, 163, 184, 0.05)' }, optionText: { fontSize: 15, color: '#e2e8f0' }, submitBtn: { backgroundColor: '#10b981', borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 28, shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }, submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
`;

fs.writeFileSync(filePath, content, 'utf8');
const size = fs.statSync(filePath).size;
console.log('File written successfully. Size:', size, 'bytes');