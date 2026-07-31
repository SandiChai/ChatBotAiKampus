import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import {postChatText, postChatFile} from './API/chatBotService';
import Slider from '@react-native-community/slider';

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Halo! Saya AI Assistant Kampus. Ada yang bisa saya bantu hari ini?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [temperature, setTemperature] = useState(0.2);
  const flatListRef = useRef(null);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
        });
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      file: selectedFile,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = inputText;
    const attachedFile = selectedFile;

    setInputText('');
    setSelectedFile(null);
    setIsTyping(true);

    let replyText = ``;
    
    console.log("App.js TEMP : " + temperature);

    if(attachedFile){
      await postChatFile(currentPrompt, attachedFile, temperature).then(async (jsonChatResponse) => {
        if (jsonChatResponse) {
            replyText = jsonChatResponse.result;
            
            const botResponse = {
              id: (Date.now() + 1).toString(),
              text: replyText,
              sender: 'bot',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        } else {
            replyText = `Mohon Maaf, service chatbot sedang tidak available saat ini`;
            const botResponse = {
              id: (Date.now() + 1).toString(),
              text: replyText,
              sender: 'bot',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        }
      });
    }else{
      await postChatText(currentPrompt, temperature).then(async (jsonChatResponse) => {
        if (jsonChatResponse) {
            replyText = jsonChatResponse.result;
            
            const botResponse = {
              id: (Date.now() + 1).toString(),
              text: replyText,
              sender: 'bot',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        } else {
            replyText = `Mohon Maaf, service chatbot sedang tidak available saat ini`;
            const botResponse = {
              id: (Date.now() + 1).toString(),
              text: replyText,
              sender: 'bot',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        }
      });
    }
    
  };

  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'user';
    const isImage = item.file?.mimeType?.startsWith('image/');

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          {item.file && (
            <View style={styles.attachmentBox}>
              {isImage ? (
                <Image source={{ uri: item.file.uri }} style={styles.attachedImage} />
              ) : (
                <View style={styles.fileIconRow}>
                  <Ionicons name="document-attach" size={24} color={isUser ? '#fff' : '#0084ff'} />
                  <Text style={[styles.fileNameText, isUser ? styles.userText : styles.botText]}>
                    {item.file.name}
                  </Text>
                </View>
              )}
            </View>
          )}

          {item.text ? (
            <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
              {item.text}
            </Text>
          ) : null}

          <Text style={[styles.timeText, isUser ? styles.userTime : styles.botTime]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 ChatBot AI Sandi Kampus</Text>
        <Text style={styles.headerSubtitle}>Online | Ready to help - Copyright©2026</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        <View style={styles.temperatureContainer}>
          <View style={styles.tempHeaderRow}>
            <Text style={styles.tempTitle}>1 MODEL • 1 PERTANYAAN • <Text style={styles.highlightText}>PARAMETER BERBEDA</Text></Text>
          </View>

          <View style={styles.sliderControlRow}>
            <Text style={styles.tempLabel}>temperature</Text>
            <Text style={styles.tempValueText}>{temperature.toFixed(1)}</Text>
          </View>

          <Slider
            style={styles.sliderStyle}
            minimumValue={0.0}
            maximumValue={2.0}
            step={0.1}
            value={temperature}
            onValueChange={(val) => setTemperature(val)}
            minimumTrackTintColor="#f97316"
            maximumTrackTintColor="#334155"
            thumbTintColor="#f97316"
          />

          <View style={styles.sliderLabelsRow}>
            <Text style={styles.subLabel}>presisi</Text>
            <Text style={styles.subLabel}>kreatif</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#0084ff" />
            <Text style={styles.typingText}>Bot sedang mengetik...</Text>
          </View>
        )}

        {selectedFile && (
          <View style={styles.previewContainer}>
            <Ionicons name="document-text-outline" size={20} color="#0084ff" />
            <Text style={styles.previewText} numberOfLines={1}>
              {selectedFile.name}
            </Text>
            <TouchableOpacity onPress={() => setSelectedFile(null)}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.plusButton} onPress={handlePickDocument}>
            <Ionicons name="add" size={24} color="#0084ff" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Tulis pesan Anda..."
            placeholderTextColor="#8e8e93"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && !selectedFile && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() && !selectedFile}
          >
            <Text style={styles.sendButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { backgroundColor: '#1e293b', paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  chatContainer: { flex: 1, maxWidth: 800, width: '100%', alignSelf: 'center' },
  temperatureContainer: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tempHeaderRow: { alignItems: 'center', marginBottom: 10 },
  tempTitle: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold', letterSpacing: 0.5 },
  highlightText: { color: '#38bdf8' },
  sliderControlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tempLabel: { color: '#cbd5e1', fontSize: 13, fontWeight: '500' },
  tempValueText: { color: '#f97316', fontSize: 15, fontWeight: 'bold' },
  sliderStyle: { width: '100%', height: 30 },
  sliderLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -2 },
  subLabel: { color: '#64748b', fontSize: 11 },
  listContent: { paddingHorizontal: 16, paddingVertical: 12 },
  messageRow: { marginVertical: 4, flexDirection: 'row' },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble: { backgroundColor: '#0084ff', borderBottomRightRadius: 2 },
  botBubble: { backgroundColor: '#ffffff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#e2e8f0' },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: '#ffffff' },
  botText: { color: '#1e293b' },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  userTime: { color: '#dbeaff' },
  botTime: { color: '#94a3b8' },
  attachmentBox: { marginBottom: 6 },
  attachedImage: { width: 200, height: 150, borderRadius: 8 },
  fileIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fileNameText: { fontSize: 13, fontWeight: '500' },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 8,
  },
  previewText: { flex: 1, fontSize: 13, color: '#0369a1' },
  typingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 6 },
  typingText: { fontSize: 12, color: '#64748b', marginLeft: 8 },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
  },
  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  sendButton: {
    backgroundColor: '#0084ff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginLeft: 8,
  },
  sendButtonDisabled: { backgroundColor: '#cbd5e1' },
  sendButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
});