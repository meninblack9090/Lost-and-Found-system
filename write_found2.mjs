import fs from 'fs';

const filePath = 'lost-and-found-mobile/src/screens/ReportFoundScreen.js';

let content = fs.readFileSync(filePath, 'utf8');

// Replace Location Found dropdown with text input
const oldLocationBlock = `          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Location Found *</Text>
          <TouchableOpacity style={[styles.select, HC.touch]} onPress={() => { setShowLocation(!showLocation); setShowCategory(false); setShowCondition(false); if (!showLocation) speak('Select location'); }} activeOpacity={0.7}><Text style={[location ? styles.selectText : styles.placeholderText, { fontSize: scaledFontSize(15) }, location && HC.text]}>{location || 'Select location'}</Text><Text style={[styles.arrow, showLocation && styles.arrowOpen]}>▼</Text></TouchableOpacity>
          {showLocation && (<View style={styles.dropdown}>{locations.map(l => (<TouchableOpacity key={l} style={[styles.option, HC.touch]} onPress={() => { setLocation(l); setShowLocation(false); }}><Text style={[styles.optionText, HC.text, { fontSize: scaledFontSize(15) }]}>{l}</Text></TouchableOpacity>))}</View>)}`;

const newLocationBlock = `          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Location Found *</Text>
          <View style={styles.inputRow}><TextInput style={[styles.input, styles.inputFlex, { fontSize: scaledFontSize(15) }]} placeholder="Where was it found?" placeholderTextColor="#64748b" value={location} onChangeText={setLocation} /><MicButton onPress={() => openSpeech('location', 'Location Found')} active={activeMic === 'location'} /></View>`;

content = content.replace(oldLocationBlock, newLocationBlock);

// Remove showLocation and showCondition close from category onPress since location is no longer a dropdown
// Also update setters for speech to include location
const oldSetters = `const setters = { description: setDescription, name: setName, contact: setContact };`;
const newSetters = `const setters = { description: setDescription, name: setName, contact: setContact, location: setLocation };`;
content = content.replace(oldSetters, newSetters);

fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated. Size:', fs.statSync(filePath).size);