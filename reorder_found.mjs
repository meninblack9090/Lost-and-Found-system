import fs from 'fs';

const filePath = 'lost-and-found-mobile/src/screens/ReportFoundScreen.js';
let content = fs.readFileSync(filePath, 'utf8');

// The current order around lines 68-80:
// Description, Category, Location (text), Condition (dropdown), Your Name, Contact
// Need to move Condition BEFORE Location to match ReportLostScreen

const oldBlock = `          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Location Found *</Text>
          <View style={styles.inputRow}><TextInput style={[styles.input, styles.inputFlex, { fontSize: scaledFontSize(15) }]} placeholder="Where was it found?" placeholderTextColor="#64748b" value={location} onChangeText={setLocation} /><MicButton onPress={() => openSpeech('location', 'Location Found')} active={activeMic === 'location'} /></View>
          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Condition</Text>
          <TouchableOpacity style={[styles.select, HC.touch]} onPress={() => { setShowCondition(!showCondition); setShowCategory(false); setShowLocation(false); if (!showCondition) speak('Select condition'); }} activeOpacity={0.7}><Text style={[condition ? styles.selectText : styles.placeholderText, { fontSize: scaledFontSize(15) }, condition && HC.text]}>{condition || 'Select condition'}</Text><Text style={[styles.arrow, showCondition && styles.arrowOpen]}>▼</Text></TouchableOpacity>
          {showCondition && (<View style={styles.dropdown}>{['Good', 'Damaged', 'Poor'].map(c => (<TouchableOpacity key={c} style={[styles.option, HC.touch]} onPress={() => { setCondition(c); setShowCondition(false); }}><Text style={[styles.optionText, HC.text, { fontSize: scaledFontSize(15) }]}>{c}</Text></TouchableOpacity>))}</View>)}`;

const newBlock = `          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Condition</Text>
          <TouchableOpacity style={[styles.select, HC.touch]} onPress={() => { setShowCondition(!showCondition); setShowCategory(false); setShowLocation(false); if (!showCondition) speak('Select condition'); }} activeOpacity={0.7}><Text style={[condition ? styles.selectText : styles.placeholderText, { fontSize: scaledFontSize(15) }, condition && HC.text]}>{condition || 'Select condition'}</Text><Text style={[styles.arrow, showCondition && styles.arrowOpen]}>▼</Text></TouchableOpacity>
          {showCondition && (<View style={styles.dropdown}>{['Good', 'Damaged', 'Poor'].map(c => (<TouchableOpacity key={c} style={[styles.option, HC.touch]} onPress={() => { setCondition(c); setShowCondition(false); }}><Text style={[styles.optionText, HC.text, { fontSize: scaledFontSize(15) }]}>{c}</Text></TouchableOpacity>))}</View>)}
          <Text style={[styles.label, HC.text, { fontSize: scaledFontSize(13) }]}>Location Found *</Text>
          <View style={styles.inputRow}><TextInput style={[styles.input, styles.inputFlex, { fontSize: scaledFontSize(15) }]} placeholder="Where was it found?" placeholderTextColor="#64748b" value={location} onChangeText={setLocation} /><MicButton onPress={() => openSpeech('location', 'Location Found')} active={activeMic === 'location'} /></View>`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done. Size:', fs.statSync(filePath).size);